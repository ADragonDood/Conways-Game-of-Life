var repeat
var cachedPositions = []
var clockSpeed;
var dragList = []
var grid = document.getElementById("grid")
var programStarted = false;
var preset;
var originCell;
var boundaryCells = []
var settingOrigin = false;
var settingBoundary = false;
var presetName;

let rngText = document.getElementById('rng-text')
let rngInput = document.getElementById('clock-speed-rng')
rngText.innerText = rngInput.value
clockSpeed = parseInt(rngInput.value)


rngInput.addEventListener("input", () => {
    rngText.innerText = rngInput.value

})

rngInput.addEventListener("change", () => {
    clockSpeed = parseInt(rngInput.value)
    clearInterval(repeat)
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

    let gridWidth = 100
    let gridHeight = 100

    for (let i = 0; i < (gridHeight)+1; i++) {
        let rowObj = document.createElement("div");
        rowObj.className = "row";
        rowObj.id = "row"+i;

        grid.appendChild(rowObj);

        let row = document.getElementById("row"+i);

        for (let j = 0; j < (gridWidth)+1; j++) {

            let cellObj = document.createElement("div");
            cellObj.className = "cell dead";
            cellObj.id = "cell-"+j+"-row-"+i;
            cellObj.setAttribute("value", "dead");
            cellObj.setAttribute("onclick", "setState(this); placePreset(this); setOriginCell(this); setBoundaryCell(this);");
            cellObj.setAttribute("ondragover", "addToDragList(this);")
            cellObj.setAttribute("ondragstart", "clearList();")
            cellObj.setAttribute("ondragend", "setDraggedCellsState();")
            cellObj.draggable = true

            row.appendChild(cellObj)
        }
    }
}

function showLineOfSymmetry() {
    let verticalSym = document.getElementById('vertical-sym').checked
    let horizontalSym = document.getElementById('horizontal-sym').checked
    let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount
    let rowCount = document.getElementsByClassName("row").length;

    let middleOfPage = Math.round(rowCount/2)-1
    let middleRow = document.getElementById('row' + middleOfPage)

    let middleCells = []

    if (verticalSym == true) {
        middleRow.childNodes.forEach(node => {
            node.style.backgroundColor = 'lightgray'
        })
    } else {
        middleRow.childNodes.forEach(node => {
            node.style.backgroundColor = ''
        })
    }

    if (horizontalSym == true) {
        for (let i = 0; i < rowCount; i++) {
            middleCells.push(document.getElementById('cell-'+ (Math.round(cellsPerRow/2)-1) + "-row-"+i))
        }
        middleCells.forEach(cell => {
            cell.style.backgroundColor = 'lightgray'
        })
    } else {
        for (let i = 0; i < rowCount; i++) {
            middleCells.push(document.getElementById('cell-'+ (Math.round(cellsPerRow/2)-1) + "-row-"+i))
        }
        middleCells.forEach(cell => {
            cell.style.backgroundColor = ''
        })
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
    let verticalSym = document.getElementById("vertical-sym").checked
    let horizontalSym = document.getElementById("horizontal-sym").checked
    let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount
    let rowCount = document.getElementsByClassName("row").length;
    let cellIdSplit = cell.id.split("-")

    if (!dragList.includes(cell)) {
        cell.style.backgroundColor = 'lightblue'
        dragList.push(cell)

        if (verticalSym == true) {
            let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+cellIdSplit[3])
            mirroredCell.style.backgroundColor = 'lightblue'
        }

        if (horizontalSym == true) {
            let mirroredCell = document.getElementById("cell-"+(parseInt(cellIdSplit[1]))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))
            mirroredCell.style.backgroundColor = 'lightblue'
        }

        if (horizontalSym == true && verticalSym == true) {
            let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))
            mirroredCell.style.backgroundColor = 'lightblue'
        }
    }
}

