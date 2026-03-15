// --- CONFIGURARE DATE NIVEL ---
const exercitii = [
    { text: "The student .... a long essay.", raspuns: "wrote", infinitiv: "to write" },
    { text: "She .... to the market yesterday.", raspuns: "went", infinitiv: "to go" },
    { text: "They .... all the water.", raspuns: "drank", infinitiv: "to drink" },
    { text: "I .... a big pizza last night.", raspuns: "ate", infinitiv: "to eat" },
    { text: "He .... a beautiful song.", raspuns: "sang", infinitiv: "to sing" },
    { text: "We .... a loud noise outside.", raspuns: "heard", infinitiv: "to hear" },
    { text: "The boy .... over the fence.", raspuns: "jumped", infinitiv: "to jump" },
    { text: "She .... her keys in the car.", raspuns: "left", infinitiv: "to leave" },
    { text: "I .... a famous actor today.", raspuns: "saw", infinitiv: "to see" },
    { text: "They .... a new house last year.", raspuns: "bought", infinitiv: "to buy" },
    { text: "He .... the answer to the question.", raspuns: "knew", infinitiv: "to know" },
    { text: "The teacher .... us a story.", raspuns: "told", infinitiv: "to tell" },
    { text: "We .... a lot of photos on holiday.", raspuns: "took", infinitiv: "to take" },
    { text: "She .... her homework very fast.", raspuns: "did", infinitiv: "to do" }
];

// --- VARIABILE STARE ---
let indexCurent = 0;
let vieti = 3;
let scor = 0;
let esteInAnimatie = false;

// --- ELEMENTE DOM ---
const personajElem = document.getElementById("personaj");
const ghostCont = document.getElementById("container-fantoma");
const bubbleCuvant = document.getElementById("bubble-cuvant");
const chenarPropozitie = document.querySelector("#chenar-central p");
const inputUtilizator = document.getElementById("raspuns-utilizator");
const scorAfisat = document.getElementById("scor");
const urmatorulNivel=4;

const imaginiAnimatie = ["../images/idel.png", "../images/001.png", "../images/002.png", "../images/003.png"];

// --- LOGICA DE START ---
function initNivel() {
    incarcaExercitiu();
    inputUtilizator.focus();
    
    inputUtilizator.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !esteInAnimatie) {
            valideazaRaspuns();
        }
    });
}

function incarcaExercitiu() {
    const ex = exercitii[indexCurent];
    chenarPropozitie.innerText = ex.text;
    bubbleCuvant.innerText = ex.infinitiv;
    inputUtilizator.value = "";
    
    ghostCont.classList.remove("fantoma-dispare");
    ghostCont.style.opacity = "1";
}

async function valideazaRaspuns() {
    if (esteInAnimatie) return;
    
    const ex = exercitii[indexCurent];
    const raspunsCorect = ex.raspuns;
    const raspunsDat = inputUtilizator.value.toLowerCase().trim();

    if (raspunsDat === raspunsCorect) {
        
        scor += 10;
        scorAfisat.innerText = "Scor: " + scor;
        
        await pornesteAnimatieVrajitoare(true);
        ghostCont.classList.add("fantoma-dispare");
        await asteaptaMs(500);
        
        if (scor >= 100){
            terminaJocul(true);
            return;
        }

        avanseazaJocul();

    } else {
        
        esteInAnimatie = true; 

        // Animație baghetă roșie
        await pornesteAnimatieVrajitoare(false);
        
        // Arătăm răspunsul corect în chenar (fără să trecem încă la următoarea)
        const textCuRaspuns = ex.text.replace("....", `[ ${raspunsCorect.toUpperCase()} ]`);
        chenarPropozitie.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">${textCuRaspuns}</span>`;
        
        // Scădem viața (fără să oprim jocul aici)
        pierdeViata();

        // PAUZĂ: Userul vede răspunsul roșu timp de 2.5 secunde
        await asteaptaMs(2500);
        
        esteInAnimatie = false;

        // Dacă mai are vieți continuă, dacă nu, game over
        if (vieti > 0) {
            avanseazaJocul();
        } else {
            terminaJocul(false);
        }
    }
}

function avanseazaJocul() {
    indexCurent++;
    if (indexCurent < exercitii.length) {
        incarcaExercitiu();
    } else {
        terminaJocul(true);
    }
}

// --- ANIMATIA VRAJITOAREI ---
async function pornesteAnimatieVrajitoare(esteCorect) {
    esteInAnimatie = true;
    for (let i = 1; i < imaginiAnimatie.length; i++) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(80);
    }

    const clasaGlow = esteCorect ? "stare-speciala" : "stare-speciala-rosie";
    personajElem.classList.add(clasaGlow);
    await asteaptaMs(600); 

    personajElem.classList.remove(clasaGlow);
    for (let i = imaginiAnimatie.length - 2; i >= 0; i--) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(80);
    }
    esteInAnimatie = false;
}

// --- FUNCTIA PIERDE VIATA MODIFICATA ---
function pierdeViata() {
    const inima = document.getElementById(`inima-${vieti}`);
    if (inima) {
        inima.classList.remove('plina');
        inima.classList.add('lovita');
    }
    vieti--;
    
}
async function salveazaScorul(scorFinal) {
    const userId = localStorage.getItem('userId'); // Preluăm ID-ul utilizatorului
    if (!userId) return;

    try {
        await fetch('/api/battle/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: userId, 
                score: scorFinal, 
                level: 3 // Nivelul curent care a fost terminat
            })
        });
        
        localStorage.setItem('userProgress', 4); 
    } catch (e) { 
        console.error("Eroare la salvarea progresului:", e); 
    }
}
async function actualizeazaProgresServer(nouNivel) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        await fetch('http://localhost:8080/api/user/update-progress', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: parseInt(userId), 
                level: nouNivel 
            })
        });
    } catch (error) {
        console.error("Eroare la salvarea progresului:", error);
    }
}
async function terminaJocul(aCastigat) {
    const ecranFinal = document.getElementById('ecran-final');
    const titluFinal = document.getElementById('titlu-final');
    const scorFinal = document.getElementById('scor-final');
    
    ecranFinal.classList.remove('ascuns');
    scorFinal.innerText = "Scor final: " + scor;
    
    if (aCastigat) {
        titluFinal.innerText = "Felicitări! Ai învățat Past Simple!";
        titluFinal.style.color = "#4caf50";
        document.getElementById('btn-next').classList.remove('ascuns');
        await salveazaScorul(scor);
        await actualizeazaProgresServer(urmatorulNivel);
    } else {
        titluFinal.innerText = "Mai încearcă!";
        titluFinal.style.color = "#ff4d4d";
    }
}
const butonIesire = document.getElementById('iesire');

// Adăugăm evenimentul de click
butonIesire.addEventListener('click', () => {
   
    const destinatie = butonIesire.getAttribute('href'); 
    window.location.href = destinatie;
});


butonIesire.style.cursor = "pointer";

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = initNivel;