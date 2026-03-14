// Preluăm progresul utilizatorului
let nivelDeDeblocat = parseInt(localStorage.getItem('userProgress')) || 1;

function updateMap() {
  const nodes = document.querySelectorAll('.level-node');

  nodes.forEach(node => {
    const level = parseInt(node.getAttribute('data-level'));
    const oldContainer = node.querySelector('.level-menu-container');
    if (oldContainer) oldContainer.remove();

    // --- LOGICA MODIFICATĂ ---
    if (level <= nivelDeDeblocat) { 
      // Dacă nivelul este terminat SAU este cel curent
      if (level < nivelDeDeblocat) {
        node.classList.add('completed');
        node.classList.remove('current', 'locked');
      } else {
        node.classList.add('current');
        node.classList.remove('completed', 'locked');
      }

      // Adăugăm meniul (WRITE / SPEAK) pentru ambele stări
      const container = document.createElement('div');
      container.className = 'level-menu-container';

      const startLabel = document.createElement('div');
      startLabel.className = 'start-bubble';
      if(level == nivelDeDeblocat )
        nivelDeDeblocat = "START";

      const btnScris = document.createElement('div');
      btnScris.className = 'sub-node scris';
      btnScris.innerText = 'WRITE';
      btnScris.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `../html/nivel1.html?id=${level}`;
      };

<<<<<<< HEAD
            // Butonul SPEAK (te duce la nivel_audio.html)
            const btnAudio = document.createElement('div');
            btnAudio.className = 'sub-node audio';
            btnAudio.innerText = 'SPEAK';
            btnAudio.onclick = (e) => { 
                e.stopPropagation(); 
                window.location.href = `../html/niv1_vocal.html?id=${level}`; 
            };
=======
      const btnAudio = document.createElement('div');
      btnAudio.className = 'sub-node audio';
      btnAudio.innerText = 'SPEAK';
      btnAudio.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `nivel_audio.html?id=${level}`;
      };
>>>>>>> ce9309a333bfc555b3eb25584718d3b6d8ccfc32

      const toggleMenu = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.level-menu-container').forEach(c => {
          if (c !== container) c.classList.remove('active');
        });
        container.classList.toggle('active');
      };

      startLabel.onclick = toggleMenu;
      node.onclick = toggleMenu;

      container.appendChild(startLabel);
      container.appendChild(btnScris);
      container.appendChild(btnAudio);
      node.appendChild(container);

    } else {
      // Nivelul rămâne blocat
      node.classList.add('locked');
      node.classList.remove('completed', 'current');
      node.onclick = () => { console.log("Nivel blocat!"); };
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

const butonDeconectare = document.getElementById('deconectare');

if (butonDeconectare) {
  butonDeconectare.addEventListener('click', () => {
    // 1. Ștergem datele de sesiune (localStorage sau sessionStorage)
    localStorage.clear();
    sessionStorage.clear();

    // 2. Luăm link-ul din atributul href al div-ului
    const paginaLogin = butonDeconectare.getAttribute('href');

    // 3. Trimitem utilizatorul la pagina de login
    window.location.href = paginaLogin;
  });
}

// Înlocuiește partea de sus a fișierului pag.js
async function incarcaHarta() {
    const userId = localStorage.getItem('userId');
    let nivelDeDeblocat = 1;

    if (userId) {
        try {
            // Cerem nivelul de la baza de date
            const response = await fetch(`/api/user/progress/${userId}`);
            const data = await response.json();
            nivelDeDeblocat = data.currentLevel;
            // Sincronizăm localstorage
            localStorage.setItem('userProgress', nivelDeDeblocat);
        } catch (e) {
            console.log("Server inaccesibil, folosim date locale.");
            nivelDeDeblocat = parseInt(localStorage.getItem('userProgress')) || 1;
        }
    }

    updateMap(nivelDeDeblocat);
}