function placePreset(cell) {
    if (typeof preset == "undefined") return
    let cellIdSplit = cell.id.split("-")

    preset.forEach(pos => {
        let newCell = document.getElementById("cell-"+(parseInt(cellIdSplit[1])+pos[0])+"-row-"+(parseInt(cellIdSplit[3])+pos[1]))
        if (newCell == null) {
            return
        }
        setState(newCell)
    })

}

function setState(cell) {
    if (settingOrigin == true || settingBoundary == true) return
    let verticalSym = document.getElementById("vertical-sym").checked
    let horizontalSym = document.getElementById("horizontal-sym").checked
    let cellsPerRow = document.getElementsByClassName("row")[0].childElementCount
    let rowCount = document.getElementsByClassName("row").length;
    let cellIdSplit = cell.id.split("-")
    cell.style.backgroundColor = ''

    if (horizontalSym == true) {
        let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+cellIdSplit[3])
        mirroredCell.style.backgroundColor = ''

        let value = mirroredCell.getAttribute("value")
        if (value == "dead") {
            mirroredCell.setAttribute("value", "alive")
            mirroredCell.className = "cell alive"
        } else {
            mirroredCell.setAttribute("value", "dead")
            mirroredCell.className = "cell dead"
        }
    }

    if (verticalSym == true) {
        let mirroredCell = document.getElementById("cell-"+(parseInt(cellIdSplit[1]))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))
        mirroredCell.style.backgroundColor = ''

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
        let mirroredCell = document.getElementById("cell-" + (cellsPerRow-(parseInt(cellIdSplit[1])+1))+"-row-"+(rowCount-parseInt(cellIdSplit[3])-1))
        mirroredCell.style.backgroundColor = ''

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

    clearInterval(repeat)
    programStarted = false
}

function loadCachedPositions(cachedPositions) {
    Clear()
    cachedPositions.forEach(cell => {
        let cellPos = document.getElementById(cell.id)

        cellPos.setAttribute("value", "alive")
        cellPos.className = "cell alive"
    })
    programStarted = false
}

function Pause() {
    clearInterval(repeat)
    programStarted = false
}

