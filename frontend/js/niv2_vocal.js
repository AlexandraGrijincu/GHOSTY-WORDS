const verbe = [
    // Verbul "A FI" (foarte important, e neregulat în engleză la singular/plural)
    { ro: "eu am fost", en: "I was" }, { ro: "tu ai fost", en: "you were" },
    { ro: "noi am fost", en: "we were" }, { ro: "ele au fost", en: "they were" },

    // Acțiuni zilnice
    { ro: "el a mers", en: "he went" }, { ro: "ea a mancat", en: "she ate" },
    { ro: "noi am baut", en: "we drank" }, { ro: "voi ati dormit", en: "you slept" },
    { ro: "ei au vazut", en: "they saw" }, { ro: "eu am vorbit", en: "I spoke" },
    
    // Învățare și comunicare
    { ro: "tu ai scris", en: "you wrote" }, { ro: "el a citit", en: "he read" },
    { ro: "noi am invatat", en: "we learned" }, { ro: "voi ati inteles", en: "you understood" },
    { ro: "ea a intrebat", en: "she asked" }, { ro: "el a raspuns", en: "he answered" },
    { ro: "eu am stiut", en: "I knew" },

    // Mișcare și activități
    { ro: "ea a alergat", en: "she ran" }, { ro: "noi am facut", en: "we did" },
    { ro: "voi ati venit", en: "you came" }, { ro: "ele au cantat", en: "they sang" },
    { ro: "eu am lucrat", en: "I worked" }, { ro: "tu ai sarit", en: "you jumped" },
    { ro: "el a auzit", en: "he heard" }, { ro: "ea a jucat", en: "she played" },
    { ro: "noi am inotat", en: "we swam" }, { ro: "ele au zburat", en: "they flew" },

    // Obiecte și interacțiuni
    { ro: "ei au cumparat", en: "they bought" }, { ro: "eu am vandut", en: "I sold" },
    { ro: "tu ai deschis", en: "you opened" }, { ro: "el a inchis", en: "he closed" },
    { ro: "tu ai adus", en: "you brought" }, { ro: "el a luat", en: "he took" },
    { ro: "ea a dat", en: "she gave" }, { ro: "tu ai gasit", en: "you found" },
    { ro: "el a pierdut", en: "he lost" }, { ro: "ea a taiat", en: "she cut" },

    // Stări și emoții
    { ro: "voi ati ras", en: "you laughed" }, { ro: "ele au plans", en: "they cried" },
    { ro: "eu am stat", en: "I stayed" }, { ro: "noi am simtit", en: "we felt" },
    { ro: "voi ati iubit", en: "you loved" }, { ro: "ei au urat", en: "they hated" },
    { ro: "ea a incercat", en: "she tried" }, { ro: "ei au asteptat", en: "they waited" },
    { ro: "tu ai ajutat", en: "you helped" }, { ro: "el a privit", en: "he watched" },
    { ro: "noi am cazut", en: "we fell" }, { ro: "voi ati gandit", en: "you thought" }
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
            // spawnFantoma() este apelat automat la finalul animației personajului
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
const butonIesire = document.getElementById('iesire');

// Adăugăm evenimentul de click
butonIesire.addEventListener('click', () => {
   
    const destinatie = butonIesire.getAttribute('href'); 
    window.location.href = destinatie;
});


butonIesire.style.cursor = "pointer";

// --- INITIALIZARE ---
window.onload = () => {
    seteazaIdlePersonaj();
    spawnFantoma();
    initializareRecunoastereVocala();
    requestAnimationFrame(joc);
};