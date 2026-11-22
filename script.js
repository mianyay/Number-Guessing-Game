const guessInput = document.getElementById("guess");
const guessBtn = document.getElementById("guess-btn");
const playagainBtn = document.getElementById("playagainbtn");
const result = document.getElementById("result");
const attemptsbtn = document.getElementById("attempts");
const highscorebtn = document.getElementById("highscore");
const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const promptText = document.getElementById("prompt");
const historyBox = document.getElementById("history");
const confettiBox = document.getElementById("confetti")

let min = 1
let max = 100
let randomNumber;
let attempts = 0;
let highScore = null;
let gameOver = false;

function scoreKey() {
    return `highScore_${min}-${max}`;
}

function updatehighscore() {
    const saved = localStorage.getItem(scoreKey());
    highScore = saved ? parseInt(saved) : null;
    highscorebtn.textContent = `Highscore: ${highScore ?? "-"}`;
}

function numberRange() {
    const newMin = parseInt(minInput.value);
    const newMax = parseInt(maxInput.value);

    if (isNaN(newMin) ||  isNaN(newMax) || newMin >= newMax) {
        result.textContent = `Please enter a valid range of numbers between ${min} - ${max}`;
        result.style.fontSize = "1rem";
        return false;
    }

    min = newMin;
    max = newMax;
    promptText.textContent = `Guess a number between ${min} - ${max}`
    return true;
}

function newGame() {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts = 0;
    gameOver = false;
    attemptsbtn.textContent = "Attempts: 0";
    result.textContent = "";
    result.style.fontSize = "";
    guessInput.value = ""
    guessInput.disabled = false;
    guessBtn.disabled = false;
    playagainBtn.disabled = true;
    minInput.disabled = false;
    maxInput.disabled = false;
    historyBox.innerHTML = ""
    updatehighscore()
    guessInput.focus();
    stopconfetti()
}

function duringrangeChange() {
    if (gameOver || attempts > 0) return;
    if (numberRange()) newGame();
}

minInput.addEventListener("change", duringrangeChange);
maxInput.addEventListener("change", duringrangeChange);

function addhistory(guess, type) {
    const entry = document.createElement("span");
    entry.classList.add("entry", type);
    entry.textContent = type === "low" ? `${guess} too low` : type === "high" ? `${guess} too high` : `${guess} ✓` 
    historyBox.appendChild(entry);
}

let confettiTimer = null;

function spawnconfettinumber(number) {
    const piece = document.createElement("span");
    piece.classList.add("confettiss");
    piece.textContent = number;
    piece.style.left = `${Math.random() *100}%`
    piece.style.fontSize = `${16 + Math.random() * 28}px`
    piece.style.animationDuration = `${3 + Math.random() * 3}s`;
    piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 720}deg`);
    piece.addEventListener("animationed", () => piece.remove());
    confettiBox.appendChild(piece);
}

function startconfetti(number) {
    stopconfetti()
    confettiTimer = setInterval(() => spawnconfettinumber(number), 120);
}

function stopconfetti() {
    clearInterval(confettiTimer);
    confettiTimer = null;
    confettiBox.innerHTML = "";
}

guessBtn.addEventListener("click", () => {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < min || guess > max) {
        result.textContent = `Please enter valid number between ${min} - ${max}`;
        result.style.fontSize = "1rem";
        return;
    }

    result.style.fontSize = "";

    const guessedAlready = [...historyBox.children].some(
        entry => parseInt(entry.textContent) === guess
    );
    if (guessedAlready) {
        result.textContent = `You already tried ${guess}`;
        result.style.fontSize = "1rem";
        return;
    }

    attempts++;
    attemptsbtn.textContent = `Attempts: ${attempts}`;

    minInput.disabled = true;
    maxInput.disabled = true;

    if (guess === randomNumber) {
        addhistory(guess, "correct")
        result.textContent = `You guessed the right number! It was ${randomNumber}`;

        if (highScore === null || attempts < highScore) {
            highScore = attempts;
            localStorage.setItem(scoreKey(), highScore);
            updatehighscore();
            result.textContent += " - New best score!"
        }

        gameOver = true;
        startconfetti(randomNumber)
        guessInput.disabled = true;
        guessBtn.disabled = true;
        playagainBtn.disabled = false;
        minInput.disabled = false;
        maxInput.disabled = false;
    } else if (guess < randomNumber) {
        addhistory(guess, "low");
        result.textContent = "Your guess is too low! Try again";
    } else {
        addhistory(guess, "high");
        result.textContent = "Your guess is too high. Try again";
    }
});

playagainBtn.addEventListener("click", () => {
    if (!gameOver) return;
    if (!numberRange()) return;
    newGame()
    playagainBtn.classList.add("spin");
});

playagainBtn.addEventListener("animationend", () => {
    playagainBtn.classList.remove("spin");
});

numberRange()
newGame()
