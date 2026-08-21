async function loadComponents() {
    const components = [
        {id: 'header-placeholder', file: 'components/header.html'},
        {id: 'main-placeholder', file: 'components/main-content'}
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
            // Aktiven Button hervorheben
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Elemente ein-/ausblenden
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
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
        const response = await fetch('content/settings.json');
        const data = await response.json();

        // Texte und Links im HTML ersetzen
        document.getElementById('about-text').innerText = data.about_text;
        document.getElementById('instagram-link').href = data.instagram_url;
    } catch (e) {
        console.log("Profil-Daten noch nicht angelegt.");
    }
}



document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initGalleryFilter();
    loadProfileData();
});