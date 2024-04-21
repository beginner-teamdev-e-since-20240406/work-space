let symbolArray = ["⚪︎", "×"];
let count = 0;
let gameActive = true;

let playerSymbol;
let cpuSymbol;
let isPlayerTurn;
let isCPUStrong;
let confettiInterval; // 紙吹雪のアニメーションのインターバルを保持する変数を追加

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

// スタートボタンのイベントリスナー
document.getElementById("startPlayerStrong").addEventListener("click", () => {
    isPlayerTurn = true;
    playerSymbol = "⚪︎";
    cpuSymbol = "×";
    isCPUStrong = true;
    showGameScreen();
});

document.getElementById("startCPUStrong").addEventListener("click", () => {
    isPlayerTurn = false;
    playerSymbol = "×";
    cpuSymbol = "⚪︎";
    showGameScreen();
    isCPUStrong = true;
    cpuTurn(); // CPUが先攻の場合はCPUから開始
});

document.getElementById("startPlayerWeak").addEventListener("click", () => {
    isPlayerTurn = true;
    playerSymbol = "⚪︎";
    cpuSymbol = "×";
    isCPUStrong = false;
    showGameScreen();
});

document.getElementById("startCPUWeak").addEventListener("click", () => {
    isPlayerTurn = false;
    playerSymbol = "×";
    cpuSymbol = "⚪︎";
    isCPUStrong = false;
    showGameScreen();
    cpuTurn(); // CPUが先攻の場合はCPUから開始
});

// 現在のプレイヤーを更新する関数
function updateStatus() {
    const currentPlayer = isPlayerTurn ? playerSymbol : cpuSymbol;
    document.getElementById("status").textContent = `現在のプレイヤー: ${currentPlayer}`;
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
    isPlayerTurn = true;  // プレイヤーから開始
    updateStatus();
    if (!isPlayerTurn) {
        setTimeout(cpuTurn, 500); // もしCPUが先攻なら、最初にCPUのターンを実行
    }
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

// セルにマークを配置する関数
function putCircleOrCross(event) {
    if (!gameActive || !isPlayerTurn) return;

    const clickedCell = event.target;
    if (clickedCell.innerHTML === "　") {
        clickedCell.innerHTML = playerSymbol;
        isPlayerTurn = false;  // プレイヤーのターンを終了し、CPUのターンへ
        updateStatus();
        
        if (checkForWinner()) return;  // 勝者が決まったかチェック
        count++;
        
        setTimeout(() => {
            cpuTurn(isCPUStrong);  // CPUのターンを遅延実行
        }, 500);
    }
}

function cpuTurn(isCPUStrong) {
    if (!gameActive) return;

    let bestMove;
    if (isCPUStrong) {
        bestMove = findBestMove();  // 強いCPUの場合、最適な手を計算
    } else {
        const emptyCells = Array.from(document.querySelectorAll("td")).filter(cell => cell.innerHTML === "　");
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)].id - 1;
    }

    document.querySelectorAll("td")[bestMove].innerHTML = cpuSymbol;
    isPlayerTurn = true;  // CPUのターンを終了し、プレイヤーのターンへ

    if (checkForWinner()) return;  // 勝者が決まったかチェック
    count++;
    updateStatus();
}

// ミニマックス法に基づいて最適な手を見つける関数
function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;
    const board = Array.from(document.querySelectorAll("td")).map(cell => cell.innerHTML);

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "　") {
            board[i] = cpuSymbol;
            let moveVal = minimax(board, 0, false);
            board[i] = "　";
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

// ミニマックス法を実装する関数
function minimax(board, depth, isMaximizing) {
    let score = evaluate(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "　") {
                board[i] = cpuSymbol;
                best = Math.max(best, minimax(board, depth + 1, !isMaximizing));
                board[i] = "　";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "　") {
                board[i] = playerSymbol;
                best = Math.min(best, minimax(board, depth + 1, !isMaximizing));
                board[i] = "　";
            }
        }
        return best;
    }
}

