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

    // 6. NOWE: jeśli jesteśmy na stronie edycji posta
    if (document.getElementById('edit-post-form')) {
        initEditPostPage();
    }

    // 7. NOWE: inicjalizacja uploadu avatara, jeśli przycisk istnieje
    if (document.getElementById('upload-author-avatar')) {
        initAvatarUpload();
    }

    // 8. NOWE: inicjalizacja formularza ustawień treści
    if (document.getElementById('settings-form')) {
        initSettingsForm();
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

    // Wymuszenie ponownego obliczenia stylów w przeglądarce
    void document.documentElement.offsetHeight;
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

        API.saveTheme(data).then(response => {
            if (!response.ok) {
                throw response;
            }
            // Po udanym zapisie pobierz motyw z backendu i zastosuj go
            return API.getTheme();
        }).then(theme => {
            saveThemeToLocalStorage(theme);
            applyTheme(theme);
            showToast("Motyw zapisany w bazie!");
        }).catch(err => {
            console.error('Błąd zapisu motywu:', err);
            if (err.status === 400) {
                showToast("Błąd zapisu motywu: nieprawidłowe dane", 'error');
            } else {
                showToast(`Błąd zapisu motywu (kod: ${err.status})`, 'error');
            }
        });
    });
}

/* =========================================
   UPLOAD AVATARA (Settings)
   ========================================= */
