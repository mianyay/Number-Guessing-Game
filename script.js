const guessInput = document.getElementById("guess");
const guessBtn = document.getElementById("guess-btn");
const playagainBtn = document.getElementById("playagainbtn")
const result = document.getElementById("result");
const attemptsbtn = document.getElementById("attempts");
const highscorebtn = document.getElementById("highscore");

let randomNumber = Math.floor(Math.random() * 100) + 1;
console.log(randomNumber);
let attempts = 0;
let highScore = localStorage.getItem("highScore");
highScore = highScore ? parseInt(highScore) : null;

function updatehighscore() {
    highscorebtn.textContent = `Highscore: ${highScore ?? "-"}`;
}
updatehighscore()

function newGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    attemptsbtn.textContent = "Attempts: 0"
    result.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    playagainBtn.classList.add("hidden");
    guessInput.focus();
}

guessBtn.addEventListener("click", () => {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        result.textContent = "Please enter a valid number between 1 - 100";
        result.style.fontSize = "1rem";
        return;
    } 

    result.style.fontSize = "";
    attempts++;
    attemptsbtn.textContent = `Attempts: ${attempts}`;

    if (guess === randomNumber) {
        result.textContent = `You guessed the right number! It was ${randomNumber}`;

        if (highScore === null || attempts < highScore) {
            highScore = attempts;
            localStorage.setItem("highScore", highScore);
            updatehighscore();
            result.textContent += " - New best score!";
        }
        
        guessInput.disabled = true;
        guessBtn.disabled = true;
        playagainBtn.classList.remove("hidden");
    } else if (guess < randomNumber) {
        result.textContent = "Your guess is too low! Try again";
    } else {
        result.textContent = "Your guess is too high! Try again"
    }
});

playagainBtn.addEventListener("click", newGame)