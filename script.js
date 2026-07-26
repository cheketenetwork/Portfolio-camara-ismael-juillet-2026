const themeToggle = document.getElementById('theme-toggle');
const accueilButton = document.getElementById('btn-salutation');
const accueilMessage = document.getElementById('message-accueil');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Menu hamburger
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Restauration du thème au chargement
if (localStorage.getItem('portfolio_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️ Mode clair';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
    });
}

if (accueilButton && accueilMessage) {
    accueilButton.addEventListener('click', () => {
        accueilMessage.textContent = 'Bienvenue sur mon portfolio, suivez mon évolution en tant que VibeCoder à mes côtés!';
    });
}

document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.querySelectorAll('.carte-projet').forEach((carte) => {
    carte.addEventListener('click', () => {
        document.querySelectorAll('.carte-projet').forEach((item) => {
            item.classList.remove('selected');
        });

        carte.classList.add('selected');
    });
});
