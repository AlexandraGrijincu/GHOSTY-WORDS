const verbe = [
    // Acțiuni de bază și mișcare
    { ro: "eu merg", en: "I am going" }, { ro: "tu mananci", en: "you are eating" },
    { ro: "el bea", en: "he is drinking" }, { ro: "ea doarme", en: "she is sleeping" },
    { ro: "noi alergam", en: "we are running" }, { ro: "voi veniti", en: "you are coming" },
    { ro: "ei pleaca", en: "they are leaving" }, { ro: "ele sar", en: "they are jumping" },

    // Comunicare și învățare
    { ro: "eu vorbesc", en: "I am speaking" }, { ro: "tu scrii", en: "you are writing" },
    { ro: "el citeste", en: "he is reading" }, { ro: "ea asculta", en: "she is listening" },
    { ro: "noi invatam", en: "we are learning" }, { ro: "voi intrebati", en: "you are asking" },
    { ro: "ei raspund", en: "they are answering" }, { ro: "eu gandesc", en: "I am thinking" },

    // Muncă și activități zilnice
    { ro: "tu lucrezi", en: "you are working" }, { ro: "el face", en: "he is doing" },
    { ro: "ea joaca", en: "she is playing" }, { ro: "noi cantam", en: "we are singing" },
    { ro: "voi cumparati", en: "you are buying" }, { ro: "ei vand", en: "they are selling" },
    { ro: "ele deschid", en: "they are opening" }, { ro: "eu inchid", en: "I am closing" },

    // Interacțiuni cu obiecte
    { ro: "tu aduci", en: "you are bringing" }, { ro: "el ia", en: "he is taking" },
    { ro: "ea da", en: "she is giving" }, { ro: "noi cautam", en: "we are looking" },
    { ro: "voi gasiti", en: "you are finding" }, { ro: "ei taie", en: "they are cutting" },
    { ro: "eu ascund", en: "I am hiding" }, { ro: "tu incerci", en: "you are trying" },

    // Stări, emoții și alte acțiuni
    { ro: "el rade", en: "he is laughing" }, { ro: "ea plange", en: "she is crying" },
    { ro: "noi zburam", en: "we are flying" }, { ro: "voi inotati", en: "you are swimming" },
    { ro: "ei stau", en: "they are staying" }, { ro: "ele asteapta", en: "they are waiting" },
    { ro: "eu ajut", en: "I am helping" }, { ro: "tu privesti", en: "you are watching" },
    { ro: "el cade", en: "he is falling" }, { ro: "ea simte", en: "she is feeling" }
];

// --- VARIABILE STARE ---
let vieti = 3;
let scor = 0;
let vitezaBaza = 0.7;
let vitezaCurenta = vitezaBaza;
let pozitieX = -200; 
let pozitieY = 100; 
let verbCurent = {};
let gameActive = true;
let esteInAnimatiePersonaj = false; 
let pauzaFantoma = false; 
let recognition;

// --- ELEMENTE DOM ---
const ghostCont = document.getElementById('container-fantoma');
const bubble = document.getElementById('bubble-cuvant');
const scorAfisat = document.getElementById('scor');
const ecranFinal = document.getElementById('ecran-final');
const titluFinal = document.getElementById('titlu-final');
const scorTextFinal = document.getElementById('scor-final');
const btnNext = document.getElementById('btn-next');
const personajElem = document.getElementById("personaj");
const cuvantDetectatElem = document.getElementById('cuvant-detectat');

// Căile imaginilor 
const imaginiAnimatie = [
    "../images/idel.png", 
    "../images/001.png", 
    "../images/002.png", 
    "../images/003.png"
];

// --- CONFIGURARE RECUNOAȘTERE VOCALĂ ---

