let nivelDeDeblocat = parseInt(localStorage.getItem('userProgress')) || 1;

function updateMap() {
    const nodes = document.querySelectorAll('.level-node');

    nodes.forEach(node => {
        const level = parseInt(node.getAttribute('data-level'));
        const existingBubble = node.querySelector('.start-bubble');
        if(existingBubble) existingBubble.remove();

        if (level < nivelDeDeblocat) {
            node.classList.add('completed');
            node.classList.remove('current', 'locked');
        } 
        else if (level === nivelDeDeblocat) {
            node.classList.add('current');
            node.classList.remove('completed', 'locked');
            
            const bubble = document.createElement('div');
            bubble.className = 'start-bubble';
            bubble.innerText = 'START';
            node.appendChild(bubble);
        } 
        else {
            node.classList.add('locked');
            node.classList.remove('completed', 'current');
        }
    });
}

// Funcția care te trimite la pagină când dai click pe bulă
function goToLevel(level) {
    if (level <= nivelDeDeblocat) {
        window.location.href = `nivel${level}.html`;
    } else {
        console.log("Nivel blocat!");
        // Opțional: poți adăuga un efect vizual de "shake" aici
    }
}

updateMap();