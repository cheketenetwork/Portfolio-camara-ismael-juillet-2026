// Données de démonstration des projets
const projetsData = {
    '1': {
        titre: 'Projet 1 : Calculatrice Web',
        sousTitre: 'Application web interactive d\'opérations arithmétiques',
        description: 'Création d\'une calculatrice web simple comme premier projet.\n\nFonctionnalités principales :\n- Opérations de base (addition, soustraction, multiplication, division)\n- Interface épurée et réactive\n- Prise en charge des entrées tactiles et clavier',
        siteUrl: 'https://cusmoiphone-code.github.io/calaculatrice-tchaiiiii/'
    },
    '2': {
        titre: 'Projet 2 : Zynx Vêtements',
        sousTitre: 'Plateforme E-Commerce & Vitrine de Mode',
        description: 'Site e-commerce développé pour la présentation et le lancement d\'une nouvelle collection de vêtements.\n\nFonctionnalités principales :\n- Présentation du catalogue produit\n- Design soigné et moderne\n- Découverte de la collection créateur',
        siteUrl: 'https://cheketenetwork.github.io/zynx-vetements/'
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération de l'ID dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '1';

    const projet = projetsData[id] || projetsData['1'];

    // 2. Éléments du DOM
    const projetTitreEl = document.getElementById('projet-titre');
    const projetDescCourteEl = document.getElementById('projet-description-courte');
    const projetTexteEditor = document.getElementById('projet-texte-editor');
    const saveStatus = document.getElementById('save-status');
    const siteUrlText = document.getElementById('site-url-text');
    const projetSiteLink = document.getElementById('projet-site-link');
    const themeToggle = document.getElementById('theme-toggle');

    // Éléments pour les captures d'écran
    const screenshotInput = document.getElementById('screenshot-input');
    const dropZone = document.getElementById('drop-zone');
    const galleryEl = document.getElementById('screenshots-gallery');

    // 3. Remplissage des données de base
    projetTitreEl.textContent = projet.titre;
    projetDescCourteEl.textContent = projet.sousTitre;
    siteUrlText.textContent = projet.siteUrl;
    projetSiteLink.href = projet.siteUrl;

    // 4. Mode Sombre (Restauration et Gestion)
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

    // 5. Gestion de l'Éditeur de Texte (LocalStorage)
    const storageKeyText = `projet_${id}_custom_text`;
    const savedText = localStorage.getItem(storageKeyText);
    projetTexteEditor.value = savedText !== null ? savedText : projet.description;

    let timeoutSave = null;
    projetTexteEditor.addEventListener('input', () => {
        saveStatus.textContent = 'Enregistrement...';
        saveStatus.classList.add('saving');

        clearTimeout(timeoutSave);
        timeoutSave = setTimeout(() => {
            localStorage.setItem(storageKeyText, projetTexteEditor.value);
            saveStatus.textContent = 'Enregistré ✓';
            saveStatus.classList.remove('saving');
        }, 500);
    });

    // 6. Gestion des Captures d'Écran
    const storageKeyImages = `projet_${id}_images`;
    
    function loadSavedImages() {
        const savedImages = JSON.parse(localStorage.getItem(storageKeyImages) || '[]');
        renderGallery(savedImages);
    }

    function saveImages(imagesArray) {
        try {
            localStorage.setItem(storageKeyImages, JSON.stringify(imagesArray));
        } catch (e) {
            alert('La limite de stockage locale est atteinte pour les images. Essayez avec une image de taille plus réduite.');
        }
    }

    function renderGallery(imagesArray) {
        galleryEl.innerHTML = '';
        if (imagesArray.length === 0) {
            galleryEl.innerHTML = `
                <div class="empty-gallery">
                    <p>Aucune capture d'écran ajoutée pour le moment.</p>
                </div>
            `;
            return;
        }

        imagesArray.forEach((imgData, index) => {
            const card = document.createElement('div');
            card.className = 'screenshot-card';

            card.innerHTML = `
                <img src="${imgData}" alt="Capture d'écran ${index + 1}">
                <button class="delete-btn" title="Supprimer la capture" data-index="${index}">&times;</button>
            `;

            // Bouton supprimer
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                imagesArray.splice(idx, 1);
                saveImages(imagesArray);
                renderGallery(imagesArray);
            });

            // Agrandir au clic
            card.addEventListener('click', () => {
                openLightbox(imgData);
            });

            galleryEl.appendChild(card);
        });
    }

    function handleFiles(files) {
        const savedImages = JSON.parse(localStorage.getItem(storageKeyImages) || '[]');
        let loadedCount = 0;
        const totalFiles = Array.from(files).filter(f => f.type.startsWith('image/')).length;

        if (totalFiles === 0) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                savedImages.push(e.target.result);
                loadedCount++;
                if (loadedCount === totalFiles) {
                    saveImages(savedImages);
                    renderGallery(savedImages);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Événement d'importation par fichier
    screenshotInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        screenshotInput.value = '';
    });

    // Événements Glisser-Déposer (Drag & Drop)
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // Modale Lightbox pour agrandir l'image
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

    // Chargement initial des images
    loadSavedImages();
});
