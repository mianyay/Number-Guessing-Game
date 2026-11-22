const guessInput = document.getElementById("guess");
const guessBtn = document.getElementById("guess-btn");
const playagainBtn = document.getElementById("playagainbtn");
const result = document.getElementById("result");
const attemptsbtn = document.getElementById("attempts");
const highscorebtn = document.getElementById("highscore");
const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const promptText = document.getElementById("prompt");

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
    updatehighscore()
    guessInput.focus();
}

function duringrangeChange() {
    if (gameOver || attempts > 0) return;
    if (numberRange()) newGame();
}

minInput.addEventListener("change", duringrangeChange);
maxInput.addEventListener("change", duringrangeChange);

guessBtn.addEventListener("click", () => {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < min || guess > max) {
        result.textContent = `Please enter valid number between ${min} - ${max}`;
        result.style.fontSize = "1rem";
        return;
    }

    result.style.fontSize = "";
    attempts++;
    attemptsbtn.textContent = `Attempts: ${attempts}`;

    minInput.disabled = true;
    maxInput.disabled = true;

    if (guess === randomNumber) {
        result.textContent = `You guessed the right number! It was ${randomNumber}`;

        if (highScore === null || attempts < highScore) {
            highScore = attempts;
            localStorage.setItem(scoreKey(), highScore);
            updatehighscore();
            result.textContent += " - New best score!"
        }

        gameOver = true;
        guessInput.disabled = true;
        guessBtn.disabled = true;
        playagainBtn.disabled = false;
        minInput.disabled = false;
        maxInput.disabled = false;
    } else if (guess < randomNumber) {
        result.textContent = "Your guess is too low! Try again";
    } else {
        result.textContent = "Your guess is too high. Try again";
    }
});

playagainBtn.addEventListener("click", () => {
    if (!gameOver) return;
    if (!numberRange()) return;
    newGame()
    playagainBtn.classList.add("spin");
});

playagainBtn.addEventListener("animationed", () => {
    playagainBtn.classList.remove("spin");
});

newGame()
