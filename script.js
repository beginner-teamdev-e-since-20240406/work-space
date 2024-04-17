let symbolArray = ["⚪︎", "×"]
let count = 1;
let gameActive = true;
let confettiInterval; // 紙吹雪のアニメーションのインターバルを保持する変数を追加

// 現在のプレイヤーを更新する関数
function updateStatus() {
    const currentPlayer = count % 2 === 0 ? symbolArray[1] : symbolArray[0];
    document.getElementById("status").textContent = `現在のプレイヤー: ${currentPlayer}`;
}

// ゲームの勝者をチェックする関数
function checkForWinner() {
    // 勝利条件の配列
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横のライン
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦のライン
        [0, 4, 8], [2, 4, 6]            // 斜めのライン
    ];
    let board = [];
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        board.push(cell.innerHTML);
    });
    for (let line of lines) {
        if (board[line[0]] !== "　" && board[line[0]] === board[line[1]] && board[line[1]] === board[line[2]]) {
            drawLine(line);
            showWinner(board[line[0]]);
            gameActive = false;
            return;
        }
    }
    if (board.every(cell => cell !== "　")) {
        showWinner(null);
        gameActive = false;
    }
}

// 勝利ラインを描画する関数
function drawLine(line) {
    const cells = document.querySelectorAll("td");
    line.forEach(index => {
        cells[index].style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        cells[index].style.animation = "blink 0.5s linear infinite";
    });
}

const confettiSettings = {
    origin: { y: 0.7 },
    spread: 90,
    particleCount: 100,
    zIndex: 1000
};

const confettiDuration = 3000; // 3秒間
const confettiDelay = 1500; // 1.5秒後に再度発火

function confettiAnime() {
    confetti(confettiSettings);
    confettiInterval = setTimeout(confettiAnime, confettiDuration + confettiDelay); // インターバルを保持
}

function stopConfettiAnime() {
    clearTimeout(confettiInterval); // インターバルをクリアして紙吹雪を止める
    confetti.reset(); // 紙吹雪のアニメーションを即座に停止
}

// 勝者を表示する関数
function showWinner(winner) {
    setTimeout(() => {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";
        overlay.style.color = "#fff";
        overlay.style.textAlign = "center";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.5s";

        const message = document.createElement("div");
        message.style.fontSize = "48px";
        message.style.marginBottom = "20px";
        message.style.transform = "scale(0)";
        message.style.transition = "transform 0.5s";

        if (winner) {
            message.textContent = `${winner} の勝利！`;
            confettiAnime(); // 勝利エフェクトを発火
        } else {
            message.textContent = "引き分け！";
        }

        const playAgain = document.createElement("div");
        playAgain.textContent = "もう一度プレイ";
        playAgain.style.fontSize = "24px";
        playAgain.style.backgroundColor = "#ff9800";
        playAgain.style.color = "#fff";
        playAgain.style.padding = "10px 20px";
        playAgain.style.borderRadius = "5px";
        playAgain.style.cursor = "pointer";
        playAgain.style.transition = "background-color 0.3s";

        playAgain.addEventListener("mouseover", () => {
            playAgain.style.backgroundColor = "#f57c00";
        });

        playAgain.addEventListener("mouseout", () => {
            playAgain.style.backgroundColor = "#ff9800";
        });

        playAgain.addEventListener("click", () => {
            overlay.style.opacity = "0";
            message.style.transform = "scale(0)";
            stopConfettiAnime(); // 紙吹雪のアニメーションを即座に止める
            setTimeout(() => {
                overlay.remove();
                showTitleScreen();
            }, 500);
        });

        overlay.appendChild(message);
        overlay.appendChild(playAgain);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = "1";
            setTimeout(() => {
                message.style.transform = "scale(1)";
            }, 500);
        }, 50);
    }, 1000);
}

// タイトル画面を表示する関数
function showTitleScreen() {
    document.getElementById("titleScreen").style.display = "block";
    document.getElementById("gameScreen").style.display = "none";
}

// ゲーム画面を表示する関数
function showGameScreen() {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    startGame();
}

// セルにマークを配置する関数
function putCircleOrCross(event) {
    if (!gameActive) return;

    const clickedCell = event.target;
    if (clickedCell.innerHTML === "　") {
        clickedCell.innerHTML = count % 2 == 0 ? symbolArray[1] : symbolArray[0];
        count++;
        checkForWinner();
        updateStatus();
    }
}

// ゲームを開始する関数
function startGame() {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.innerHTML = "　";
        cell.style.backgroundColor = "";
        cell.style.animation = "none";
    });
    count = 1;
    gameActive = true;
    updateStatus();
}

// DOMが読み込まれた後の処理
document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.addEventListener("click", putCircleOrCross);
    });
    document.getElementById("startButton").addEventListener("click", showGameScreen);
    showTitleScreen();
});