function initializareRecunoastereVocala() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("Browser-ul nu suportă recunoașterea vocală. Folosește Chrome sau Edge.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        if (cuvantDetectatElem) cuvantDetectatElem.innerText = "Ai spus: " + transcript;
        verificaRaspuns(transcript);
    };

    recognition.onend = () => {
        if (gameActive) {
            try { recognition.start(); } catch(e) {}
        }
    };

    recognition.onerror = (event) => {
        console.error("Eroare Speech:", event.error);
    };

    recognition.start();
}

async function verificaRaspuns(pronuntie) {
    if (!gameActive || pauzaFantoma) return;

    // Eliminăm "to " din ambele părți pentru a fi mai permisiv
    let raspunsUtilizator = pronuntie.replace(/^to\s+/, "").trim();
    let raspunsCorect = verbCurent.en.replace(/^to\s+/, "").trim();

    if (raspunsUtilizator === raspunsCorect || pronuntie.includes(raspunsCorect)) {
        scor += 10;
        scorAfisat.innerText = "Scor: " + scor;
        if (cuvantDetectatElem) cuvantDetectatElem.innerText = "Corect! 🎉";

        await pornesteAnimatiePersonaj(); 

        if (scor >= 100) {
            terminaJocul(true);
        } else {
            vitezaCurenta += 0.15;
           
        }
    }
}

// --- LOGICA MISCARE FANTOMA ---

function spawnFantoma() {
    if (!gameActive) return;
    verbCurent = verbe[Math.floor(Math.random() * verbe.length)];
    bubble.innerText = verbCurent.ro;
    
    // Resetăm poziția fantomei
    pozitieX = -200; 
    pozitieY = -100; 
    
    ghostCont.style.right = pozitieX + "px";
    ghostCont.style.top = pozitieY + "px";
}
const butonIesire = document.getElementById('iesire');

// Adăugăm evenimentul de click
butonIesire.addEventListener('click', () => {
  
    const destinatie = butonIesire.getAttribute('href'); 
    window.location.href = destinatie;
});


butonIesire.style.cursor = "pointer";

function joc() {
    if (!gameActive) return;

    if (pauzaFantoma) {
        requestAnimationFrame(joc);
        return;
    }

    pozitieX += vitezaCurenta;
    // Efect de plutire ușoară pe verticală
    pozitieY = 200 + Math.sin(Date.now() / 500) * 30;
    
    ghostCont.style.right = pozitieX + "px";
    ghostCont.style.top = pozitieY + "px";

    // Dacă fantoma ajunge la personaj 
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
        // Mică pauză să nu apară instant
        pauzaFantoma = true;
        setTimeout(() => { pauzaFantoma = false; }, 500);
        requestAnimationFrame(joc); 
    }
}

// --- ANIMATIE PERSONAJ ---

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function seteazaIdlePersonaj() {
    if (personajElem) personajElem.style.backgroundImage = `url('${imaginiAnimatie[0]}')`;
}

async function pornesteAnimatiePersonaj() {
    if (esteInAnimatiePersonaj) return;
    esteInAnimatiePersonaj = true;
    pauzaFantoma = true; 

    // Cadre de atac
    for (let i = 1; i < imaginiAnimatie.length; i++) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(100);
    }

    personajElem.classList.add("stare-speciala");
    await asteaptaMs(400); 
    personajElem.classList.remove("stare-speciala");

    // Revenire la idle
    for (let i = imaginiAnimatie.length - 2; i >= 0; i--) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(100);
    }

    seteazaIdlePersonaj();
    esteInAnimatiePersonaj = false;
    pauzaFantoma = false; 
    
    if (gameActive) spawnFantoma(); 
}

// --- FINAL JOC ---

async function terminaJocul(aCastigat) {
    gameActive = false;
    if (recognition) recognition.stop();
    
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

async function salveazaScorul(scorFinal) {
    try {
        await fetch('/api/battle/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, score: scorFinal, level: 1 })
        });
    } catch (e) { console.error("Eroare salvare scor"); }
}

// --- INITIALIZARE ---
window.onload = () => {
    seteazaIdlePersonaj();
    spawnFantoma();
    initializareRecunoastereVocala();
    requestAnimationFrame(joc);
};