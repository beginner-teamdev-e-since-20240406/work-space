let symbolArray = ["⚪︎", "×"]
let count = 1;

function putCircleOrCross(event) {
    const clickedCell = event.target;
    if (clickedCell.innerHTML === "　") {
        clickedCell.innerHTML = count % 2 == 0 ? symbolArray[1] : symbolArray[0];
        count++;
    }
}

const cells = document.querySelectorAll("td");
cells.forEach(cell => {
    cell.addEventListener("click", putCircleOrCross);
});