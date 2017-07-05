/*----- constants -----*/
$(function(){



var bombs = 8;
var mapSize = 8;
var totalCells = Math.pow(mapSize, 2);
var counter = 0;

/*----- app's state (variables) -----*/
var bombMap;
var bombLoc;
var safeLoc;
var stopGame;
var seconds;

/*----- cached element references -----*/
var board = document.querySelector('table');
var $message = $('#message');
var $resetButton = $('button');
var $timer = $('#timer');
var $cells = $('td');

/*----- event listeners -----*/
board.addEventListener('click', clickHandle);
board.addEventListener('contextmenu', toggleFlag);
$resetButton.on('click', reset);

/*----- functions -----*/

// Initializes state of game ie. bombLoc, bombMap, and safeLoc
function initializeBoard() {
    
    // bombMap = [[0,0,1,-1,2,2,1,1],[0,0,1,2,-1,2,-1,1],[0,0,0,1,1,2,1,1],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,0],[0,0,0,1,2,-1,1,0],[0,0,0,1,-1,3,2,0],[0,0,0,1,2,-1,1,0]];

    // bombLoc = [3,12,14,45,52,61];

    // safeLoc = [0,1,2,4,5,6,7,8,9,10,11,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,46,47,48,49,50,51,53,54,55,56,57,58,59,60,62,63];

    // console.log("bomb location: " + bombLoc);
    // console.log("map: " + bombMap);
    // console.log("safe locations: "+ safeLoc);

    bombMap = new Array(mapSize);
    for(var j = 0; j < mapSize; j++) {
        bombMap[j] = new Array(mapSize+1).join('0').split('').map(parseFloat);
    }

    bombLoc = new Array(bombs);

    for (var i = 0; i < bombs; i++) {
        bombLoc[i] = Math.floor(Math.random() * totalCells);
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

    bombLoc.sort(function(a, b) {
        return a - b;
    })

    console.log('bomb location: ' + bombLoc);
    console.log('map: ' + bombMap);

    safeLoc = new Array(totalCells);

    for (var i = 0; i < totalCells; i++) {
        safeLoc[i] = i;
    }

    for (var j = 0; j < bombLoc.length; j++) {
        safeLoc.splice((bombLoc[j]-j),1);
    }

    console.log('safe locations: '+ safeLoc);

    countTimer();
}

// Renders value of cell clicked based on bombMap
function render(evt) {
    var row = findRow(evt.target.id);
    var col = findCol(evt.target.id);
    if (bombMap[row][col] === -1) {
        evt.target.style.backgroundColor = 'white';
        board.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
        gameOver("lose");
    }
    else if (bombMap[row][col] > 0) {
        evt.target.style.backgroundColor = 'white';
        board.rows[row].cells[col].innerHTML = bombMap[row][col];
    }
    else {
        emptyCellPropagate(row, col);
    }
    checkWin();
}

// Checks whether win conditions have been satisfied
function checkWin() {
    for (var i = 0; i < safeLoc.length; i++) {
        var row = findRow(safeLoc[i]);
        var col = findCol(safeLoc[i]);
        if (board.rows[row].cells[col].style.backgroundColor !== 'white' && board.rows[row].cells[col].innerHTML !== "<img src = 'images/broom.png' height='20px' width='20px'>") {
            break;
        }
        else if (i === safeLoc.length - 1 && board.rows[row].cells[col].style.backgroundColor === 'white') {
            gameOver('win');
        }
    }
}

// Displays win/lose message, and location of bombs
// also stops user from being able to click on game board
function gameOver(result) {
    if (result === 'lose') {
        $message.html('poop...');
        $message.css('right', '47.2%');
    }
    else if (result === 'win') {
        $message.html('Clean sweep!');
        $message.css('right', '45%');
    }
    for ( var i = 0; i < bombLoc.length; i++) {
        var row = findRow(bombLoc[i]);
        var col = findCol(bombLoc[i]);
        board.rows[row].cells[col].innerHTML = "<img src='images/Poop_Emoji.png' height='20px' width='20px'>";
        board.rows[row].cells[col].style.backgroundColor = 'white';
    }
    clearTimeout(seconds);
    stopGame = 1;
}

// Resets game to initial state with new game
// once reset button has been clicked
function reset() {
    $resetButton.html('Reset');
    $cells.css('cursor', 'pointer');
    for (var i = 0; i < totalCells; i++) {
        row = findRow(i);
        col = findCol(i);
        board.rows[row].cells[col].style.backgroundColor = 'rgb(63, 227, 192)';
        board.rows[row].cells[col].innerHTML = '';
    }
    $message.html('');
    counter = 0;
    clearTimeout(seconds);
    stopGame = 0;
    initializeBoard();
}

// Finds row of board id
function findRow(id) {
    var rowIndex = Math.floor(id / mapSize);
    return rowIndex;
}

// Finds column of board id
function findCol(id) {
    var colIndex = id % mapSize;
    return colIndex;
}

// Determines "number" values of cells by incrementing
// the cells surrounding every bomb by 1
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

// Recursive function that is called when an empty cell ('0') is clicked,
// reveals that cell, and also propagates to reveal other surrounding empty cells
// until either a number is reached, the border of the board is reached, or if a
// flagged cell is reached
function emptyCellPropagate(row, col) {
    if (row > mapSize - 1 || row < 0 || col > mapSize - 1 || col < 0 || bombMap[row][col] < 0 || board.rows[row].cells[col].style.backgroundColor === 'white' || board.rows[row].cells[col].innerHTML !== '') {
        return;
    }
    if (bombMap[row][col] > 0) {
        board.rows[row].cells[col].innerHTML = bombMap[row][col];
        board.rows[row].cells[col].style.backgroundColor = 'white';
        return;
    }
    else if (bombMap[row][col] === 0) {
        board.rows[row].cells[col].style.backgroundColor = 'white';
    }

    emptyCellPropagate(row + 1, col);
    emptyCellPropagate(row, col + 1);
    emptyCellPropagate(row - 1, col);
    emptyCellPropagate(row, col - 1);
    emptyCellPropagate(row + 1, col + 1);
    emptyCellPropagate(row - 1, col + 1);
    emptyCellPropagate(row + 1, col - 1);
    emptyCellPropagate(row - 1, col - 1);
}

// Click function that only executes
// if the game hasn't ended, the clicked object is a table cell 'td',
// and the clicked cell hasn't been clicked before
function clickHandle(evt) {
    if (stopGame || evt.target.localName !== 'td' || evt.target.style.backgroundColor === 'white' || counter === 0) {
        return;
    }
    render(evt);
}

// Right-click function that only executes if the game hasn't ended,
// the click target is a table cell 'td', and the cell has not been "opened".
// Will either place a flag, or remove a flag
function toggleFlag(evt) {
    if (stopGame || evt.target.localName === 'table' || evt.target.style.backgroundColor === 'white' || counter === 0) {
        return;
    }
    if (evt.target.localName !== 'img') {
        if (evt.target.style.backgroundColor === '' || evt.target.style.backgroundColor === 'rgb(63, 227, 192)') {
            if (evt.target.innerHTML === '') {
                evt.target.innerHTML = "<img src = 'images/broom.png' height='20px' width='20px'>";
            }
            else {
                evt.target.innerHTML = '';
            }
        }
    }
    else {
        if (evt.target.parentElement.innerHTML !== '') {
            evt.target.parentElement.innerHTML = '';
        }
    }
}

function countTimer() {
    $timer.html(counter);
    counter += 1;
    if (counter > 500 || stopGame) {
        clearTimeout(seconds);
        gameOver('lose');
    }
    else {
        seconds = setTimeout(function() {
            countTimer();
        }, 1000);
    }
}


});