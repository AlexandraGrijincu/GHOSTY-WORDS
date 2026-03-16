// Forțăm nivelul la 5 din start pentru a debloca toate nivelurile
let nivelDeDeblocat = 5;

function updateMap() {
  const nodes = document.querySelectorAll('.level-node');

  nodes.forEach(node => {
    const level = parseInt(node.getAttribute('data-level'));
    const oldContainer = node.querySelector('.level-menu-container');
    if (oldContainer) oldContainer.remove();

    // Verificăm dacă nivelul este deblocat (toate vor fi, deoarece am setat la 5)
    if (level <= nivelDeDeblocat) {
      
      // Setăm clasele pentru aspectul butoanelor
      if (level < nivelDeDeblocat) {
        node.classList.add('completed');
        node.classList.remove('current', 'locked');
      } else {
        node.classList.add('current');
        node.classList.remove('completed', 'locked');
      }

      // Creăm containerul pentru meniul cu WRITE și SPEAK
      const container = document.createElement('div');
      container.className = 'level-menu-container';

      const btnScris = document.createElement('div');
      btnScris.className = 'sub-node scris';
      btnScris.innerText = 'WRITE';
      btnScris.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `../html/nivel${level}.html?id=${level}`;
      };

      const btnAudio = document.createElement('div');
      btnAudio.className = 'sub-node audio';
      btnAudio.innerText = 'SPEAK';
      btnAudio.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `../html/niv${level}_vocal.html?id=${level}`;
      };

      const toggleMenu = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.level-menu-container').forEach(c => {
          if (c !== container) c.classList.remove('active');
        });
        container.classList.toggle('active');
      };

      node.onclick = toggleMenu;

      // Adăugăm doar butoanele WRITE și SPEAK (fără START)
      container.appendChild(btnScris);
      container.appendChild(btnAudio);
      node.appendChild(container);

    } else {
      // Nivelul rămâne blocat (Nu se va mai ajunge aici, dar e bine de lăsat ca măsură de siguranță)
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
    // Ștergem datele de sesiune salvate local
    localStorage.clear();
    sessionStorage.clear();

    // Luăm link-ul din atributul href al div-ului și trimitem utilizatorul la pagina de login
    const paginaLogin = butonDeconectare.getAttribute('href');
    window.location.href = paginaLogin;
  });
}