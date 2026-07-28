// Données des projets (Modifiables uniquement ici dans le code)
const projetsData = {
    '1': {
        titre: 'Projet 1 : IvoPlan',
        sousTitre: 'Assistant d\'organisation de cours sans IA',
        description: 'IvoPlan est un assistant permettant de s\'organiser dans les cours.\n\nFonctionnalités principales :\n- Gestion du planning des cours\n- Organisation des devoirs et des révisions\n- Suivi des priorités et des échéances',
        siteUrl: 'https://cheketenetwork.github.io/projet-assaistant-de-cours-sans-IA/',
        captures: [
            // Ajoutez les chemins vers vos captures d'écran ici (ex: 'images/assistant-cours-1.png')
        ]
    },
    '2': {
        titre: 'Projet 2 : Zynx Vêtements',
        sousTitre: 'Plateforme E-Commerce & Vitrine de Mode',
        description: 'Site e-commerce développé pour la présentation et le lancement d\'une nouvelle collection de vêtements.\n\nFonctionnalités principales :\n- Présentation du catalogue produit\n- Design soigné et moderne\n- Découverte de la collection créateur',
        siteUrl: 'https://cheketenetwork.github.io/zynx-vetements/',
        captures: [
            // Ajoutez les chemins vers vos captures d'écran ici (ex: 'images/zynx-1.png')
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération de l'ID dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '1';

    const projet = projetsData[id] || projetsData['1'];

    // 2. Éléments du DOM
    const projetTitreEl = document.getElementById('projet-titre');
    const projetDescCourteEl = document.getElementById('projet-description-courte');
    const projetTexteDisplay = document.getElementById('projet-texte-display');
    const siteUrlText = document.getElementById('site-url-text');
    const projetSiteLink = document.getElementById('projet-site-link');
    const themeToggle = document.getElementById('theme-toggle');
    const galleryEl = document.getElementById('screenshots-gallery');

    // 3. Remplissage des données
    if (projetTitreEl) projetTitreEl.textContent = projet.titre;
    if (projetDescCourteEl) projetDescCourteEl.textContent = projet.sousTitre;
    if (siteUrlText) siteUrlText.textContent = projet.siteUrl;
    if (projetSiteLink) {
        projetSiteLink.href = projet.siteUrl;
        // Si pas d'URL configurée, cacher la section de lien
        if (!projet.siteUrl || projet.siteUrl === 'https://...') {
            const linkSection = document.querySelector('.website-link-section');
            if (linkSection) linkSection.style.display = 'none';
        }
    }

    // Affichage de la description (conversion des retours à la ligne en balises <br>)
    if (projetTexteDisplay) {
        projetTexteDisplay.innerHTML = projet.description.replace(/\n/g, '<br>');
    }

    // 4. Mode Sombre
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

    // 5. Affichage des Captures d'Écran
    function renderGallery(imagesArray) {
        if (!galleryEl) return;
        galleryEl.innerHTML = '';
        
        if (!imagesArray || imagesArray.length === 0) {
            galleryEl.innerHTML = `
                <div class="empty-gallery">
                    <p>Aucune capture d'écran disponible pour le moment.</p>
                </div>
            `;
            return;
        }

        imagesArray.forEach((imgData, index) => {
            const card = document.createElement('div');
            card.className = 'screenshot-card';
            card.innerHTML = `<img src="${imgData}" alt="Capture d'écran ${index + 1}">`;

            // Agrandir au clic
            card.addEventListener('click', () => {
                openLightbox(imgData);
            });

            galleryEl.appendChild(card);
        });
    }

    // Modale Lightbox (Agrandissement d'image)
    function openLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="Capture d'écran agrandie">
            </div>
        `;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.remove();
        });
    }

    // Charger les captures d'écran configurées pour ce projet
    renderGallery(projet.captures);
});
