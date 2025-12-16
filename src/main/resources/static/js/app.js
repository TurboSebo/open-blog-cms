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

    // 5. NOWE: jeśli jesteśmy na stronie dodawania posta
    if (document.getElementById('add-post-form')) {
        initAddPostPage();
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
    // NOWE: Wysyłanie nowego posta
    createPost: (data) => fetch('/api/posts', {
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
   PREDEFINIOWANE MOTYWY
   ========================================= */
const PREDEFINED_THEMES = [
    {
        id: 'light',
        label: 'Jasny',
        description: 'Jasne tła, ciemny tekst – czytelny w dzień.',
        presetClass: 'preset-light',
        colorPrimary: '#2563eb',
        colorHeaderBg: '#e5e7eb',
        colorAsideBg: '#f3f4f6',
        colorMainBg: 'transparent',
        colorSurface: '#ffffff',
        colorBodyBg: '#f9fafb',
        colorText: '#111827'
    },
    {
        id: 'dark',
        label: 'Ciemny',
        description: 'Obecny motyw domyślny – dobry na wieczór.',
        presetClass: 'preset-dark',
        colorPrimary: '#3b82f6',
        colorHeaderBg: '#1e293b',
        colorAsideBg: '#1e293b',
        colorMainBg: 'transparent',
        colorSurface: '#1e293b',
        colorBodyBg: '#0f172a',
        colorText: '#e2e8f0'
    },
    {
        id: 'solarized',
        label: 'Solarized',
        description: 'Ciepły, kontrastowy motyw inspirowany Solarized.',
        presetClass: 'preset-solarized',
        colorPrimary: '#b58900',
        colorHeaderBg: '#002b36',
        colorAsideBg: '#073642',
        colorMainBg: 'transparent',
        colorSurface: '#002b36',
        colorBodyBg: '#001f27',
        colorText: '#eee8d5'
    },
    {
        id: 'colorful',
        label: 'Kolorowy',
        description: 'Mocniejsze kolory akcentów, blog „na kolorowo”.',
        presetClass: 'preset-colorful',
        colorPrimary: '#ec4899',
        colorHeaderBg: '#4f46e5',
        colorAsideBg: '#1e293b',
        colorMainBg: 'transparent',
        colorSurface: '#020617',
        colorBodyBg: '#020617',
        colorText: '#e5e7eb'
    }
];

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
    if (!theme) return;
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

    // Predefiniowane motywy – generowanie kafelków
    const presetsContainer = document.getElementById('theme-presets');
    if (presetsContainer) {
        PREDEFINED_THEMES.forEach(theme => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = `theme-preset ${theme.presetClass}`;
            el.setAttribute('data-theme-id', theme.id);

            el.innerHTML = `
                <span class="theme-preset__name">${theme.label}</span>
                <span class="theme-preset__desc">${theme.description}</span>
                <div class="theme-preset__preview">
                    <span></span><span></span><span></span>
                </div>
            `;

            el.addEventListener('click', () => {
                // Ustaw wartości w formularzu
                const map = {
                    'color-primary': theme.colorPrimary,
                    'color-header-bg': theme.colorHeaderBg,
                    'color-aside-bg': theme.colorAsideBg,
                    'color-main-bg': theme.colorMainBg,
                    'color-surface': theme.colorSurface,
                    'color-body-bg': theme.colorBodyBg,
                    'color-text': theme.colorText
                };

                Object.entries(map).forEach(([id, value]) => {
                    const input = document.getElementById(id);
                    if (input && value) {
                        input.value = value;
                    }
                });

                // Podgląd na żywo
                applyTheme(theme);

                // Zaznaczenie wybranego kafelka
                presetsContainer
                    .querySelectorAll('.theme-preset')
                    .forEach(btn => btn.classList.remove('theme-preset--selected'));
                el.classList.add('theme-preset--selected');
            });

            presetsContainer.appendChild(el);
        });
    }

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
// Helper: generuje zajawkę z HTML (ograniczenie długości tekstu)
function getPostExcerpt(htmlContent, maxLength = 300) {
    if (!htmlContent) return '';
    // Tworzymy tymczasowy element, aby wyrzucić tagi HTML
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlContent;
    const text = tmp.textContent || tmp.innerText || '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '…';
}

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

            const excerpt = getPostExcerpt(post.content, 300);

            article.innerHTML = `
                <h3 style="color: var(--c-primary)">
                    <a href="/post/${post.id}" style="color: inherit; text-decoration: none;">
                        ${post.title}
                    </a>
                </h3>
                <div class="muted" style="font-size: 0.8rem; margin-bottom: 10px;">${date}</div>
                <div style="margin-bottom: 8px;">${excerpt}</div>
                <a href="/post/${post.id}" style="font-size: 0.85rem;">Czytaj więcej →</a>
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

                const viewLink = post.published
                    ? `<a href="/post/${post.id}" target="_blank" style="margin-left: 8px; font-size: 0.8rem;">Podgląd</a>`
                    : '';

                tr.innerHTML = `
                    <td>${post.id}</td>
                    <td style="font-weight: bold;">${post.title}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span>${viewLink}</td>
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

/* =========================================
   DODAWANIE POSTA (Z QUILL JS)
   ========================================= */
function initAddPostPage() {
    const form = document.getElementById('add-post-form');
    if (!form) return;

    // 1. Inicjalizacja Quilla
    if (typeof Quill === 'undefined') {
        console.error("Quill JS nie został załadowany!");
        return;
    }

    const quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Zacznij pisać swoją historię...',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean']
            ]
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleEl = document.getElementById('title');
        const publishedEl = document.getElementById('published');

        const title = titleEl ? titleEl.value.trim() : '';
        const published = publishedEl ? publishedEl.checked : false;

        // 2. Pobieramy HTML z Quilla
        const content = quill.root.innerHTML;

        // Walidacja - czy użytkownik coś wpisał?
        if (!title) {
            alert('Podaj tytuł posta.');
            return;
        }
        if (quill.getText().trim().length === 0) {
            alert('Treść posta nie może być pusta!');
            return;
        }

        const postData = {
            title,
            content,
            published
        };

        API.createPost(postData)
            .then(response => {
                if (response.ok) {
                    alert('Post dodany pomyślnie!');
                    window.location.href = '/admin';
                } else {
                    alert('Wystąpił błąd przy dodawaniu posta.');
                }
            })
            .catch(err => {
                console.error('Błąd przy dodawaniu posta:', err);
                alert('Wystąpił błąd przy dodawaniu posta.');
            });
    });
}
