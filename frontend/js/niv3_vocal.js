const exercitii = [
    { text: "The student .... a long essay.", raspuns: "wrote", infinitiv: "to write" },
    { text: "She .... her homework very fast.", raspuns: "did", infinitiv: "to do" },
    { text: "They .... all the water.", raspuns: "drank", infinitiv: "to drink" },
    { text: "I .... a big pizza last night.", raspuns: "ate", infinitiv: "to eat" }
];

let indexCurent = 0, vieti = 3, scor = 0, gameActive = true, esteInAnimatie = false;
let recognition, voceActiva = false;

// Elemente DOM
const personajElem = document.getElementById("personaj");
const bubbleCuvant = document.getElementById("bubble-cuvant");
const propozitieElem = document.getElementById("propozitie-text");
const scorAfisat = document.getElementById("scor");
const detectatElem = document.getElementById("cuvant-detectat");
const micIcon = document.getElementById("mic-puls");
const mesajMic = document.getElementById("mesaj-mic");

const imaginiAnimatie = ["../images/idel.png", "../images/001.png", "../images/002.png", "../images/003.png"];

function initializareRecunoastereVocala() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("Recunoașterea vocală nu este suportată de acest browser. Folosește Google Chrome.");
        return;
    }

    recognition = new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        voceActiva = true;
        console.log("Sistemul vocal a pornit!");
        if (micIcon) micIcon.className = "puls-activ";
        if (mesajMic) mesajMic.innerText = "Te ascult...";
    };

    recognition.onerror = (event) => {
        console.error("Eroare Speech:", event.error);
        if(event.error === 'not-allowed') {
            alert("Accesul la microfon a fost blocat. Te rog permite accesul din setările browserului.");
        }
    };

    recognition.onresult = (event) => {
        if (!gameActive || esteInAnimatie) return;
        
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Am detectat:", transcript);
        
        if (detectatElem) detectatElem.innerText = "Ai spus: " + transcript;
        valideazaRaspuns(transcript);
    };

    recognition.onend = () => { 
        console.log("Sesiunea de recunoaștere s-a încheiat.");
        // Repornim automat dacă jocul e încă activ
        if (gameActive) {
            try { recognition.start(); } catch(e) { console.log("Eroare la repornire auto."); }
        }
    };
}

// FUNCȚIA DE ACTIVARE LA CLICK
const activareSistem = () => {
    if (!voceActiva) {
        initializareRecunoastereVocala();
        if (recognition) {
            try {
                recognition.start();
                console.log("Cerere de pornire microfon trimisă...");
            } catch (err) {
                console.error("Eroare la pornire:", err);
            }
        }
        window.removeEventListener('click', activareSistem);
        window.removeEventListener('keydown', activareSistem);
    }
};

window.addEventListener('click', activareSistem);
window.addEventListener('keydown', activareSistem);

async function valideazaRaspuns(pronuntie) {
    if (esteInAnimatie || !gameActive) return;
    
    const ex = exercitii[indexCurent];
    // Curățăm pronunția de cuvântul "to" dacă utilizatorul spune infinitivul complet
    const raspunsUtilizator = pronuntie.replace(/^to\s+/, "").trim();

    if (raspunsUtilizator === ex.raspuns || pronuntie.includes(ex.raspuns)) {
        scor += 10;
        if (scorAfisat) scorAfisat.innerText = "Scor: " + scor;
        await animatie(true);
        indexCurent++;
        
        if (indexCurent < exercitii.length) {
            incarcaEx();
        } else {
            termina(true);
        }
    } else {
        await animatie(false);
        pierdeViata();
    }
}

function incarcaEx() {
    if (propozitieElem) propozitieElem.innerText = exercitii[indexCurent].text;
    if (bubbleCuvant) bubbleCuvant.innerText = exercitii[indexCurent].infinitiv;
    if (detectatElem) detectatElem.innerText = "";
}

async function animatie(corect) {
    esteInAnimatie = true;
    for (let i = 1; i < imaginiAnimatie.length; i++) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await new Promise(r => setTimeout(r, 100));
    }
    
    personajElem.classList.add(corect ? "stare-speciala" : "stare-speciala-rosie");
    await new Promise(r => setTimeout(r, 600));
    
    personajElem.classList.remove("stare-speciala", "stare-speciala-rosie");
    personajElem.style.backgroundImage = `url('${imaginiAnimatie[0]}')`;
    esteInAnimatie = false;
}

function pierdeViata() {
    const inima = document.getElementById(`inima-${vieti}`);
    if (inima) { 
        inima.classList.remove('plina'); 
        inima.classList.add('lovita'); 
    }
    vieti--;
    if (vieti <= 0) termina(false);
}

function termina(win) {
    gameActive = false;
    if (recognition) recognition.stop();
    
    const ecran = document.getElementById('ecran-final');
    const titluFinal = document.getElementById('titlu-final');
    const scorFinal = document.getElementById('scor-final');
    const btnNext = document.getElementById('btn-next');

    if (ecran) {
        ecran.classList.remove('ascuns');
        titluFinal.innerText = win ? "Felicitări! Ai câștigat!" : "Ai pierdut toate viețile!";
        scorFinal.innerText = "Scor final: " + scor;
        if (win && btnNext) btnNext.classList.remove('ascuns');
    }
}

const butonIesire = document.getElementById('iesire');

// Adăugăm evenimentul de click
butonIesire.addEventListener('click', () => {
    // Înlocuiește "selectie_nivele.html" cu numele paginii tale principale
    const destinatie = butonIesire.getAttribute('href'); 
    window.location.href = destinatie;
});

// Adăugăm și un mic efect de hover din cod (opțional, dacă vrei să se simtă interactiv)
butonIesire.style.cursor = "pointer";

// Încărcăm primul exercițiu la start
window.onload = incarcaEx;