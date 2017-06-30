/*----- constants -----*/
var bombs = 5;
var mapSize = 7;

/*----- app's state (variables) -----*/
var bombMap = []
var bombLoc;

/*----- cached element references -----*/
var box = document.querySelector("table");

/*----- event listeners -----*/
box.addEventListener('click', clickHandle);

/*----- functions -----*/
initializeBoard();

function initializeBoard() {
    return bombMap = JSON.parse("[[2,-1,2,0,0,1,-1],[2,-1,2,0,0,2,2],[1,2,2,1,0,1,-1],[0,1,-1,1,0,1,1],[0,1,1,1,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]");
    // for (var i = 0; i < bombMap.length; i++) {
    //     for (var j = 0; j < bombMap[i].length; j++) {
    //         if (bombMap[i][j]) {
    //             //box.rows[i].cells[j].style.backgroundColor = "white";
    //             box.rows[i].cells[j].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
    //         }
    //     }
    // }

    bombMap = new Array(mapSize);
    for(var j = 0; j < mapSize; j++) {
        bombMap[j] = new Array(mapSize+1).join('0').split('').map(parseFloat);
    }

    bombLoc = new Array(bombs);

    for (var i = 0; i < bombs; i++) {
        bombLoc[i] = Math.floor(Math.random() * 25);
        if (bombLoc.indexOf(bombLoc[i]) !== i) {
            bombLoc.pop();
            i--;
        }
        else {
            var row = findRow(bombLoc[i]);
            var col = findCol(bombLoc[i]);
            bombMap[row][col] = -1;
            numberSurrBombs(row, col);
        }
    }
}

function render(evt) {
    var row = findRow(evt.target.id);
    var col = findCol(evt.target.id);
    if (bombMap[row][col] === -1) {
        evt.target.style.backgroundColor = "white";
        box.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
    }
    else if (bombMap[row][col] > 0) {
        evt.target.style.backgroundColor = "white";
        box.rows[row].cells[col].innerHTML = bombMap[row][col];
    }
    else {
        emptyCellPropagate(row, col);
    }
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
    if (bombMap[row][col] === 0) {
        console.log('square is empty')
        box.rows[row].cells[col].style.backgroundColor = "white";
    }

    emptyCellPropagate(row + 1, col);
    emptyCellPropagate(row, col + 1);
    emptyCellPropagate(row - 1, col);
    emptyCellPropagate(row, col - 1);
}

// function emptyCellStar(row, col) {
//         emptyCellPropagate(row, col, 1, 0);
//         emptyCellPropagate(row, col, -1, 0);
//         emptyCellPropagate(row, col, 0, 1);
//         emptyCellPropagate(row, col, 0, -1);
//         emptyCellPropagate(row, col, 1, 1);
//         emptyCellPropagate(row, col, -1, -1);
//         emptyCellPropagate(row, col, 1, -1);
//         emptyCellPropagate(row, col, -1, 1);
// }

// function openArea(row, col) {
//         moveEmptyStar(row, col, 1, 0);
//         moveEmptyStar(row, col, 0, 1);
//         moveEmptyStar(row, col, -1, 0);
//         moveEmptyStar(row, col, 0, -1);
//         moveEmptyStar(row, col, 1, 1);
//         moveEmptyStar(row, col, -1, -1);
//         moveEmptyStar(row, col, 1, -1);
//         moveEmptyStar(row, col, -1, 1);
// }

// function moveEmptyStar (row, col, rowDir, colDir) {
//     var incRow = rowDir;
//     var incCol = colDir;
//     while ((row + rowDir) >= 0 && (row + rowDir) < mapSize && (col + colDir) >= 0 && (col + colDir) < mapSize && bombMap[row + rowDir][col + colDir] === 0) {
//         emptyCellStar(row + rowDir, col + colDir);
//         rowDir += incRow;
//         colDir += incCol;
//     }
// }


function clickHandle(evt) {
    if (evt.target.style.backgroundColor === "white") {
        return;
    }
    // var row = document.querySelector('table');
    // var bomb = document.createElement('img');
    // bomb.setAttribute('src', '../images/Poop_Emoji.png');
    // row.appendChild(bomb);
    render(evt);
}