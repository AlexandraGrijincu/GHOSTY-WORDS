let verbe2_audio = [];


let vieti = 3;
let scor = 0;
let vitezaBaza = 1.2;
let vitezaCurenta = vitezaBaza;
let pozitieX = -200; 
let pozitieY = 100; 
let verbCurent = {};
let gameActive = true;
let esteInAnimatiePersonaj = false; 
let pauzaFantoma = false; 
let recognition;

const ghostCont = document.getElementById('container-fantoma');
const bubble = document.getElementById('bubble-cuvant');
const scorAfisat = document.getElementById('scor');
const ecranFinal = document.getElementById('ecran-final');
const titluFinal = document.getElementById('titlu-final');
const scorTextFinal = document.getElementById('scor-final');
const btnNext = document.getElementById('btn-next');
const personajElem = document.getElementById("personaj");
const cuvantDetectatElem = document.getElementById('cuvant-detectat');


const imaginiAnimatie = [
    "../images/idel.png", 
    "../images/001.png", 
    "../images/002.png", 
    "../images/003.png"
];


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


function spawnFantoma() {
    if (!gameActive || verbe2_audio.length ===0) return;
    verbCurent = verbe2_audio[Math.floor(Math.random() * verbe2_audio.length)];
    bubble.innerText = verbCurent.ro;
    
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
    pozitieY = 200 + Math.sin(Date.now() / 500) * 30;
    
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
        
        pauzaFantoma = true;
        setTimeout(() => { pauzaFantoma = false; }, 500);
        requestAnimationFrame(joc); 
    }
}

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function seteazaIdlePersonaj() {
    if (personajElem) personajElem.style.backgroundImage = `url('${imaginiAnimatie[0]}')`;
}

async function pornesteAnimatiePersonaj() {
    if (esteInAnimatiePersonaj) return;
    esteInAnimatiePersonaj = true;
    pauzaFantoma = true; 

    for (let i = 1; i < imaginiAnimatie.length; i++) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(100);
    }

    personajElem.classList.add("stare-speciala");
    await asteaptaMs(400); 
    personajElem.classList.remove("stare-speciala");

    for (let i = imaginiAnimatie.length - 2; i >= 0; i--) {
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
        await asteaptaMs(100);
    }

    seteazaIdlePersonaj();
    esteInAnimatiePersonaj = false;
    pauzaFantoma = false; 
    
    if (gameActive) spawnFantoma(); 
}
const butonIesire = document.getElementById('iesire');

// Adăugăm evenimentul de click
butonIesire.addEventListener('click', () => {
    
    const destinatie = butonIesire.getAttribute('href'); 
    window.location.href = destinatie;
});


butonIesire.style.cursor = "pointer";

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

async function incarcaVerbeBD() {
    try {
        console.log("Se încarcă datele de la /api/verbe2_audio...");
        const raspuns = await fetch('http://localhost:8080/api/verbe2_audio');
        const date = await raspuns.json();

        console.log("Date primite din tabelul GEN:", date);

        verbe2_audio = date.map(v => ({
            ro: v.ro_past_simple || "Lipsă RO",
            en: v.en_past_simple ? v.en_past_simple.toLowerCase().trim() : ""
        }));

        if (verbe2_audio.length > 0) {
            console.log("Date încărcate cu succes! Verbe disponibile:", verbe2_audio.length);
            spawnFantoma(); 
        } else {
            console.error("Atenție: Serverul a trimis o listă goală pentru Nivelul 2!");
        }
    } catch (error) {
        console.error("Eroare critică la fetch:", error);
    }
}


window.onload = async () => {
    seteazaIdlePersonaj();
    
    await incarcaVerbeBD(); 
    
    initializareRecunoastereVocala();
    requestAnimationFrame(joc);
};
