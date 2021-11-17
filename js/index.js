var repeat
var cachedPositions = []

function getNeighbours(cellPosInRow, cellRow) {
    let leftNeighbour = document.getElementById("cell-" + (cellPosInRow - 1) + "-row-" + cellRow)
    let topLeftNeighbour = document.getElementById("cell-" + (cellPosInRow - 1) + "-row-" + (cellRow - 1))
    let topNeighbour = document.getElementById("cell-" + cellPosInRow + "-row-" + (cellRow - 1))
    let topRightNeighbour = document.getElementById("cell-" + (cellPosInRow + 1) + "-row-" + (cellRow - 1))
    let rightNeighbour = document.getElementById("cell-" + (cellPosInRow + 1) + "-row-" + cellRow)
    let bottomRightNeighbour = document.getElementById("cell-" + (cellPosInRow + 1) + "-row-" + (cellRow + 1))
    let bottomNeighbour = document.getElementById("cell-" + cellPosInRow + "-row-" + (cellRow + 1))
    let bottomLeftNeighbour = document.getElementById("cell-" + (cellPosInRow - 1) + "-row-" + (cellRow + 1))

    return [leftNeighbour, topLeftNeighbour, topNeighbour, topRightNeighbour, rightNeighbour, bottomRightNeighbour, bottomNeighbour, bottomLeftNeighbour]
}

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
            cellObj.className = "cell dead";
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
        cell.className = "cell alive"
    } else {
        cell.setAttribute("value", "dead")
        cell.className = "cell dead"
    }
}

function Clear() {
    let cells = Array.prototype.slice.call(document.getElementsByClassName("cell"))

    cells.forEach(cell => {
        cell.setAttribute("value", "dead")
        cell.className = "cell dead"
    })

    clearInterval(repeat)
}

function loadCachedPositions(cachedPositions) {
    Clear()
    cachedPositions.forEach(cell => {
        let cellPos = document.getElementById(cell.id)

        cellPos.setAttribute("value", "alive")
        cellPos.className = "cell alive"
    })
}

function Pause() {
    clearInterval(repeat)
}

function Start() {
    cachedPositions = []
    let cells = Array.prototype.slice.call(document.getElementsByClassName("cell"))

    cells.forEach(cell => {
        if (cell.getAttribute("value") == "alive") {
            cachedPositions.push(cell)
        }
    })

    repeat = setInterval(checkCell, 100)
}

function checkCell() {
    let rowCount = document.getElementsByClassName("row").length;
    let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount

    let updateArr = []
    let cellsToCheck = []

    for (let i=0; i<rowCount; i++) {
        for (let j=0; j<cellsPerRow; j++) {
            let cell = document.getElementById("cell-"+j+"-row-"+i)

            if (cell.getAttribute("value") == "alive") {
                cellsToCheck.push(cell)

                let neighbourArr = getNeighbours(j, i)

                neighbourArr.forEach(neighbour => {
                    if (!neighbour) return
                    cellsToCheck.push(neighbour)
                })
            }
        }
    }

    cellsToCheck.forEach(cell => {
        let totalAliveNeighbours = 0

        let cellIdSplit = cell.id.toString().split("-")
        let cellPosInRow = parseInt(cellIdSplit[1])
        let cellRow = parseInt(cellIdSplit[3])
        
        let neighbourArr = getNeighbours(cellPosInRow, cellRow)

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
    })

    updateCells(updateArr)
}

function updateCells(updateArr) {
    updateArr.forEach(cellUpdate => {
        let cell = document.getElementById(cellUpdate[0])

        if (cellUpdate[1] == "alive") {
            cell.setAttribute("value", "alive")
            cell.className = "cell alive"
        } else {
            cell.setAttribute("value", "dead")
            cell.className = "cell dead"
        }
    })
}

createGrid()
