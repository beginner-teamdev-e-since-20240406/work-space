let symbolArray = ["⚪︎", "×"]
let count = 1;
let gameActive = true;

function updateStatus() {
    const currentPlayer = count % 2 === 0 ? symbolArray[1] : symbolArray[0];
    document.getElementById("status").textContent = `現在のプレイヤー: ${currentPlayer}`;
}

function checkForWinner() {
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
            document.getElementById("winner").textContent = `勝者: ${board[line[0]]}`;
            gameActive = false;
            return;
        }
    }
    if (board.every(cell => cell !== "　")) {
        document.getElementById("winner").textContent = "勝者: なし（引き分け）";
        gameActive = false;
    }
}

function putCircleOrCross(event) {
    const clickedCell = event.target;
    if (clickedCell.innerHTML === "　") {
        clickedCell.innerHTML = count % 2 == 0 ? symbolArray[1] : symbolArray[0];
        count++;
        checkForWinner();
        updateStatus();
    }
}

function startGame() {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.innerHTML = "　";
    });
    count = 1;
    gameActive = true;
    document.getElementById("winner").textContent = "勝者: なし";
    updateStatus();
}

function resetGame() {
    startGame();
}


document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.addEventListener("click", putCircleOrCross);
    });
    document.getElementById("resetButton").addEventListener("click", resetGame);
    startGame(); // ページがロードされると自動的にゲームを開始
});
