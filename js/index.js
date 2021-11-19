var repeat
var cachedPositions = []
var clockSpeed;
var dragList = []
var grid = document.getElementById("grid")
var programStarted = false;

let rngText = document.getElementById('rng-text')
let rngInput = document.getElementById('clock-speed-rng')
rngText.innerText = rngInput.value
clockSpeed = parseInt(rngInput.value)

rngInput.addEventListener("input", () => {
    rngText.innerText = rngInput.value
})

rngInput.addEventListener("change", () => {
    clockSpeed = parseInt(rngInput.value)
    if (programStarted == true) {
        clearInterval(repeat)
        repeat = setInterval(checkCell, clockSpeed)   
    }
})

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

    if (grid.innerHTML != "") {
        grid.innerHTML = ""
    }

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
            cellObj.setAttribute("ondragover", "addToDragList(this);")
            cellObj.setAttribute("ondragstart", "clearList();")
            cellObj.setAttribute("ondragend", "setDraggedCellsState();")
            cellObj.draggable = true

            row.appendChild(cellObj)
        }
    }
}

function setDraggedCellsState() {
    dragList.forEach(cell => {
        setState(cell)
    })
}

function clearList() {
    dragList = []
}

function addToDragList(cell) {
    if (!dragList.includes(cell)) {
        dragList.push(cell)
    }
}

function setState(cell) {

    let verticalSym = document.getElementById("vertical-sym").checked
    let horizontalSym = document.getElementById("horizontal-sym").checked

    if (verticalSym == true) {
        let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount
        let cellIdSplit = cell.id.split("-")
        let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+cellIdSplit[3])

        let value = mirroredCell.getAttribute("value")
        if (value == "dead") {
            mirroredCell.setAttribute("value", "alive")
            mirroredCell.className = "cell alive"
        } else {
            mirroredCell.setAttribute("value", "dead")
            mirroredCell.className = "cell dead"
        }
    }

    if (horizontalSym == true) {
        let rowCount = document.getElementsByClassName("row").length;
        let cellIdSplit = cell.id.split("-")
        let mirroredCell = document.getElementById("cell-"+(parseInt(cellIdSplit[1]))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))

        let value = mirroredCell.getAttribute("value")
        if (value == "dead") {
            mirroredCell.setAttribute("value", "alive")
            mirroredCell.className = "cell alive"
        } else {
            mirroredCell.setAttribute("value", "dead")
            mirroredCell.className = "cell dead"
        }

    }

    if (horizontalSym == true && verticalSym == true) {
        let rowCount = document.getElementsByClassName("row").length;
        let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount
        let cellIdSplit = cell.id.split("-")
        let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))

        let value = mirroredCell.getAttribute("value")
        if (value == "dead") {
            mirroredCell.setAttribute("value", "alive")
            mirroredCell.className = "cell alive"
        } else {
            mirroredCell.setAttribute("value", "dead")
            mirroredCell.className = "cell dead"
        }
    }

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

    programStarted = false

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
    programStarted = false
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

    programStarted = true
    repeat = setInterval(checkCell, clockSpeed)
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