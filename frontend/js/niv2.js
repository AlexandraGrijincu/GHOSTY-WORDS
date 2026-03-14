const verbe = [
    { ro: "Eu am mers", en: "I went" },
    { ro: "Ea a mâncat", en: "she ate" },
    { ro: "Noi am băut", en: "we drank" },
    { ro: "Tu ai dormit", en: "you slept" },
    { ro: "Ei au văzut", en: "they saw" },
    { ro: "Voi ați vorbit", en: "you spoke" },
    { ro: "Eu am scris", en: "I wrote" },
    { ro: "Ea a citit", en: "she read" },
    { ro: "Noi am alergat", en: "we ran" },
    { ro: "Tu ai făcut", en: "you did" },
    { ro: "El a venit", en: "he came" },
    { ro: "Ele au cântat", en: "they sang" },
    { ro: "Eu am lucrat", en: "I worked" },
    { ro: "Voi ați sărit", en: "you jumped" },
    { ro: "Ei au auzit", en: "they heard" }
];

let vieti = 3;
let scor = 0;
let vitezaBaza = 1.0;
let vitezaCurenta = vitezaBaza;
let pozitieX = -200; 
let pozitieY = -200; 
let verbCurent = {};
let gameActive = true;
let esteInAnimatiePersonaj = false; 
let pauzaFantoma = false; 

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


const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    
    if (gameActive) spawnFantoma(); 
}


input.addEventListener('keydown', async (event) => {

    if(event.key=='Enter')
    {
        if (!gameActive || pauzaFantoma) return;

        if (input.value.toLowerCase().trim() === verbCurent.en) {
            scor += 10;
            scorAfisat.innerText = "Scor: " + scor;

            await pornesteAnimatiePersonaj(); 

            if (scor >= 100) {
                terminaJocul(true);
            } else {
                vitezaCurenta += 0.1;
            }
            
        }
        else{
            input.style.border="2px solid red";
            setT
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


const imaginiVrajitoare = ["../imagini/vrajitoare/v1.png", "../imagini/vrajitoare/v2.png", "../imagini/vrajitoare/v3.png"];
let frameVrajitoare = 0;

setInterval(() => {
    frameVrajitoare = (frameVrajitoare + 1) % imaginiVrajitoare.length;
    const vImg = document.getElementById('vrajitoare');
    if (vImg) vImg.src = imaginiVraj
    itoare[frameVrajitoare];
}, 150); 

seteazaIdlePersonaj();
spawnFantoma();
requestAnimationFrame(joc);