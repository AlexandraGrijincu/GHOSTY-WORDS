// --- CONFIGURARE DATE NIVEL (PRESENT CONTINUOUS) ---
const exercitii = [
    { text: "The student .... a long essay now.", raspuns: "is writing", infinitiv: "to write" },
    { text: "She .... to the market at the moment.", raspuns: "is going", infinitiv: "to go" },
    { text: "They .... all the water right now.", raspuns: "are drinking", infinitiv: "to drink" },
    { text: "I .... a big pizza currently.", raspuns: "am eating", infinitiv: "to eat" },
    { text: "Listen! He .... a beautiful song.", raspuns: "is singing", infinitiv: "to sing" },
    { text: "We .... a loud noise outside now.", raspuns: "are hearing", infinitiv: "to hear" },
    { text: "Look! The boy .... over the fence.", raspuns: "is jumping", infinitiv: "to jump" },
    { text: "They .... the house right now.", raspuns: "are leaving", infinitiv: "to leave" },
    { text: "I .... a famous actor on TV today.", raspuns: "am seeing", infinitiv: "to see" },
    { text: "They .... a new house this month.", raspuns: "are buying", infinitiv: "to buy" },
    { text: "The teacher .... us a story right now.", raspuns: "is telling", infinitiv: "to tell" },
    { text: "We .... a lot of photos at the moment.", raspuns: "are taking", infinitiv: "to take" },
    { text: "She .... her homework very fast now.", raspuns: "is doing", infinitiv: "to do" }
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

        await pornesteAnimatieVrajitoare(false);
        
        const textCuRaspuns = ex.text.replace("....", `[ ${raspunsCorect.toUpperCase()} ]`);
        chenarPropozitie.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">${textCuRaspuns}</span>`;
        
        pierdeViata();

        await asteaptaMs(2500);
        
        esteInAnimatie = false;

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

function pierdeViata() {
    const inima = document.getElementById(`inima-${vieti}`);
    if (inima) {
        inima.classList.remove('plina');
        inima.classList.add('lovita');
    }
    vieti--;
}

function terminaJocul(aCastigat) {
    const ecranFinal = document.getElementById('ecran-final');
    const titluFinal = document.getElementById('titlu-final');
    const scorFinal = document.getElementById('scor-final');
    
    ecranFinal.classList.remove('ascuns');
    scorFinal.innerText = "Scor final: " + scor;
    
    if (aCastigat) {
        titluFinal.innerText = "Felicitări! Ai învățat Present Continuous!";
        titluFinal.style.color = "#4caf50";
        document.getElementById('btn-next').classList.remove('ascuns');
    } else {
        titluFinal.innerText = "Mai încearcă!";
        titluFinal.style.color = "#ff4d4d";
    }
}

const asteaptaMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.onload = initNivel;