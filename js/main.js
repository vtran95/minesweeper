/*----- constants -----*/
var bombs = 5;
var mapSize = 5;

/*----- app's state (variables) -----*/
// var bombMap = [[0,1,0,0,0],
//               [1,0,0,0,0],
//               [0,0,0,1,0],
//               [0,0,1,0,1],
//               [0,0,0,0,0]];

var bombMap;

var bombLoc;

/*
[0,1] = 1,
[1,0] = 5,
[2,3] = 13,
[3,2] = 17,
[3,4] = 19
*/

/*----- cached element references -----*/
var box = document.querySelector("table");
/*----- event listeners -----*/
box.addEventListener('click', clickHandle);
/*----- functions -----*/
initializeBoard();

function initializeBoard() {
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

function findRow(id) {
    var rowIndex = Math.floor(id / 5);
    return rowIndex;
}

function findCol(id) {
    var colIndex = id % 5;
    return colIndex;
}

function numberSurrBombs(row, col) {
    // for(var i = 0; i < mapSize; i++) {
    //     for (var j = 0; j < mapSize; j++) {
    //         if(bombMap[i][j] !== -1) {
                
    //         }
    //     }
    // }
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

function clickHandle(evt) {
    // var row = document.querySelector('table');
    // var bomb = document.createElement('img');
    // bomb.setAttribute('src', '../images/Poop_Emoji.png');
    // row.appendChild(bomb);
    evt.target.style.backgroundColor = "white";
    var row = findRow(evt.target.id);
    var col = findCol(evt.target.id);
    if (bombMap[row][col] === -1) {
         box.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
    }
    else if (bombMap[row][col] > 0) {
        box.rows[row].cells[col].innerHTML = bombMap[row][col];
    }
}

