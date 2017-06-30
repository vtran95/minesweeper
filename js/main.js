/*----- constants -----*/
var bombs = 5;
var mapSize = 7;
var totalCells = 49;

/*----- app's state (variables) -----*/
// var bombMap = []
// bombMap = JSON.parse("[[2,-1,2,0,0,1,-1],[2,-1,2,0,0,2,2],[1,2,2,1,0,1,-1],[0,1,-1,1,0,1,1],[0,1,1,1,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]");
var bombLoc;
var safeLoc = [];
var stopGame;

/*----- cached element references -----*/
var box = document.querySelector("table");
var message = document.querySelector("h2");
var resetButton = document.querySelector("button");

/*----- event listeners -----*/
box.addEventListener('click', clickHandle);
box.addEventListener('contextmenu', toggleFlag);
resetButton.addEventListener('click', reset);

/*----- functions -----*/
initializeBoard();

function initializeBoard() {
    //  return bombMap = JSON.parse("[[2,-1,2,0,0,1,-1],[2,-1,2,0,0,2,2],[1,2,2,1,0,1,-1],[0,1,-1,1,0,1,1],[0,1,1,1,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]");
    bombMap = JSON.parse("[[2,-1,2,0,0,1,-1],[2,-1,2,0,0,2,2],[1,2,2,1,0,1,-1],[0,1,-1,1,0,1,1],[0,1,1,1,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]");
    console.log(JSON.stringify(bombMap));

    bombLoc = [1, 6, 8, 20, 23];
    
    console.log("bomb location: " + bombLoc);

    for (var i = 0; i < totalCells; i++) {
        safeLoc[i] = i;
    }

    console.log("total cells: " + safeLoc);

    for (var j = 0; j < bombLoc.length; j++) {
        safeLoc.splice(bombLoc[j]-j,1);
    }

    console.log("safe locations: "+ safeLoc);

    // bombMap = new Array(mapSize);
    // for(var j = 0; j < mapSize; j++) {
    //     bombMap[j] = new Array(mapSize+1).join('0').split('').map(parseFloat);
    // }

    // bombLoc = new Array(bombs);

    // for (var i = 0; i < bombs; i++) {
    //     bombLoc[i] = Math.floor(Math.random() * 25);
    //     if (bombLoc.indexOf(bombLoc[i]) !== i) {
    //         bombLoc.pop();
    //         i--;
    //     }
    //     else {
    //         var row = findRow(bombLoc[i]);
    //         var col = findCol(bombLoc[i]);
    //         bombMap[row][col] = -1;
    //         numberSurrBombs(row, col);
    //     }
    // }
}

function render(evt) {
    var row = findRow(evt.target.id);
    var col = findCol(evt.target.id);
    if (bombMap[row][col] === -1) {
        evt.target.style.backgroundColor = "white";
        box.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
        gameOver("lose");
    }
    else if (bombMap[row][col] > 0) {
        evt.target.style.backgroundColor = "white";
        box.rows[row].cells[col].innerHTML = bombMap[row][col];
    }
    else {
        emptyCellPropagate(row, col);
    }
    checkWin();
}

function checkWin() {
    for (var i = 0; i < safeLoc.length; i++) {
        var row = findRow(safeLoc[i]);
        var col = findCol(safeLoc[i]);
        if (box.rows[row].cells[col].style.backgroundColor === "" || box.rows[row].cells[col].style.backgroundColor === "rgb(63, 227, 192)") {
            break;
        }
        else if (i === safeLoc.length - 1 && box.rows[row].cells[col].style.backgroundColor === "white") {
            gameOver("win");
        }
    }
}

function gameOver(result) {
    if (result === "lose") {
        message.innerHTML = "YOU LOSE";
    }
    else if (result === "win") {
        message.innerHTML = "YOU WIN";
    }
    for ( var i = 0; i < bombLoc.length; i++) {
        var row = findRow(bombLoc[i]);
        var col = findCol(bombLoc[i]);
        box.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
        box.rows[row].cells[col].style.backgroundColor = "white";
        stopGame = 1;
    }
}

