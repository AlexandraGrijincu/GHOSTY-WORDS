const verbe = [
    { ro: "a merge", en: "to go" }, { ro: "a manca", en: "to eat" },
    { ro: "a bea", en: "to drink" }, { ro: "a dormi", en: "to sleep" },
    { ro: "a vedea", en: "to see" }, { ro: "a vorbi", en: "to speak" },
    { ro: "a scrie", en: "to write" }, { ro: "a citi", en: "to read" },
    { ro: "a alerga", en: "to run" }, { ro: "a face", en: "to do" },
    { ro: "a veni", en: "to come" }, { ro: "a canta", en: "to sing" },
    { ro: "a lucra", en: "to work" }, { ro: "a sari", en: "to jump" },
    { ro: "a auzi", en: "to hear" }
];

// --- VARIABILE STARE ---
let vieti = 3;
let scor = 0;
let vitezaBaza = 1.0;
let vitezaCurenta = vitezaBaza;
let pozitieX = -200; 
let pozitieY = -200; 
let verbCurent = {};
let gameActive = true;
let esteInAnimatiePersonaj = false; 
let pauzaFantoma = false; // Variabilă pentru a îngheța fantoma în timpul animației

// --- ELEMENTE DOM ---
const ghostCont = document.getElementById('container-fantoma');
const input = document.getElementById('raspuns-utilizator');
const bubble = document.getElementById('bubble-cuvant');
const scorAfisat = document.getElementById('scor');
const ecranFinal = document.getElementById('ecran-final');
const titluFinal = document.getElementById('titlu-final');
const scorTextFinal = document.getElementById('scor-final');
const btnNext = document.getElementById('btn-next');
const personajElem = document.getElementById("personaj");

const imaginiAnimatie = ["../images/idel.png", "../images/001.png", "../images/002.png", "../images/003.png"];

// --- LOGICA JOCULUI ---

function spawnFantoma() {
    if (!gameActive) return;
    verbCurent = verbe[Math.floor(Math.random() * verbe.length)];
    bubble.innerText = verbCurent.ro;
    pozitieX = -200; 
    pozitieY = -100;   
    input.value = "";
    input.focus();
}

function joc() {
    if (!gameActive) return;

    // Dacă fantoma este în pauză (pentru animație), doar cerem următorul frame fără să mișcăm poziția
    if (pauzaFantoma) {
        requestAnimationFrame(joc);
        return;
    }

    pozitieX += vitezaCurenta;
    pozitieY += vitezaCurenta * 0.5;
    ghostCont.style.right = pozitieX + "px";
    ghostCont.style.top = pozitieY + "px";

    if (pozitieX > window.innerWidth * 0.45) {
        pierdeViata();
    } else {
        requestAnimationFrame(joc);
    }
}

async function pierdeViata() {
    const inima = document.getElementById(`inima-${vieti}`);
    if (inima) {
        inima.classList.remove('plina');
        inima.classList.add('lovita');
    }
    vieti--;
    if (vieti <= 0) {
        terminaJocul(false);
    } else {
        spawnFantoma();
        requestAnimationFrame(joc); 
    }
}

async function terminaJocul(aCastigat) {
    gameActive = false;
    ecranFinal.classList.remove('ascuns');
    scorTextFinal.innerText = "Scor final: " + scor;
    if (aCastigat) {
        titluFinal.innerText = "Felicitări! Ai Câștigat!";
        titluFinal.style.color = "#4caf50";
        btnNext.classList.remove('ascuns');
    } else {
        titluFinal.innerText = "Ai pierdut!";
        titluFinal.style.color = "#ff4d4d";
        btnNext.classList.add('ascuns');
    }
    await salveazaScorul(scor);
}

// --- ANIMATIE PERSONAJ (MODIFICATĂ) ---

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function seteazaIdlePersonaj() {
    if (personajElem) personajElem.style.backgroundImage = `url('${imaginiAnimatie[0]}')`;
}

async function pornesteAnimatiePersonaj() {
    if (esteInAnimatiePersonaj) return;
    esteInAnimatiePersonaj = true;
    pauzaFantoma = true; // Înghețăm fantoma pe ecran la succes

    // Secvența de cadre înainte
    for (let i = 1; i < imaginiAnimatie.length; i++) {
        await asteaptaMs(100);
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
    }

    personajElem.classList.add("stare-speciala");
    await asteaptaMs(500); // Momentul impactului/atacului
    personajElem.classList.remove("stare-speciala");

    // Secvența de cadre înapoi
    for (let i = imaginiAnimatie.length - 2; i >= 0; i--) {
        await asteaptaMs(100);
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
    }

    seteazaIdlePersonaj();
    esteInAnimatiePersonaj = false;
    pauzaFantoma = false; // Dezghețăm logica de mișcare
    
    // Abia acum spawnăm fantoma nouă (fantoma veche dispare/se resetează)
    if (gameActive) spawnFantoma(); 
}

// --- INPUT & SCORE ---

input.addEventListener('input', async () => {
    if (!gameActive || pauzaFantoma) return;

    if (input.value.toLowerCase().trim() === verbCurent.en) {
        scor += 10;
        scorAfisat.innerText = "Scor: " + scor;

        // Așteptăm să se termine animația ÎNAINTE de a reseta fantoma
        await pornesteAnimatiePersonaj(); 

        if (scor >= 100) {
            terminaJocul(true);
        } else {
            vitezaCurenta += 0.1;
            // spawnFantoma() se apelează automat la finalul funcției pornesteAnimatiePersonaj()
        }
    }
});

async function salveazaScorul(scorFinal) {
    try {
        await fetch('/api/battle/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, score: scorFinal, level: 1 })
        });
    } catch (e) { console.error("Eroare salvare scor"); }
}

// --- ANIMATIE VRĂJITOARE ---
const imaginiVrajitoare = ["../imagini/vrajitoare/v1.png", "../imagini/vrajitoare/v2.png", "../imagini/vrajitoare/v3.png"];
let frameVrajitoare = 0;

setInterval(() => {
    frameVrajitoare = (frameVrajitoare + 1) % imaginiVrajitoare.length;
    const vImg = document.getElementById('vrajitoare');
    if (vImg) vImg.src = imaginiVrajitoare[frameVrajitoare];
}, 150); // Am pus 150ms pentru o mișcare mai naturală

// --- START ---
seteazaIdlePersonaj();
spawnFantoma();
requestAnimationFrame(joc);