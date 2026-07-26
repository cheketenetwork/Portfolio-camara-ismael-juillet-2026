// Données de démonstration des projets
const projetsData = {
    '1': {
        titre: 'Projet 1 : Calculatrice Web',
        sousTitre: 'Application web interactive d\'opérations arithmétiques',
        description: 'Création d\'une calculatrice web simple comme premier projet.\n\nFonctionnalités principales :\n- Opérations de base (addition, soustraction, multiplication, division)\n- Interface épurée et réactive\n- Prise en charge des entrées tactiles et clavier',
        siteUrl: 'https://cheketenetwork.github.io/calaculatrice-tchaiiiii/'
    },
    '2': {
        titre: 'Projet 2 : Zynx Vêtements',
        sousTitre: 'Plateforme E-Commerce & Vitrine de Mode',
        description: 'Site e-commerce développé pour la présentation et le lancement d\'une nouvelle collection de vêtements.\n\nFonctionnalités principales :\n- Présentation du catalogue produit\n- Design soigné et moderne\n- Découverte de la collection créateur',
        siteUrl: 'https://cheketenetwork.github.io/zynx-vetements/'
    }
};

// Mot de passe propriétaire par défaut pour déverrouiller le mode édition & ajout de captures
const MOT_DE_PASSE_PROPRIETAIRE = 'ismael';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération de l'ID dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '1';

    const projet = projetsData[id] || projetsData['1'];

    // 2. Éléments du DOM
    const projetTitreEl = document.getElementById('projet-titre');
    const projetDescCourteEl = document.getElementById('projet-description-courte');
    const projetTexteEditor = document.getElementById('projet-texte-editor');
    const projetTexteDisplay = document.getElementById('projet-texte-display');
    const saveStatus = document.getElementById('save-status');
    const siteUrlText = document.getElementById('site-url-text');
    const projetSiteLink = document.getElementById('projet-site-link');
    const themeToggle = document.getElementById('theme-toggle');
    const adminToggle = document.getElementById('admin-toggle');

    // Éléments pour les captures d'écran
    const screenshotInput = document.getElementById('screenshot-input');
    const dropZone = document.getElementById('drop-zone');
    const galleryEl = document.getElementById('screenshots-gallery');

    // 3. Remplissage des données de base
    projetTitreEl.textContent = projet.titre;
    projetDescCourteEl.textContent = projet.sousTitre;
    siteUrlText.textContent = projet.siteUrl;
    projetSiteLink.href = projet.siteUrl;

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

    // 5. Gestion du statut Propriétaire (Admin)
    let isAdmin = localStorage.getItem('portfolio_admin_active') === 'true';

    function updateAdminUI() {
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (isAdmin) {
            adminToggle.textContent = '🔓 Espace Propriétaire (Actif)';
            adminToggle.classList.add('active');
            adminElements.forEach(el => el.style.display = 'block');
            if (projetTexteDisplay) projetTexteDisplay.style.display = 'none';
        } else {
            adminToggle.textContent = '🔒 Accès Propriétaire';
            adminToggle.classList.remove('active');
            adminElements.forEach(el => el.style.display = 'none');
            if (projetTexteDisplay) projetTexteDisplay.style.display = 'block';
        }

        // Mettre à jour le texte affiché aux visiteurs
        updateVisitorTextDisplay();
        
        // Re-rendre la galerie pour afficher/masquer les boutons de suppression
        loadSavedImages();
    }

    if (adminToggle) {
        adminToggle.addEventListener('click', () => {
            if (isAdmin) {
                if (confirm('Voulez-vous quitter le mode propriétaire ?')) {
                    isAdmin = false;
                    localStorage.setItem('portfolio_admin_active', 'false');
                    updateAdminUI();
                }
            } else {
                const password = prompt('Veuillez entrer le mot de passe propriétaire pour ajouter des captures d\'écran ou modifier le texte :');
                if (password === MOT_DE_PASSE_PROPRIETAIRE || password === 'admin') {
                    isAdmin = true;
                    localStorage.setItem('portfolio_admin_active', 'true');
                    updateAdminUI();
                    alert('Accès propriétaire activé ! Vous pouvez maintenant ajouter des captures d\'écran et éditer le texte.');
                } else if (password !== null) {
                    alert('Mot de passe incorrect. Seul le propriétaire peut ajouter des captures d\'écran.');
                }
            }
        });
    }

    // 6. Gestion du texte (Lecture seule visiteur / Édition propriétaire)
    const storageKeyText = `projet_${id}_custom_text`;
    const savedText = localStorage.getItem(storageKeyText);
    const initialText = savedText !== null ? savedText : projet.description;
    
    projetTexteEditor.value = initialText;

    function updateVisitorTextDisplay() {
        const currentText = projetTexteEditor.value;
        projetTexteDisplay.innerHTML = currentText.replace(/\n/g, '<br>');
    }

    let timeoutSave = null;
    projetTexteEditor.addEventListener('input', () => {
        saveStatus.textContent = 'Enregistrement...';
        saveStatus.classList.add('saving');

        clearTimeout(timeoutSave);
        timeoutSave = setTimeout(() => {
            localStorage.setItem(storageKeyText, projetTexteEditor.value);
            saveStatus.textContent = 'Enregistré ✓';
            saveStatus.classList.remove('saving');
            updateVisitorTextDisplay();
        }, 500);
    });

    // 7. Gestion des Captures d'Écran
    const storageKeyImages = `projet_${id}_images`;

    function loadSavedImages() {
        const savedImages = JSON.parse(localStorage.getItem(storageKeyImages) || '[]');
        renderGallery(savedImages);
    }

    function saveImages(imagesArray) {
        try {
            localStorage.setItem(storageKeyImages, JSON.stringify(imagesArray));
        } catch (e) {
            alert('La limite de stockage est atteinte pour les images. Essayez des fichiers plus légers.');
        }
    }

    function renderGallery(imagesArray) {
        galleryEl.innerHTML = '';
        if (imagesArray.length === 0) {
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

            const deleteBtnHtml = isAdmin 
                ? `<button class="delete-btn" title="Supprimer la capture" data-index="${index}">&times;</button>` 
                : '';

            card.innerHTML = `
                <img src="${imgData}" alt="Capture d'écran ${index + 1}">
                ${deleteBtnHtml}
            `;

            // Supprimer uniquement pour le propriétaire
            if (isAdmin) {
                const delBtn = card.querySelector('.delete-btn');
                if (delBtn) {
                    delBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const idx = parseInt(e.target.getAttribute('data-index'), 10);
                        imagesArray.splice(idx, 1);
                        saveImages(imagesArray);
                        renderGallery(imagesArray);
                    });
                }
            }

            // Agrandir au clic (accessible à tous)
            card.addEventListener('click', () => {
                openLightbox(imgData);
            });

            galleryEl.appendChild(card);
        });
    }

    function handleFiles(files) {
        if (!isAdmin) {
            alert('Seul le propriétaire du site peut ajouter des captures d\'écran.');
            return;
        }

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

    // Événement d'importation
    screenshotInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        screenshotInput.value = '';
    });

    // Événements Glisser-Déposer
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            if (isAdmin) dropZone.classList.add('drag-over');
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

    // Modale Lightbox
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

    // Appliquer les autorisations au chargement
    updateAdminUI();
});
