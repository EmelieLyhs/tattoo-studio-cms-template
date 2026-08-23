async function loadComponents() {
    const components = [
        {id: 'header-placeholder', file: 'components/header.html'},
        {id: 'main-placeholder', file: 'components/main-content.html'},
        {id: 'footer-placeholder', file: 'components/footer/footer.html'},
    ];

    for (const comp of components) {
        const element = document.getElementById(comp.id);
        if (element) {
            try {
                const response = await fetch(comp.file);
                if (response.ok) {
                    element.innerHTML = await response.text();
                } else {
                    console.error(`Fehler beim Laden von ${comp.file}`);
                }
            } catch (error) {
                console.error(`Netzwerkfehler bei ${comp.file}`, error);
            }
        }
    }
}

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        // Event-Listener anhängen
        button.addEventListener('click', () => {
            // Active-Klasse bei allen Buttons entfernen und beim geklickten hinzufügen
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // Wenn 'all' gewählt ist ODER das Element die gewählte Kategorie-Klasse enthält
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

async function loadGallery() {
    try {
        const response = await fetch('./content/tattoos.json?' + Date.now());
        if (!response.ok) return;
        const data = await response.json();

        const items = data.items || [];
        const container = document.getElementById('gallery-container');
        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');

            // Verarbeitet Mehrfachauswahl (Array) ODER Einzelkategorie (String als Fallback)
            let categoryClasses = '';
            if (Array.isArray(item.categories)) {
                categoryClasses = item.categories.join(' ');
            } else if (item.category) {
                categoryClasses = item.category;
            }

            // Fügt alle gewählten Kategorien als CSS-Klassen hinzu
            card.className = `gallery-item ${categoryClasses}`;
            card.innerHTML = `<img src="${item.image}" alt="${item.title || 'Tattoo'}">`;

            container.appendChild(card);
        });

        initGalleryFilters(); // Filter-Events aktivieren
    } catch (err) {
        console.error("Fehler beim Laden der Galerie:", err);
    }
}

function initLightbox() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !modalImg) return;

    // Klick-Event per Event Delegation auf das Galerie-Raster
    const galleryContainer = document.getElementById('gallery-container'); // Name deines Galerie-Containers anpassen

    if (galleryContainer) {
        galleryContainer.addEventListener('click', (e) => {
            const clickedImg = e.target.closest('.gallery-item img');
            if (clickedImg) {
                modal.classList.add('show');
                modalImg.src = clickedImg.src;
                captionText.textContent = clickedImg.alt || '';
            }
        });
    }

    // Funktion zum Schließen
    const closeModal = () => {
        modal.classList.remove('show');
    };

    // Schließen bei Klick auf das 'X' oder den dunklen Hintergrund
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Schließen mit der ESC-Taste
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Profil & Einstellungen aus CMS laden
// Profil & Einstellungen aus CMS laden
async function loadSettings() {
    try {
        const response = await fetch('./content/settings.json?' + Date.now());
        if (!response.ok) return;

        const rawData = await response.json();
        const data = rawData.profile || rawData;

        // 1. Text eintragen (Nutzt 'about-text' mit Bindestrich!)
        const aboutEl = document.getElementById('about-text');
        if (aboutEl && data['about-text']) {
            aboutEl.textContent = data['about-text'];
        }

        // 2. Bild eintragen (Nutzt 'artist-image' mit Bindestrich!)
        const imgEl = document.getElementById('artist-image');
        if (imgEl && data['artist-image']) {
            imgEl.src = data['artist-image'];
            imgEl.style.display = 'block';
        }
    } catch (error) {
        console.error("Fehler beim Laden der Einstellungen:", error);
    }
}


// HAUPTABLAUF: Garantiert die richtige Reihenfolge
document.addEventListener('DOMContentLoaded', async () => {
    console.log("1. Lade HTML-Komponenten...");

    // WARTEN, bis Header, Main-Content und Footer vollständig verbaut sind
    await loadComponents();

    console.log("2. HTML fertig aufgebaut. Lade jetzt CMS-Daten...");

    // JETZT sind #about-text und #artist-img garantiert im DOM
    await loadSettings();
    await loadGallery();

    // Lightbox-Events initialisieren
    initLightbox();
});