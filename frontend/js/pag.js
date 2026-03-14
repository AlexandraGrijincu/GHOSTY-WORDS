// Preluăm progresul utilizatorului
let nivelDeDeblocat = parseInt(localStorage.getItem('userProgress')) || 1;

function updateMap() {
    const nodes = document.querySelectorAll('.level-node');

    nodes.forEach(node => {
        const level = parseInt(node.getAttribute('data-level'));
        
        // 1. Curățăm orice meniu existent pentru a evita duplicarea butoanelor
        const oldContainer = node.querySelector('.level-menu-container');
        if (oldContainer) oldContainer.remove();

        // 2. Gestionăm starea nodurilor (Completed / Current / Locked)
        if (level < nivelDeDeblocat) {
            node.classList.add('completed');
            node.classList.remove('current', 'locked');
            node.onclick = null; // Opțional: click-ul pe nivele terminate poate fi dezactivat sau să te trimită undeva
        }
        else if (level === nivelDeDeblocat) {
            node.classList.add('current');
            node.classList.remove('completed', 'locked');

            // Creăm containerul principal pentru meniul interactiv
            const container = document.createElement('div');
            container.className = 'level-menu-container';

            // Eticheta START (deasupra globului)
            const startLabel = document.createElement('div');
            startLabel.className = 'start-bubble';
            startLabel.innerText = 'START';

            // Butonul WRITE (te duce la nivel.html)
            const btnScris = document.createElement('div');
            btnScris.className = 'sub-node scris';
            btnScris.innerText = 'WRITE';
            btnScris.onclick = (e) => { 
                e.stopPropagation(); 
                window.location.href = `../html/nivel1.html?id=${level}`; 
            };

            // Butonul SPEAK (te duce la nivel_audio.html)
            const btnAudio = document.createElement('div');
            btnAudio.className = 'sub-node audio';
            btnAudio.innerText = 'SPEAK';
            btnAudio.onclick = (e) => { 
                e.stopPropagation(); 
                window.location.href = `nivel_audio.html?id=${level}`; 
            };

            // Funcția de deschidere/închidere meniu (Toggle)
            const toggleMenu = (e) => {
                e.stopPropagation();
                // Închidem alte meniuri deschise dacă ar exista (pentru siguranță)
                document.querySelectorAll('.level-menu-container').forEach(c => {
                    if (c !== container) c.classList.remove('active');
                });
                container.classList.toggle('active');
            };

            // Atribuim evenimentul de click atât etichetei START cât și globului
            startLabel.onclick = toggleMenu;
            node.onclick = toggleMenu;

            // Asamblăm elementele în pagină
            container.appendChild(startLabel);
            container.appendChild(btnScris);
            container.appendChild(btnAudio);
            node.appendChild(container);
        }
        else {
            // Nivelul este blocat
            node.classList.add('locked');
            node.classList.remove('completed', 'current');
            node.onclick = () => {
                console.log("Nivel blocat! Trebuie să termini nivelele anterioare.");
                // Aici poți adăuga un efect de tremur (shake) în CSS clasei .locked
            };
        }
    });
}

// Închide meniul dacă utilizatorul dă click oriunde altundeva pe hartă
document.addEventListener('click', () => {
    document.querySelectorAll('.level-menu-container').forEach(container => {
        container.classList.remove('active');
    });
});

// Inițializăm harta la încărcarea paginii
document.addEventListener('DOMContentLoaded', updateMap);