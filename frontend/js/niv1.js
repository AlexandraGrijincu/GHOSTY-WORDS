// --- DATE JOC ---
const verbe = [
    { ro: "a merge", en: "to go" }, { ro: "a manca", en: "to eat" },
    { ro: "a bea", en: "to drink" }, { ro: "a dormi", en: "to sleep" },
    { ro: "a vedea", en: "to see" }, { ro: "a vorbi", en: "to speak" },
    { ro: "a scrie", en: "to write" }, { ro: "a citi", en: "to read" },
    { ro: "a alerga", en: "to run" }, { ro: "a face", en: "to do" },
    { ro: "a veni", en: "to come" }, { ro: "a canta", en: "to sing" },
    { ro: "a lucra", en: "to work" }, { ro: "a sari", en: "to jump" },
    { ro: "a auzi", en: "to hear" },{ ro: "a juca", en: "to play" }, { ro: "a invata", en: "to learn" },
    { ro: "a gandi", en: "to think" }, { ro: "a cumpara", en: "to buy" },
    { ro: "a vinde", en: "to sell" }, { ro: "a deschide", en: "to open" },
    { ro: "a inchide", en: "to close" }, { ro: "a zbura", en: "to fly" },
    { ro: "a inota", en: "to swim" }, { ro: "a rade", en: "to laugh" },
    { ro: "a plange", en: "to cry" }, { ro: "a sta", en: "to stay" },
    { ro: "a aduce", en: "to bring" }, { ro: "a lua", en: "to take" },
    { ro: "a da", en: "to give" }, { ro: "a simti", en: "to feel" },
    { ro: "a iubi", en: "to love" }, { ro: "a uri", en: "to hate" },
    { ro: "a sti", en: "to know" }, { ro: "a gasi", en: "to find" },
    { ro: "a pierde", en: "to lose" }, { ro: "a incerca", en: "to try" },
    { ro: "a intreba", en: "to ask" }, { ro: "a raspunde", en: "to answer" },
    { ro: "a astepta", en: "to wait" }, { ro: "a intelege", en: "to understand" },
    { ro: "a ajuta", en: "to help" }, { ro: "a privi", en: "to watch" },
    { ro: "a taia", en: "to cut" }, { ro: "a cadea", en: "to fall" }
];

// --- VARIABILE STARE ---
let vieti = 3;
let scor = 0;
let verbenr = 1;
let vitezaBaza = 0.7;
let vitezaCurenta = vitezaBaza;
let pozitieX = -200;
let pozitieY = -200;
let verbCurent = {};
let gameActive = true;
let esteInAnimatiePersonaj = false;
let pauzaFantoma = false;

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

// ATENȚIE: Am folosit "idel.png" pentru că așa am văzut în pozele tale din Explorer!
const imaginiAnimatie = ["../images/idel.png", "../images/001.png", "../images/002.png", "../images/003.png"];

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    if (pauzaFantoma) return;
    pauzaFantoma = true;

    const fantomaImg = document.getElementById('fantoma');
    if (fantomaImg) fantomaImg.classList.add('fantoma-inghetata-verde');
    personajElem.classList.add("stare-speciala-rosie");
    
    await asteaptaMs(400);
    personajElem.classList.remove("stare-speciala-rosie");

    const inima = document.getElementById(`inima-${vieti}`);
    if (inima) {
        inima.classList.remove('plina');
        inima.classList.add('lovita');
    }

    vieti--;
    await asteaptaMs(200);

    if (fantomaImg) fantomaImg.classList.remove('fantoma-inghetata-verde');
    pauzaFantoma = false;

    if (vieti <= 0) {
        terminaJocul(false);
    } else {
        verbenr++;
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
        localStorage.setItem('userProgress', 2);
    } else {
        titluFinal.innerText = "Ai pierdut!";
        titluFinal.style.color = "#ff4d4d";
    }

    // Apelăm salvarea, dar nu blocăm jocul dacă serverul e oprit
    salveazaScorul(scor).catch(err => console.log("Server offline, scor nesalvat pe DB."));
}

function seteazaIdlePersonaj() {
    if (personajElem) personajElem.style.backgroundImage = `url('${imaginiAnimatie[0]}')`;
}

async function pornesteAnimatiePersonaj() {
    if (esteInAnimatiePersonaj) return;
    esteInAnimatiePersonaj = true;
    pauzaFantoma = true;

    for (let i = 1; i < imaginiAnimatie.length; i++) {
        await asteaptaMs(100);
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
    }

    personajElem.classList.add("stare-speciala");
    await asteaptaMs(500);
    personajElem.classList.remove("stare-speciala");

    for (let i = imaginiAnimatie.length - 2; i >= 0; i--) {
        await asteaptaMs(100);
        personajElem.style.backgroundImage = `url('${imaginiAnimatie[i]}')`;
    }

    seteazaIdlePersonaj();
    esteInAnimatiePersonaj = false;
    pauzaFantoma = false;
    
    if (gameActive) {
        verbenr++;
        spawnFantoma();
    }
}

input.addEventListener('input', async () => {
    if (!gameActive || pauzaFantoma) return;

    if (input.value.toLowerCase().trim() === verbCurent.en) {
        const fantomaImg = document.getElementById('fantoma');
        await pornesteAnimatiePersonaj();
        
        scor += 10;
        scorAfisat.innerText = "Scor: " + scor;

        if (scor >= 100) {
            terminaJocul(true);
        } else {
            vitezaCurenta += 0.1;
        }
    }
});

// --- SALVARE SERVER (MODIFICATĂ SĂ NU BLOCHEZE) ---
async function salveazaScorul(scorFinal) {
    const userId = localStorage.getItem('userId') || 1;
    // Doar dacă suntem pe localhost încercăm să trimitem la serverul de Java/Node
    if (window.location.hostname === "localhost") {
        try {
            await fetch('http://localhost:8080/api/battle/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId), score: scorFinal })
            });
        } catch (e) {
            console.warn("Serverul local nu răspunde.");
        }
    } else {
        console.log("Ești pe GitHub Pages - Scorul a fost salvat doar local.");
    }
}

// Buton Ieșire
const butonIesire = document.getElementById('iesire');
if(butonIesire) {
    butonIesire.addEventListener('click', () => {
        window.location.href = '../index.html'; 
    });
}

// --- START ---
seteazaIdlePersonaj();
spawnFantoma();
requestAnimationFrame(joc);