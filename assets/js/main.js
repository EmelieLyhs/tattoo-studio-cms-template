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

function initGalleryFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            items.forEach(item => {
                // Liest data-categories ODER als Fallback data-category aus (verhindert null)
                const rawCategories = item.getAttribute('data-categories') || item.getAttribute('data-category') || '';

                // Wandelt den String in ein sauber getrimmtes Array um
                const itemCategories = rawCategories.split(',').map(cat => cat.trim());

                // Prüft, ob 'all' gewählt ist ODER ob die Kategorie enthalten ist
                if (filter === 'all' || itemCategories.includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Beispieldaten aus dem CMS für das Profil laden
async function loadProfileData() {
    try {
        const response = await fetch('../assets/content/js/settings.json');
        const data = await response.json();

        // Texte und Links im HTML ersetzen
        document.getElementById('about-text').innerText = data.about_text;
        document.getElementById('instagram-link').href = data.instagram_url;
    } catch (e) {
        console.log("Profil-Daten noch nicht angelegt.");
    }
}

async function loadGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    try {
        const response = await fetch('../assets/content/tattoos.json');
        const tattoos = await response.json();

        // Generiert für jedes Bild im JSON den passenden HTML-Code
        container.innerHTML = tattoos.map(tattoo => {
        const categoriesString = Array.isArray(tattoo.categories)
            ? tattoo.categories.join(',')
            : tattoo.category || '';

        return `
            <div class="gallery-item" data-category="${tattoo.category}">
                <img src="${tattoo.src}" alt="${tattoo.alt}" loading="lazy">
            </div>
        `}).join('');

        // Aktiviert danach die Filter-Logik
        initGalleryFilter();

    } catch (error) {
        console.error('Fehler beim Laden der Galerie-Bilder:', error);
    }
}


// Nach dem Laden der Main-Komponente aufrufen:
document.addEventListener('DOMContentLoaded', () => {
    // Falls deine Komponenten async geladen werden, rufe loadGallery() auf, sobald main-placeholder befüllt ist
    setTimeout(loadGallery, 200);
});



document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initGalleryFilter();
    loadProfileData();
    loadGallery();
});