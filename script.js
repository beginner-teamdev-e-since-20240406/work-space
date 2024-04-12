function detectClick(event) {
    const clickedCell = event.target;
    console.log(clickedCell.id);
}

const cells = document.querySelectorAll("td");
cells.forEach(cell => {
    cell.addEventListener("click", detectClick);
});