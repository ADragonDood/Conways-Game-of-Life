var repeat

function createGrid() {
    let grid = document.getElementById("grid");

    for (let i = 0; i < (grid.clientHeight/10)-1; i++) {
        let rowObj = document.createElement("div");
        rowObj.className = "row";
        rowObj.id = "row"+i;

        grid.appendChild(rowObj);

        let row = document.getElementById("row"+i);

        for (let j = 0; j < (grid.clientWidth/10); j++) {

            let cellObj = document.createElement("div");
            cellObj.className = "cell";
            cellObj.id = "cell-"+j+"-row-"+i;
            cellObj.setAttribute("value", "dead");
            cellObj.setAttribute("onclick", "setState(this);");

            row.appendChild(cellObj)
        }
    }
}

function setState(cell) {
    let value = cell.getAttribute("value")
    if (value == "dead") {
        cell.setAttribute("value", "alive")
        cell.style.backgroundColor = "black"
    } else {
        cell.setAttribute("value", "dead")
        cell.style.backgroundColor = "white"
    }
}

function Pause() {
    clearInterval(repeat)
}

function Start() {
    repeat = setInterval(checkCell, 100)
}

function checkCell() {
    let rowCount = document.getElementsByClassName("row").length;
    let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount

    let updateArr = []

    for (let i=0; i<rowCount; i++) {
        for (let j=0; j<cellsPerRow; j++) {
            let cell = document.getElementById("cell-"+j+"-row-"+i)

            let totalAliveNeighbours = 0

            let leftNeighbour = document.getElementById("cell-"+(j-1)+"-row-"+i)
            let topLeftNeighbour = document.getElementById("cell-"+(j-1)+"-row-"+(i-1))
            let topNeighbour = document.getElementById("cell-"+j+"-row-"+(i-1))
            let topRightNeighbour = document.getElementById("cell-"+(j+1)+"-row-"+(i-1))
            let rightNeighbour = document.getElementById("cell-"+(j+1)+"-row-"+i)
            let bottomRightNeighbour = document.getElementById("cell-"+(j+1)+"-row-"+(i+1))
            let bottomNeighbour = document.getElementById("cell-"+j+"-row-"+(i+1))
            let bottomLeftNeighbour = document.getElementById("cell-"+(j-1)+"-row-"+(i+1))

            let neighbourArr = [leftNeighbour, topLeftNeighbour, topNeighbour, topRightNeighbour, rightNeighbour, bottomRightNeighbour, bottomNeighbour, bottomLeftNeighbour]

            neighbourArr.forEach(neighbour => {
                if (typeof neighbour == 'undefined' || !neighbour) {
                    return
                } else {
                    if (neighbour.getAttribute("value") == "alive") {
                        totalAliveNeighbours++
                    } else {
                        return
                    }
                }
            })

            if (totalAliveNeighbours < 2) {

                updateArr.push([`${cell.id}`, "dead"])

            } else if (totalAliveNeighbours > 3) {

                updateArr.push([`${cell.id}`, "dead"])

            } else if (totalAliveNeighbours == 3) {

                updateArr.push([`${cell.id}`, "alive"])

            }
        }
    }

    updateCells(updateArr)
}

function updateCells(updateArr) {
    updateArr.forEach(cellUpdate => {
        let cell = document.getElementById(cellUpdate[0])

        if (cellUpdate[1] == "alive") {
            cell.setAttribute("value", "alive")
            cell.style.backgroundColor = "black"
        } else {
            cell.setAttribute("value", "dead")
            cell.style.backgroundColor = "white"
        }
    })
}

createGrid()