function evaluate(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // 横
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // 縦
        [0, 4, 8], [2, 4, 6]             // 斜め
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] !== "　" && board[a] === board[b] && board[b] === board[c]) {
            if (board[a] === cpuSymbol) {
                return 10;   // CPUが勝利
            } else if (board[a] === playerSymbol) {
                return -10;  // プレイヤーが勝利
            }
        }
    }
    return 0;  // 引き分けまたはゲーム続行
}

function isMovesLeft(board) {
    return board.some(cell => cell === "　");  // 空のセルが存在するか
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
    // 一定時間遅延後に実行
    setTimeout(() => {
        // 画面全体を覆うオーバーレイを作成
        const overlay = document.createElement("div");
        overlay.style = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            z-index: 1000; color: #fff; text-align: center;
            opacity: 0; transition: opacity 0.5s;
            z-index: 2;
        `;

        // メッセージコンテナを作成
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        // メッセージ要素を作成し、スタイリング設定
        const message = document.createElement("div");
        message.style = `
            font-size: 48px; margin-bottom: 20px;
            transform: scale(0); transition: transform 0.5s;
        `;

        // 勝者に応じてメッセージ内容を設定
        if (winner) {
            message.textContent = isPlayerTurn ? "残念！負けてしまいました！" : "おめでとう！あなたの勝ちです！";
            if (!isPlayerTurn) {
                confettiAnime();  // プレイヤーが勝った場合、紙吹雪アニメーションを発火
            }
        } else {
            message.textContent = "引き分けです！再挑戦を待ってます！";
        }

        // もう一度プレイするためのボタンを作成
        const playAgain = document.createElement("button");
        playAgain.textContent = "もう一度プレイ";
        playAgain.style = `
            display: block;
            font-size: 24px;
            background-color: #ff9800;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            border: none;
            transition: background-color 0.3s;
            z-index: 2;
        `;
        playAgain.addEventListener("mouseover", () => playAgain.style.backgroundColor = "#f57c00");
        playAgain.addEventListener("mouseout", () => playAgain.style.backgroundColor = "#ff9800");
        playAgain.addEventListener("click", () => {
            overlay.style.opacity = "0";
            message.style.transform = "scale(0)";
            stopConfettiAnime();  // 紙吹雪アニメーションを停止
            setTimeout(() => {
                overlay.remove();
                showTitleScreen();  // タイトル画面に戻る
            }, 500);
        });

        // メッセージコンテナにメッセージとボタンを追加
        messageContainer.appendChild(message);
        messageContainer.appendChild(playAgain);

        // オーバーレイにメッセージコンテナを追加
        overlay.appendChild(messageContainer);
        document.body.appendChild(overlay);

        // オーバーレイをフェードインし、メッセージを拡大
        setTimeout(() => {
            overlay.style.opacity = "1";
            setTimeout(() => message.style.transform = "scale(1)", 500);
        }, 50);
    }, 1000); // アニメーションやゲームロジックが落ち着くのを待つための遅延
}

// OX背景アニメーションの生成
function createBackgroundAnimation() {
    const backgroundAnimation = document.getElementById('background-animation');
    const symbols = ['<i class="fa-regular fa-circle"></i>', '<i class="fa-solid fa-xmark"></i>'];
    const rows = 20;
    const cols = 50;

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'backscreen-row';
        
        const unit = document.createElement('div');
        unit.className = 'backscreen-unit';

        for (let j = 0; j < cols; j++) {
            unit.innerHTML += symbols[j % 2];
        }

        row.appendChild(unit);
        backgroundAnimation.appendChild(row);
    }
}

window.onload = function() {
    var elements = document.getElementsByClassName('backscreen-row');
    for (var i = 0; i < elements.length; i++) {
        console.log('Element ' + i + ' width: ' + elements[i].offsetWidth + 'px');
    }
};

// DOMが読み込まれた後の処理
document.addEventListener("DOMContentLoaded", () => {
    // 他の処理...

    createBackgroundAnimation(); // 背景アニメーションの生成を呼び出す
});