function Start() {
    cachedPositions = []
    let cells = Array.prototype.slice.call(document.getElementsByClassName("cell"))

    cells.forEach(cell => {
        if (cell.getAttribute("value") == "alive") {
            cachedPositions.push(cell)
        }
    })

    repeat = setInterval(checkCell, clockSpeed)
    programStarted = true
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

function getPreset(presetElement) {
    if (typeof preset != "undefined") return preset = undefined
    let presetName = presetElement.getAttribute("value")
    preset = data[0][presetName]
}

function setOriginCell(cell) {
    if (settingOrigin == false) return
    originCell = cell
    originCell.style.backgroundColor = "pink"
    settingOrigin = false
    document.getElementById('setOrigin').style.display = 'none'
    document.getElementById('setBoundary').style.display = ''
}

function setBoundaryCell(cell) {
    if (settingBoundary == false) return
    if (boundaryCells.length < 2) {
        cell.style.backgroundColor = "lightblue"
        boundaryCells.push(cell)
    }
    if (boundaryCells.length == 2) {
        settingBoundary = false
        document.getElementById('setBoundary').style.display = 'none'
        finalisePreset()
    }
}

function finalisePreset() {
    let boundaryCell1 = boundaryCells[0]
    let boundaryCell2 = boundaryCells[1]

    let boundaryCell1Id = boundaryCell1.id.split("-")
    let boundaryCell2Id = boundaryCell2.id.split("-")

    let boundaryWidth;
    let boundaryHeight;

    if (parseInt(boundaryCell1Id[1]) > parseInt(boundaryCell2Id[1])) {
        boundaryWidth = parseInt(boundaryCell1Id[1]) - parseInt(boundaryCell2Id[1])
    } else if (parseInt(boundaryCell1Id[1]) < parseInt(boundaryCell2Id[1])){
        boundaryWidth = parseInt(boundaryCell2Id[1]) - parseInt(boundaryCell1Id[1])
    } else {
        boundaryWidth = 0
    }

    if (parseInt(boundaryCell1Id[3]) > parseInt(boundaryCell2Id[3])) {
        boundaryHeight = parseInt(boundaryCell1Id[3]) - parseInt(boundaryCell2Id[3])
    } else if (parseInt(boundaryCell1Id[3]) < parseInt(boundaryCell2Id[3])){
        boundaryHeight = parseInt(boundaryCell2Id[3]) - parseInt(boundaryCell1Id[3])
    } else {
        boundaryHeight = 0
    }

    let aliveCells = []

    for (let i=0; i < boundaryHeight+1; i++) {
        for(let j=0; j < boundaryWidth+1; j++) {
            let currentCell = document.getElementById("cell-" + (parseInt(boundaryCell1Id[1]) + j) + "-row-" + (parseInt(boundaryCell1Id[3]) + i))
            if (currentCell.getAttribute("value") == "alive") {
                aliveCells.push(currentCell)
            }
        }
    }

    let originDifs = []

    if (aliveCells.includes(originCell)) {
        aliveCells.splice(aliveCells.indexOf(originCell,1))
    } else {
        aliveCells.push(originCell)
    }

    aliveCells.forEach(cell => {
        let cellId = cell.id.split("-")
        let originCellId = originCell.id.split("-")

        let xDif = cellId[1] - originCellId[1]
        let yDif = cellId[3] - originCellId[3]

        originDifs.push([xDif, yDif])
    })

    let objString = {[presetName] : originDifs}

    Object.assign(data[0], objString)

    storePreset(objString)
    createPresetHTMLElement()

    boundaryCells.forEach(cell => {
        cell.style.backgroundColor = ''
    })
    boundaryCells = []

    originCell.style.backgroundColor = ''
    originCell = undefined

    document.getElementById('cancelPreset').style.display = 'none'

}

function getPresetsFromLocalStorage() {
    let keys = Object.keys(localStorage)

    keys.forEach(key => {
        let presetObj = JSON.parse(localStorage.getItem(key))

        presetName = key
        
        Object.assign(data[0], presetObj)

        createPresetHTMLElement()
    })

    presetName = undefined
}

function storePreset(presetObj) {
    localStorage.setItem(presetName, JSON.stringify(presetObj))
}

function createPresetHTMLElement() {
    let presetDiv = document.createElement('div');
    presetDiv.className = "preset";
    presetDiv.setAttribute("onclick", "getPreset(this);");
    presetDiv.setAttribute("value", presetName);

    document.getElementById('presets-list').appendChild(presetDiv)

    let presetHeader = document.createElement('div');
    presetHeader.className = "preset-header";
    presetHeader.innerHTML = '<h4>'+presetName+'</h4><img class="delete-icon" src="./imgs/delete-icon.png" onclick="deletePreset(this);">';

    presetDiv.appendChild(presetHeader)
}

function setPresetBoundary() {
    settingBoundary = true
}

function setPresetOrigin() {
    settingOrigin = true
}

function cancelPreset() {
    settingBoundary = false
    settingOrigin = false
    if (boundaryCells.length > 0) {
        boundaryCells.forEach(cell => {
            cell.style.backgroundColor = ''
        })
        boundaryCells = []
    }

    if (typeof originCell != "undefined") {
        originCell.style.backgroundColor = ''
        originCell = undefined
    }

    presetName = undefined
    document.getElementById('setOrigin').style.display = 'none'
    document.getElementById('setBoundary').style.display = 'none'
    document.getElementById('cancelPreset').style.display = 'none'
}

function createPreset() {
    presetName = prompt("Please enter the name of your preset")
    if (presetName == '') return presetName = undefined
    document.getElementById('setOrigin').style.display = ''
    document.getElementById('cancelPreset').style.display = ''
}

function deletePreset(delete_icon) {
    let presetDiv = delete_icon.parentElement.parentElement
    
    localStorage.removeItem(presetDiv.getAttribute("value"))
    presetDiv.remove()
}

createGrid()
getPresetsFromLocalStorage()