function initAvatarUpload() {
    const avatarFileInput = document.getElementById('authorAvatarFile');
    const avatarUrlInput = document.getElementById('authorAvatar');
    const avatarUploadBtn = document.getElementById('upload-author-avatar');

    if (!avatarFileInput || !avatarUrlInput || !avatarUploadBtn) return;

    avatarUploadBtn.addEventListener('click', () => {
        const file = avatarFileInput.files && avatarFileInput.files[0];

        if (!file) {
            showToast('Wybierz plik avatara.', 'error');
            return;
        }
        if (!/^image\//.test(file.type)) {
            showToast('Wybrany plik nie jest obrazkiem.', 'error');
            return;
        }

        const fd = new FormData();
        fd.append('file', file);

        const originalText = avatarUploadBtn.innerText;
        avatarUploadBtn.innerText = 'Wgrywanie...';
        avatarUploadBtn.disabled = true;

        fetch('/api/images/upload', {
            method: 'POST',
            body: fd
        })
            .then(res => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(result => {
                if (!result || !result.url) {
                    throw new Error('Brak URL w odpowiedzi API obrazków');
                }
                avatarUrlInput.value = result.url;
                showToast('Avatar został wgrany. Kliknij "Zapisz ustawienia", aby zatwierdzić.');
            })
            .catch(err => {
                console.error('Błąd uploadu avatara:', err);
                showToast('Nie udało się wgrać avatara.', 'error');
            })
            .finally(() => {
                avatarUploadBtn.innerText = originalText;
                avatarUploadBtn.disabled = false;
            });
    });
}

/* =========================================
   USTAWIENIA TREŚCI (Settings)
   ========================================= */
function initSettingsForm() {
    const form = document.getElementById('settings-form');
    if (!form) return;

    // Podgląd na żywo dla koloru i rozmiaru tytułu H1
    const titleColorInput = document.getElementById('siteTitleColor');
    const titleSizeInput = document.getElementById('siteTitleSize');
    const titleAlignInput = document.getElementById('titleAlign');
    const h1Element = document.querySelector('header h1');

    if (titleColorInput && h1Element) {
        titleColorInput.addEventListener('input', (e) => {
            h1Element.style.color = e.target.value;
        });
    }

    if (titleSizeInput && h1Element) {
        titleSizeInput.addEventListener('input', (e) => {
            h1Element.style.fontSize = e.target.value + 'px';
        });
    }

    if (titleAlignInput && h1Element) {
        titleAlignInput.addEventListener('change', (e) => {
            h1Element.style.textAlign = e.target.value;
        });
    }

    // Przechwycenie wysyłania formularza przez AJAX
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerText : '';

        if (submitButton) {
            submitButton.innerText = 'Zapisywanie...';
            submitButton.disabled = true;
        }

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd zapisu ustawień');
                }
                return response.text();
            })
            .then(() => {
                // Zaktualizuj style H1 z wartości formularza
                if (h1Element) {
                    const titleColor = titleColorInput ? titleColorInput.value : null;
                    const titleSize = titleSizeInput ? titleSizeInput.value : null;
                    const titleAlign = titleAlignInput ? titleAlignInput.value : 'left';
                    const titleText = document.getElementById('siteTitle') ? document.getElementById('siteTitle').value : null;

                    if (titleColor) h1Element.style.color = titleColor;
                    if (titleSize) h1Element.style.fontSize = titleSize + 'px';
                    if (titleAlign) h1Element.style.textAlign = titleAlign;
                    if (titleText) h1Element.textContent = titleText;

                    // Wymuszenie ponownego obliczenia stylów
                    void h1Element.offsetHeight;
                }

                showToast('Ustawienia zapisane pomyślnie!');
            })
            .catch(err => {
                console.error('Błąd zapisu ustawień:', err);
                showToast('Nie udało się zapisać ustawień.', 'error');
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.innerText = originalText;
                    submitButton.disabled = false;
                }
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
// Helper: generuje skrót posta (usuwając tagi HTML)
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
                const badgeText = post.published
                    ? '<i class="demo-icon icon-users" title="Post publiczny"></i>'
                    : '<i class="demo-icon icon-lock" title="Post nieopublikowany"></i>';
                const date = new Date(post.createdAt).toLocaleString();
                const viewLink =
                    `<a href="/post/${post.id}" target="_blank" class="icon-btn" title="Zobacz post"><i class="icon-eye"></i></a>`;

                tr.innerHTML = `
                    <td>${post.id}</td>
                    <td style="font-weight: bold;">${post.title}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
                    <td style="font-size: 0.85rem;">${date}</td>
                    <td>
                        <div class="actions">
                            ${viewLink}
                            <a href="/admin/edit-post/${post.id}" class="icon-btn" title="Edytuj post"><i class="icon-pencil"></i></a>
                            <button class="btn-toggle icon-btn" data-id="${post.id}" data-pub="${post.published}" title="${post.published ? 'Ukryj post' : 'Opublikuj post'}">
                                <i class="${post.published ? 'icon-minus-squared' : 'icon-link-ext-alt'}"></i>
                            </button>
                            <button class="btn-delete icon-btn delete" data-id="${post.id}" title="Usuń post"><i class="icon-trash"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    }

    // Delegacja zdarzeń – ważne przy ikonach zamiast tekstu
    tbody.addEventListener('click', (e) => {
        // klik może wylądować na <i>, więc wędrujemy do <button>
        const toggleBtn = e.target.closest('.btn-toggle');
        const deleteBtn = e.target.closest('.btn-delete');

        // Publikacja / Ukrywanie
        if (toggleBtn && tbody.contains(toggleBtn)) {
            const id = toggleBtn.getAttribute('data-id');
            if (!id) return;

            const isPublished = toggleBtn.getAttribute('data-pub') === 'true';

            API.updatePost(id, { published: !isPublished })
                .then(() => {
                    // po zapisie przeładuj tabelę, dzięki czemu nowe
                    // data-pub, ikona i badge będą spójne
                    renderTable();
                });
            return;
        }

        // Usuwanie
        if (deleteBtn && tbody.contains(deleteBtn)) {
            const id = deleteBtn.getAttribute('data-id');
            if (!id) return;

            if (confirm("Czy na pewno usunąć ten post?")) {
                API.deletePost(id).then(() => renderTable());
            }
        }
    });

    // Pierwsze ładowanie tabeli
    renderTable();
}

/* =========================================
   DODAWANIE POSTA (Z QUILL JS + UPLOAD OBRAZKÓW + TRYB HTML)
   ========================================= */
function initAddPostPage() {
    const form = document.getElementById('add-post-form');
    if (!form) return;

    if (typeof Quill === 'undefined') {
        console.error("Quill JS nie został załadowany!");
        return;
    }

    const quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Zacznij pisać swoją historię...',
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image', 'code-block'],
                    ['clean']
                ]
            }
        }
    });

    const htmlTextarea = document.getElementById('editor-raw-html');
    const btnQuill = document.getElementById('btn-editor-quill');
    const btnHtml = document.getElementById('btn-editor-html');
    const editorContainer = document.getElementById('editor-container');

    let currentMode = 'quill'; // 'quill' lub 'html'

    function updateEditorModeButtons() {
        if (!btnQuill || !btnHtml) return;
        if (currentMode === 'quill') {
            btnQuill.classList.add('button--active');
            btnHtml.classList.remove('button--active');
        } else {
            btnHtml.classList.add('button--active');
            btnQuill.classList.remove('button--active');
        }
    }

    if (btnQuill) {
        btnQuill.addEventListener('click', () => {
            if (currentMode === 'quill') return;
            // Z HTML → Quill: wstrzykujemy zawartość textarea do edytora
            quill.root.innerHTML = htmlTextarea.value || '';
            htmlTextarea.style.display = 'none';
            if (editorContainer) editorContainer.style.display = 'block';
            currentMode = 'quill';
            updateEditorModeButtons();
        });
    }

    if (btnHtml) {
        btnHtml.addEventListener('click', () => {
            if (currentMode === 'html') return;
            // Z Quilla → HTML: bierze HTML z edytora
            htmlTextarea.value = quill.root.innerHTML;
            if (editorContainer) editorContainer.style.display = 'none';
            htmlTextarea.style.display = 'block';
            currentMode = 'html';
            updateEditorModeButtons();
        });
    }

    updateEditorModeButtons();

    // Custom handler obrazków – zamiast base64 wysyłamy na backend
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
        if (currentMode !== 'quill') {
            showToast('Wstawianie obrazków działa tylko w trybie edytora wizualnego.', 'error');
            return;
        }
        selectLocalImage();
    });

    function selectLocalImage() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;
            if (!/^image\//.test(file.type)) {
                showToast('Wybrany plik nie jest obrazkiem.', 'error');
                return;
            }
            saveImageToServer(file);
        };
    }

    function saveImageToServer(file) {
        const fd = new FormData();
        fd.append('file', file);

        fetch('/api/images/upload', {
            method: 'POST',
            body: fd
        })
            .then(res => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(result => {
                if (!result || !result.url) {
                    throw new Error('Brak URL w odpowiedzi API obrazków');
                }
                insertImageToEditor(result.url);
            })
            .catch(err => {
                console.error('Błąd uploadu obrazka:', err);
                showToast('Nie udało się wgrać zdjęcia.', 'error');
            });
    }

    function insertImageToEditor(url) {
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, 'image', url, 'user');
        quill.setSelection(index + 1, 0, 'user');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleEl = document.getElementById('title');
        const publishedEl = document.getElementById('published');

        const title = titleEl ? titleEl.value.trim() : '';
        const published = publishedEl ? publishedEl.checked : false;

        let content;
        let plainText;
        if (currentMode === 'quill') {
            content = quill.root.innerHTML;
            plainText = quill.getText().trim();
        } else {
            content = htmlTextarea.value || '';
            // proste usuwanie tagów HTML do walidacji
            plainText = content.replace(/<[^>]*>/g, '').trim();
        }

        if (!title) {
            showToast('Podaj tytuł posta.', 'error');
            return;
        }
        if (!plainText.length) {
            showToast('Treść posta nie może być pusta!', 'error');
            return;
        }

        const postData = { title, content, published };

        API.createPost(postData)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                showToast('Post dodany pomyślnie!');
                window.location.href = '/admin';
            })
            .catch(err => {
                console.error('Błąd przy dodawaniu posta:', err);
                showToast(`Wystąpił błąd przy dodawaniu posta (kod: ${err.status}).`, 'error');
            });
    });
}

/* =========================================
   EDYCJA POSTA (Z QUILL JS + TRYB HTML)
   ========================================= */
function initEditPostPage() {
    const form = document.getElementById('edit-post-form');
    if (!form) return;

    if (typeof Quill === 'undefined') {
        console.error("Quill JS nie został załadowany (edycja posta)!");
        return;
    }

    const editorContainer = document.getElementById('editor-container');
    const htmlTextarea = document.getElementById('editor-raw-html');
    const btnQuill = document.getElementById('btn-editor-quill');
    const btnHtml = document.getElementById('btn-editor-html');

    const quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Edytuj treść posta...',
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

    let currentMode = 'quill';

    function updateEditorModeButtonsEdit() {
        if (!btnQuill || !btnHtml) return;
        if (currentMode === 'quill') {
            btnQuill.classList.add('button--active');
            btnHtml.classList.remove('button--active');
        } else {
            btnHtml.classList.add('button--active');
            btnQuill.classList.remove('button--active');
        }
    }

    if (btnQuill) {
        btnQuill.addEventListener('click', () => {
            if (currentMode === 'quill') return;
            quill.root.innerHTML = htmlTextarea.value || '';
            htmlTextarea.style.display = 'none';
            if (editorContainer) editorContainer.style.display = 'block';
            currentMode = 'quill';
            updateEditorModeButtonsEdit();
        });
    }

    if (btnHtml) {
        btnHtml.addEventListener('click', () => {
            if (currentMode === 'html') return;
            htmlTextarea.value = quill.root.innerHTML;
            if (editorContainer) editorContainer.style.display = 'none';
            htmlTextarea.style.display = 'block';
            currentMode = 'html';
            updateEditorModeButtonsEdit();
        });
    }

    updateEditorModeButtonsEdit();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const idEl = document.getElementById('post-id');
        const titleEl = document.getElementById('title');
        const publishedEl = document.getElementById('published');

        const id = idEl ? idEl.value : null;
        const title = titleEl ? titleEl.value.trim() : '';
        const published = publishedEl ? publishedEl.checked : false;

        let content;
        let plainText;
        if (currentMode === 'quill') {
            content = quill.root.innerHTML;
            plainText = quill.getText().trim();
        } else {
            content = htmlTextarea.value || '';
            plainText = content.replace(/<[^>]*>/g, '').trim();
        }

        if (!id) {
            showToast('Brak ID posta.', 'error');
            return;
        }
        if (!title) {
            showToast('Podaj tytuł posta.', 'error');
            return;
        }
        if (!plainText.length) {
            showToast('Treść posta nie może być pusta!', 'error');
            return;
        }

        const postData = { title, content, published };

        API.updatePost(id, postData)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                showToast('Post zaktualizowany pomyślnie!');
                window.location.href = '/admin';
            })
            .catch(err => {
                console.error('Błąd przy edycji posta:', err);
                showToast(`Wystąpił błąd przy edycji posta (kod: ${err.status}).`, 'error');
            });
    });
}

/* =========================================
   TOAST (powiadomienia)
   ========================================= */
function showToast(message, type = 'success', timeout = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message); // fallback
        return;
    }
    toast.textContent = message;
    toast.className = 'toast toast--' + (type === 'error' ? 'error' : 'success');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, timeout);
}

// Przykład lepszej obsługi fetch dla createPost/updatePost można rozszerzyć tak:
// API.createPost = async (data) => {
//   const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
//   if (!res.ok) throw res; // w catch można sprawdzić res.status
// };
