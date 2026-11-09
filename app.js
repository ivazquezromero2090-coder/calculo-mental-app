let score = 0;
let streak = 0;
let currentCategory = 'infantil_1';
let currentCorrectAnswer = ""; 
let acceptableAnswers = []; 
let lastOperationString = ""; 

// Temporizador exclusivo para examen (60s)
let timeLeft = 60;
let timerInterval = null;

// Elementos del DOM
const categorySelect = document.getElementById('categorySelect');
const startBtn = document.getElementById('startBtn');
const selectorSection = document.getElementById('selectorSection');
const gameArea = document.getElementById('gameArea');
const operationText = document.getElementById('operationText');
const userAnswer = document.getElementById('userAnswer');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const feedbackMessage = document.getElementById('feedbackMessage');
const timeLeftDisplay = document.getElementById('timeLeft');
const timerContainer = document.getElementById('timerContainer');

// Elementos de cambio de nivel
const changeLevelBtn = document.getElementById('changeLevelBtn');
const currentLevelName = document.getElementById('currentLevelName');
const levelModal = document.getElementById('levelModal');
const modalCategorySelect = document.getElementById('modalCategorySelect');
const confirmChangeBtn = document.getElementById('confirmChangeBtn');
const cancelChangeBtn = document.getElementById('cancelChangeBtn');

// Eventos principales
startBtn.addEventListener('click', startGame);
submitAnswerBtn.addEventListener('click', checkAnswer);
userAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

changeLevelBtn.addEventListener('click', () => {
    stopTimer();
    levelModal.classList.remove('hidden');
});
cancelChangeBtn.addEventListener('click', () => {
    levelModal.classList.add('hidden');
    if (currentCategory === 'examen_tema2') startTimer();
});
confirmChangeBtn.addEventListener('click', () => {
    currentCategory = modalCategorySelect.value;
    updateLevelBadgeName();
    levelModal.classList.add('hidden');
    generateNewQuestion();
});

function startGame() {
    currentCategory = categorySelect.value;
    score = 0;
    streak = 0;
    lastOperationString = "";
    updateScoreboard();
    updateLevelBadgeName();
    
    selectorSection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    generateNewQuestion();
}

function updateLevelBadgeName() {
    const names = {
        'infantil_1': 'Infantil 1',
        'infantil_2': 'Infantil 2',
        'primaria': 'Primaria',
        'secundaria_1': 'Secundaria Niv. 1',
        'secundaria_2': 'Secundaria Niv. 2',
        'bachillerato_1': 'Bachillerato Niv. 1',
        'bachillerato_2': 'Bachillerato Niv. 2',
        'examen_tema2': 'Examen Tema 2 (3º ESO)'
    };
    currentLevelName.textContent = names[currentCategory];
    modalCategorySelect.value = currentCategory;
}

