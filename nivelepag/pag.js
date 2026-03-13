let nivelDisponibil = parseInt(localStorage.getItem('nivelDisponibil')) || 1;

const nivele = document.querySelectorAll('.nivel');
const linii = document.querySelectorAll('.linie');

function updateMap() {
  nivele.forEach((btn, i) => {
    const nivel = parseInt(btn.dataset.nivel);
    if(nivel < nivelDisponibil){
      btn.classList.remove('available');
      btn.classList.add('completed');
      btn.disabled = true;
      if(linii[i-1]) linii[i-1].classList.add('active');
    } else if(nivel === nivelDisponibil){
      btn.classList.add('available');
      btn.disabled = false;
    } else {
      btn.classList.remove('available', 'completed');
      btn.disabled = true;
    }
  });
}

nivele.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const nivel = parseInt(btn.dataset.nivel);
    if(nivel === nivelDisponibil){
      alert(`Ai selectat Nivelul ${nivel}`);
      nivelDisponibil++;
      localStorage.setItem('nivelDisponibil', nivelDisponibil);
      updateMap();
    }
  });
});

updateMap();