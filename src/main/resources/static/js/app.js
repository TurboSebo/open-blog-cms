// Globalne skrypty frontendu dla Open Blog CMS

// Ładowanie listy postów na stronie głównej
function initBlogFeed() {
    const feedContainer = document.getElementById('blog-feed');
    if (!feedContainer) {
        return; // Nie jesteśmy na stronie głównej
    }

    feedContainer.innerHTML = '<p class="muted">Ładowanie wpisów...</p>';

    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            feedContainer.innerHTML = '';

            const publishedPosts = posts.filter(p => p.published);

            if (publishedPosts.length === 0) {
                feedContainer.innerHTML = '<p>Brak opublikowanych wpisów.</p>';
                return;
            }

            publishedPosts.forEach(post => {
                const postElement = document.createElement('section');
                postElement.style.marginBottom = '40px';
                postElement.style.borderBottom = '1px solid var(--c-border)';
                postElement.style.paddingBottom = '20px';

                const date = new Date(post.createdAt).toLocaleDateString('pl-PL');

                postElement.innerHTML = `
                    <h3 style="margin-bottom: 10px; color: var(--c-primary);">${post.title}</h3>
                    <div class="muted" style="margin-bottom: 15px; font-size: 0.85rem;">
                        Dodano: ${date}
                    </div>
                    <div class="content">
                        ${post.content}
                    </div>
                `;
                feedContainer.appendChild(postElement);
            });
        })
        .catch(err => {
            console.error('Błąd pobierania postów:', err);
            feedContainer.innerHTML = '<p style="color: red;">Nie udało się pobrać wpisów.</p>';
        });
}

// Ładowanie motywu z backendu i ustawianie zmiennych CSS
function loadTheme() {
    fetch('/api/theme')
        .then(res => res.json())
        .then(theme => {
            const root = document.documentElement.style;
            if (theme.colorPrimary) root.setProperty('--c-primary', theme.colorPrimary);
            if (theme.colorHeaderBg) root.setProperty('--c-header-bg', theme.colorHeaderBg);
            if (theme.colorAsideBg) root.setProperty('--c-aside-bg', theme.colorAsideBg);
            if (theme.colorMainBg) root.setProperty('--c-main-bg', theme.colorMainBg);
            if (theme.colorSurface) root.setProperty('--c-surface', theme.colorSurface);
            if (theme.colorBodyBg) root.setProperty('--c-body-bg', theme.colorBodyBg);
            if (theme.colorText) root.setProperty('--c-body-fg', theme.colorText);
        })
        .catch(err => console.error('Nie udało się załadować motywu:', err));
}

// Inicjalizacja po załadowaniu DOM
window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initBlogFeed();
});