// Gestión del Temporizador (Sólo activo en examen_tema2 a 60 segundos)
function startTimer() {
    stopTimer();
    
    if (currentCategory === 'examen_tema2') {
        timerContainer.classList.remove('hidden');
        timeLeft = 60;
        timeLeftDisplay.textContent = timeLeft;
        timerContainer.style.background = "#fef3c7";
        timerContainer.style.color = "#d97706";

        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;

            if (timeLeft <= 10) {
                timerContainer.style.background = "#fee2e2";
                timerContainer.style.color = "#dc2626";
            }

            if (timeLeft <= 0) {
                stopTimer();
                handleTimeout();
            }
        }, 1000);
    } else {
        timerContainer.classList.add('hidden');
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function handleTimeout() {
    streak = 0;
    feedbackMessage.style.color = '#dc2626';
    feedbackMessage.textContent = `⏰ ¡Tiempo agotado! La respuesta era: ${acceptableAnswers[0]}`;
    updateScoreboard();
    setTimeout(generateNewQuestion, 1500);
}

// Generador de Preguntas
function generateNewQuestion() {
    stopTimer();
    userAnswer.value = "";
    feedbackMessage.textContent = "";
    
    let opData;
    let attempts = 0;

    do {
        opData = createRandomOperation(currentCategory);
        attempts++;
        if (attempts > 15) break;
    } while (opData.text === lastOperationString && currentCategory !== 'examen_tema2');

    lastOperationString = opData.text;
    operationText.textContent = opData.text + " = ?";
    acceptableAnswers = opData.answers;
    userAnswer.focus();
    
    startTimer();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fábrica de Operaciones Actualizada con Secundaria Nivel 2 (Raíces y Combinadas Exigentes)
function createRandomOperation(category) {
    let text, answers;

    if (category === 'infantil_1') {
        let n1 = getRandomInt(0, 15);
        let n2 = getRandomInt(0, 20 - n1);
        text = `${n1} + ${n2}`;
        answers = [(n1 + n2).toString()];
    } else if (category === 'infantil_2') {
        const isSum = Math.random() > 0.5;
        if (isSum) {
            let n1 = getRandomInt(0, 20);
            let n2 = getRandomInt(0, 20 - n1);
            text = `${n1} + ${n2}`;
            answers = [(n1 + n2).toString()];
        } else {
            let n1 = getRandomInt(5, 20);
            let n2 = getRandomInt(0, n1);
            text = `${n1} - ${n2}`;
            answers = [(n1 - n2).toString()];
        }
    } else if (category === 'primaria') {
        const subType = getRandomInt(1, 3);
        if (subType === 1) {
            let n1 = getRandomInt(5, 50), n2 = getRandomInt(5, 50);
            text = `${n1} + ${n2}`;
            answers = [(n1 + n2).toString()];
        } else if (subType === 2) {
            let n1 = getRandomInt(20, 90), n2 = getRandomInt(1, n1);
            text = `${n1} - ${n2}`;
            answers = [(n1 - n2).toString()];
        } else {
            let n1 = getRandomInt(2, 10), n2 = getRandomInt(2, 10);
            text = `${n1} × ${n2}`;
            answers = [(n1 * n2).toString()];
        }
    } else if (category === 'secundaria_1') {
        const subType = getRandomInt(1, 3);
        if (subType === 1) {
            let n1 = getRandomInt(2, 10), n2 = getRandomInt(2, 10), n3 = getRandomInt(2, 10);
            text = `${n1} + ${n2} × ${n3}`;
            answers = [(n1 + (n2 * n3)).toString()];
        } else if (subType === 2) {
            let n2 = getRandomInt(2, 12), mult = getRandomInt(2, 12), n1 = n2 * mult;
            text = `${n1} ÷ ${n2}`;
            answers = [mult.toString()];
        } else {
            let base = getRandomInt(2, 20) * 10;
            let pct = [10, 20, 25, 50][getRandomInt(0, 3)];
            text = `${pct}% de ${base}`;
            answers = [((base * pct) / 100).toString()];
        }
    } else if (category === 'secundaria_2') {
        // Secundaria Nivel 2: Raíces cuadradas y operaciones combinadas más exigentes con jerarquía[cite: 7]
        const subType = getRandomInt(1, 2);
        if (subType === 1) {
            // Raíces cuadradas exactas avanzadas
            const roots = [36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256];
            let n1 = roots[getRandomInt(0, roots.length - 1)];
            text = `√${n1}`;
            answers = [Math.sqrt(n1).toString()];
        } else {
            // Operaciones combinadas exigentes con paréntesis y prioridades[cite: 7]
            const combType = getRandomInt(1, 3);
            if (combType === 1) {
                // (a + b) × c - d
                let a = getRandomInt(2, 10), b = getRandomInt(2, 10), c = getRandomInt(2, 5), d = getRandomInt(1, 10);
                text = `(${a} + ${b}) × ${c} - ${d}`;
                let ans = ((a + b) * c) - d;
                answers = [ans.toString()];
            } else if (combType === 2) {
                // a × (b - c) + d
                let a = getRandomInt(2, 5), b = getRandomInt(6, 15), c = getRandomInt(1, 5), d = getRandomInt(2, 15);
                if (c > b) { let temp = b; b = c; c = temp; }
                text = `${a} × (${b} - ${c}) + ${d}`;
                let ans = (a * (b - c)) + d;
                answers = [ans.toString()];
            } else {
                // a + b × c ÷ d (con división exacta)
                let d = [2, 3, 4, 5][getRandomInt(0, 3)];
                let mult = getRandomInt(2, 6);
                let bc = d * mult; // b*c divisible por d
                let b = d, c = mult;
                let a = getRandomInt(5, 20);
                text = `${a} + ${b} × ${c} ÷ ${d}`;
                let ans = a + ((b * c) / d);
                answers = [ans.toString()];
            }
        }
    } else if (category === 'bachillerato_1') {
        const subType = getRandomInt(1, 3);
        if (subType === 1) {
            const roots = [16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
            let n1 = roots[getRandomInt(0, roots.length - 1)];
            text = `√${n1}`;
            answers = [Math.sqrt(n1).toString()];
        } else if (subType === 2) {
            let n1 = getRandomInt(2, 6), n2 = getRandomInt(2, 3);
            text = `${n1} ^ ${n2}`;
            answers = [Math.pow(n1, n2).toString()];
        } else {
            let n1 = getRandomInt(-20, -2), n2 = getRandomInt(5, 25);
            text = `(${n1}) + ${n2}`;
            answers = [(n1 + n2).toString()];
        }
    } else if (category === 'bachillerato_2') {
        const subType = getRandomInt(1, 3);
        if (subType === 1) {
            const cubics = [8, 27, 64, 125];
            let val = cubics[getRandomInt(0, cubics.length - 1)];
            text = `∛${val}`;
            answers = [Math.cbrt(val).toString()];
        } else if (subType === 2) {
            const logs = [{b: 2, v: 8, r: 3}, {b: 3, v: 9, r: 2}, {b: 2, v: 16, r: 4}, {b: 10, v: 100, r: 2}];
            let chosen = logs[getRandomInt(0, logs.length - 1)];
            text = `log_${chosen.b}(${chosen.v})`;
            answers = [chosen.r.toString()];
        } else {
            let bNeg = getRandomInt(2, 4);
            text = `${bNeg}^(-2)`;
            answers = [`1/${bNeg*bNeg}`, (1/Math.pow(bNeg, 2)).toString()];
        }
    } else if (category === 'examen_tema2') {
        const questionId = getRandomInt(1, 10);
        switch(questionId) {
            case 1:
                text = "(2)^(-3)";
                answers = ["0.125", "1/8", "0,125"];
                break;
            case 2:
                text = "-3^4";
                answers = ["-81"];
                break;
            case 3:
                text = "3^7 / 3^4";
                answers = ["27", "3^3"];
                break;
            case 4:
                text = "Conv. a Not. Científica: 0,00045";
                answers = ["5*10^-4", "5·10^-4", "5e-4"];
                break;
            case 5:
                text = "(2·10^5) · (3·10^3)";
                answers = ["6*10^8", "6·10^8", "6e8"];
                break;
            case 6:
                text = "Raiz cúbica(-64)";
                answers = ["-4"];
                break;
            case 7:
                text = "Extraer factores en √12";
                answers = ["2√3", "2raiz(3)", "2*raíz(3)"];
                break;
            case 8:
                text = "4√2 + 5√2 - 2√2";
                answers = ["7√2", "7raiz(2)"];
                break;
            case 9:
                text = "E_abs (V_real=7,576, V_aprox=7,58)";
                answers = ["0.004", "0,004"];
                break;
            case 10:
                text = "¿Entre qué enteros está √50?";
                answers = ["7 y 8", "7-8", "7, 8"];
                break;
        }
        return { text, answers };
    }

    return { text, answers };
}

function checkAnswer() {
    stopTimer();
    const userVal = userAnswer.value.trim().toLowerCase().replace(/\s+/g, '');

    if (userVal === "") {
        feedbackMessage.style.color = '#dc2626';
        feedbackMessage.textContent = "⚠️ Por favor, introduce una respuesta.";
        if (currentCategory === 'examen_tema2') startTimer();
        return;
    }

    const isCorrect = acceptableAnswers.some(ans => ans.toLowerCase().replace(/\s+/g, '') === userVal);

    if (isCorrect) {
        score += 10;
        streak += 1;
        feedbackMessage.style.color = '#059669';
        feedbackMessage.textContent = "🎉 ¡Correcto! ¡Excelente agilidad!";
        updateScoreboard();
        setTimeout(generateNewQuestion, 900);
    } else {
        streak = 0;
        feedbackMessage.style.color = '#dc2626';
        feedbackMessage.textContent = `❌ Era: ${acceptableAnswers[0]}. ¡Ánimo!`;
        updateScoreboard();
        setTimeout(generateNewQuestion, 1400);
    }
}

function updateScoreboard() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak + " 🔥";
}