document.addEventListener("DOMContentLoaded", () => {
    // 1. Zawsze ładuj motyw na starcie (aktualizacja z backendu + synchronizacja localStorage)
    loadTheme();

    // 2. Jeśli jesteśmy na stronie głównej (div #blog-feed istnieje)
    if (document.getElementById('blog-feed')) {
        initHomePage();
    }

    // 3. Jeśli jesteśmy w panelu admina (tabela #posts-table-body istnieje)
    if (document.getElementById('posts-table-body')) {
        initAdminDashboard();
    }

    // 4. Jeśli jest formularz motywu
    if (document.getElementById('theme-form')) {
        initThemeEditor();
    }
});

/* =========================================
   LOGIKA API (Backend Communication)
   ========================================= */
const API = {
    getPosts: () => fetch('/api/posts').then(r => r.json()),
    getTheme: () => fetch('/api/theme').then(r => r.json()),
    saveTheme: (data) => fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updatePost: (id, data) => fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deletePost: (id) => fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    })
};

/* =========================================
   FUNKCJE MOTYWU
   ========================================= */
function saveThemeToLocalStorage(theme) {
    try {
        if (window.localStorage && theme) {
            localStorage.setItem('obcms.theme', JSON.stringify(theme));
        }
    } catch (e) {
        console.warn('Nie udało się zapisać motywu w localStorage:', e);
    }
}

function loadTheme() {
    API.getTheme().then(theme => {
        // Zapisz najnowszy motyw z backendu do localStorage (dla szybkiego zastosowania przy kolejnym wejściu)
        saveThemeToLocalStorage(theme);
        applyTheme(theme);
        // Jeśli jesteśmy w panelu edycji, wypełnij inputy wartościami z bazy
        if (document.getElementById('theme-form')) {
            fillThemeForm(theme);
        }
    }).catch(err => console.error("Błąd ładowania motywu:", err));
}

function applyTheme(theme) {
    const root = document.documentElement.style;
    if(theme.colorPrimary) root.setProperty('--c-primary', theme.colorPrimary);
    if(theme.colorHeaderBg) root.setProperty('--c-header-bg', theme.colorHeaderBg);
    if(theme.colorAsideBg) root.setProperty('--c-aside-bg', theme.colorAsideBg);
    if(theme.colorMainBg) root.setProperty('--c-main-bg', theme.colorMainBg);
    if(theme.colorSurface) root.setProperty('--c-surface', theme.colorSurface);
    if(theme.colorBodyBg) root.setProperty('--c-body-bg', theme.colorBodyBg);
    if(theme.colorText) root.setProperty('--c-body-fg', theme.colorText);
}

function initThemeEditor() {
    const form = document.getElementById('theme-form');

    // Podgląd na żywo przy zmianie koloru w inputach
    form.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const cssVarMap = {
                'colorPrimary': '--c-primary',
                'colorHeaderBg': '--c-header-bg',
                'colorAsideBg': '--c-aside-bg',
                'colorMainBg': '--c-main-bg',
                'colorSurface': '--c-surface',
                'colorBodyBg': '--c-body-bg',
                'colorText': '--c-body-fg'
            };
            const varName = cssVarMap[e.target.name];
            if (varName) {
                document.documentElement.style.setProperty(varName, e.target.value);
            }
        }
    });

    // Zapis do bazy
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        API.saveTheme(data).then(() => {
            // Po udanym zapisie aktualizujemy cache i stosujemy motyw
            saveThemeToLocalStorage(data);
            applyTheme(data);
            alert("Motyw zapisany w bazie!");
        }).catch(err => {
            console.error('Błąd zapisu motywu:', err);
            alert("Błąd zapisu motywu");
        });
    });
}

function fillThemeForm(theme) {
    // Helper: sprawdza czy to hex (prosta walidacja)
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val && val.startsWith('#')) el.value = val;
    };

    setVal('color-primary', theme.colorPrimary);
    setVal('color-header-bg', theme.colorHeaderBg);
    setVal('color-aside-bg', theme.colorAsideBg);
    setVal('color-main-bg', theme.colorMainBg);
    setVal('color-surface', theme.colorSurface);
    setVal('color-body-bg', theme.colorBodyBg);
    setVal('color-text', theme.colorText);
}

/* =========================================
   STRONA GŁÓWNA (INDEX)
   ========================================= */
function initHomePage() {
    const container = document.getElementById('blog-feed');
    API.getPosts().then(posts => {
        container.innerHTML = '';
        const published = posts.filter(p => p.published);

        if (published.length === 0) {
            container.innerHTML = '<p class="muted">Brak wpisów.</p>';
            return;
        }

        published.forEach(post => {
            const date = new Date(post.createdAt).toLocaleDateString();
            const article = document.createElement('article');
            article.style.marginBottom = '20px';
            article.innerHTML = `
                <h3 style="color: var(--c-primary)">${post.title}</h3>
                <div class="muted" style="font-size: 0.8rem; margin-bottom: 10px;">${date}</div>
                <div>${post.content}</div>
                <hr>
            `;
            container.appendChild(article);
        });
    });
}

/* =========================================
   PANEL ADMINA (DASHBOARD)
   ========================================= */
function initAdminDashboard() {
    const tbody = document.getElementById('posts-table-body');

    function renderTable() {
        API.getPosts().then(posts => {
            tbody.innerHTML = '';
            if (posts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Brak postów w bazie.</td></tr>';
                return;
            }

            posts.forEach(post => {
                const tr = document.createElement('tr');
                const badgeClass = post.published ? 'published' : 'draft';
                const badgeText = post.published ? 'Opublikowany' : 'Szkic';
                const date = new Date(post.createdAt).toLocaleString();

                tr.innerHTML = `
                    <td>${post.id}</td>
                    <td style="font-weight: bold;">${post.title}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
                    <td style="font-size: 0.85rem;">${date}</td>
                    <td>
                        <button class="btn-toggle" data-id="${post.id}" data-pub="${post.published}">
                            ${post.published ? 'Ukryj' : 'Publikuj'}
                        </button>
                        <button class="btn-delete" style="background-color: #ef4444;" data-id="${post.id}">Usuń</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    }

    // Obsługa kliknięć w tabeli (Delegacja zdarzeń)
    tbody.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (!id) return;

        // Publikacja / Ukrywanie
        if (e.target.classList.contains('btn-toggle')) {
            const isPublished = e.target.getAttribute('data-pub') === 'true';
            API.updatePost(id, { published: !isPublished }).then(() => renderTable());
        }

        // Usuwanie
        if (e.target.classList.contains('btn-delete')) {
            if (confirm("Czy na pewno usunąć ten post?")) {
                API.deletePost(id).then(() => renderTable());
            }
        }
    });

    // Pierwsze ładowanie tabeli
    renderTable();
}
