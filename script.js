const minNum = 1;
const maxNum = 100;
const answer = Math.floor(Math.random() * (maxNum - minNum + 1));

let attempts = 0;
let guess;
let running = true;

while(running == true) {

    guess = window.prompt(`Guess a number between ${minNum} - ${maxNum}`);
    guess = Number(guess);

    if(isNaN(guess)) {
        window.alert("Enter a valid number please!");
    }
    else if(guess < minNum || guess > maxNum) {
        window.alert("Enter a valid number please!");
    }
    else {
        attempts++;
        if(guess < answer) {
            windows.alert("Too low! Try again")
        }
        else if(guess > answer) {
            windows.alert("Too high! Try again")
        }
        else {
            window.alert(`Correct answer! The answer is ${answer}. Took ${attempts} attemps`);
            running = false;
        }
    }
    running = false;
}