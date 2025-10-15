const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        menuLives: document.querySelector(".menu-lives h2"),
        startButton: document.querySelector("#startButton"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        gameRunning: false,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
};

function playSound(audioName) {
    let audio = new Audio(`./src/sounds/${audioName}.wav`);
    audio.volume = 0.125;
    audio.play();
}

function countDown() {
    state.values.currentTime --;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0 || (state.values.gameRunning && state.values.lives <= 0)) {
        gameOver();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");

    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(!state.values.gameRunning) return;
            
            if(square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }else {
                state.values.lives--;
                state.view.menuLives.textContent = `x${state.values.lives}`;
                playSound("miss");
            }

            if(state.values.lives <= 0){
                gameOver();
            }
        })
    });
}

function gameOver() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.values.gameRunning = false;

    if(state.values.lives <= 0) {
        alert("Game Over! You've run out of lives. Your final score is: " + state.values.result);
    }else if (state.values.result > 30) {
        alert("CONGRATULATIONS! You wreck-it Ralph and got " + state.values.result + " points!");
    }else {
        alert("Game Over! Time's up. Your final score was: " + state.values.result);
    }
}

function startGame() {
    if(state.values.gameRunning) return;

    state.values.gameRunning = true;
    state.values.currentTime = 60;
    state.values.result = 0;
    state.values.lives = 3;

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.menuLives.textContent = `x${state.values.lives}`;

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function initialize() {
    addListenerHitBox();

    state.view.startButton.addEventListener("click", startGame);
    state.view.menuLives.textContent = `x${state.values.lives}`
}

initialize();