function reset() {
    for (var i = 0; i < totalCells; i++) {
        row = findRow(i);
        col = findCol(i);
        box.rows[row].cells[col].style.backgroundColor = "rgb(63, 227, 192)";
        box.rows[row].cells[col].innerHTML = "";
        bombMap[row][col] = 0;
    }
    message.innerHTML = "";
    stopGame = 0;
    initializeBoard();
}

function findRow(id) {
    var rowIndex = Math.floor(id / mapSize);
    return rowIndex;
}

function findCol(id) {
    var colIndex = id % mapSize;
    return colIndex;
}

function numberSurrBombs(row, col) {
    if (row < mapSize - 1) {
        if (bombMap[row+1][col] >= 0) {
            bombMap[row+1][col]++;
        }
    }
    if (row > 0) {
        if (bombMap[row-1][col] >= 0) {
            bombMap[row-1][col]++;
        }   
    }
    if (col < mapSize - 1) {
        if (bombMap[row][col+1] >= 0) {
            bombMap[row][col+1]++;
        }
    }
    if (col > 0) {
        if(bombMap[row][col-1] >= 0) {
            bombMap[row][col-1]++;
        }
    }
    if (row < mapSize -1 && col < mapSize - 1) {
        if (bombMap[row+1][col+1] >= 0) {
            bombMap[row+1][col+1]++;
        }
    }
    if (row > 0 && col > 0) {
        if (bombMap[row-1][col-1] >= 0) {
            bombMap[row-1][col-1]++;
        }
    }
    if (row < mapSize - 1 && col > 0) {
        if (bombMap[row+1][col-1] >= 0) {
            bombMap[row+1][col-1]++;
        }
    }
    if (row > 0 && col < mapSize - 1) {
        if (bombMap[row-1][col+1] >= 0) {
            bombMap[row-1][col+1]++;
        }
    }
}

function emptyCellPropagate(row, col) {
    console.log('row =',row, 'col =', col)
    if (row > mapSize - 1 || row < 0 || col > mapSize - 1 || col < 0 || bombMap[row][col] < 0 || box.rows[row].cells[col].style.backgroundColor === "white") {
        console.log('row/col is out of bounds')
        return;
    }
    if (bombMap[row][col] > 0) {
        console.log('is number')
        box.rows[row].cells[col].innerHTML = bombMap[row][col];
        box.rows[row].cells[col].style.backgroundColor = "white";
        return;
    }
    else if (bombMap[row][col] === 0) {
        console.log('square is empty')
        box.rows[row].cells[col].style.backgroundColor = "white";
    }

    emptyCellPropagate(row + 1, col);
    emptyCellPropagate(row, col + 1);
    emptyCellPropagate(row - 1, col);
    emptyCellPropagate(row, col - 1);
}

function clickHandle(evt) {
    console.log(evt);
    console.log(evt.target.localName);
    if (stopGame || evt.target.localName !== "td" || evt.target.style.backgroundColor === "white") {
        return;
    }
    // var row = document.querySelector('table');
    // var bomb = document.createElement('img');
    // bomb.setAttribute('src', '../images/Poop_Emoji.png');
    // row.appendChild(bomb);
    render(evt);
}

function toggleFlag(evt) {
    console.log(evt);
    console.log(evt.target.localName);
    if (stopGame || evt.target.localName === "table" || evt.target.style.backgroundColor === "white") {
        return;
    }
    if (evt.target.localName !== "img") {
        if (evt.target.style.backgroundColor === "" || evt.target.style.backgroundColor === "rgb(63, 227, 192)") {
            if (evt.target.innerHTML === "") {
                evt.target.innerHTML = "<img src = 'images/broom.png' height='20px' width='20px'>";
            }
            else {
                evt.target.innerHTML = "";
            }
        }
    }
    else {
        console.log("is img");
        if (evt.target.parentElement.innerHTML !== "") {
            evt.target.parentElement.innerHTML = "";
        }
    }
}