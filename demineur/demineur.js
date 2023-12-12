let minesCount, minesLocation, tilesClicked, tilesCount, flagEnabled, gameOver, board, startTime, endTime;
let rows, cols;
var timer = null;
var timeEl = document.getElementById('timer');

document.getElementById("startButton").addEventListener("click", function() {
    if (gameOver == true) {
        gameOver = false;
        document.getElementById("perdu").innerHTML = "";
        document.getElementById("victoire").innerHTML = "";
        startGame();
    } else {
        gameOver = false;
        startGame()
    }
});
document.getElementById("difficulte").addEventListener('change', function () {
    if (this.value === "") {
        clearBoard();
    } else {
        gameOver = false;
        initGame();
        startGame();
    }
});

function initGame() {
    clearBoard();
    document.getElementById("perdu").innerHTML = "";
    document.getElementById("victoire").innerHTML = "";

    let difficulty = document.getElementById("difficulte").value;

    switch (difficulty) {
        case 'debutant':
            rows = 9;
            cols = 9;
            minesCount = 10;
            break;
        case 'intermediaire':
            rows = 16;
            cols = 16;
            minesCount = 40;
            break;
        case 'expert':
            rows = 22;
            cols = 22;
            minesCount = 100;
            break;
        case 'maître':
            rows = 30;
            cols = 30;
            minesCount = 250;
            break;
        default:
            console.error("Difficulté invalide :", difficulty);
            return;
    }

    const boardContainer = document.getElementById("board");
    boardContainer.className = difficulty;
}

function startGame() {
    const boardContainer = document.getElementById("board");
    clearBoard();
    tilesCount = 0;
    timer = null;
    Chrono();

    board = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/normal.png";
            tile.addEventListener("mousedown", function() {
                clickTile(r, c, event);
            });
            tile.classList.remove("tile-clicked");
            boardContainer.appendChild(tile);
            document.getElementById("mines-count").innerText = minesCount;
            row.push(tile);
        }
        board.push(row);
    }
    setMines();
}

function setMines() {

    let minesLeft = minesCount;

    minesLocation = [];
    
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function clearBoard() {
    if (board) {
        board = [];
    }

    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
}

function clickTile(r, c) {
    let tile = board[r][c];
    if (event.which == 3){
        toggleFlag(r, c);
        return;
    }

    if (gameOver == true) {
        if (!tile.classList.contains("tile-clicked")) {
            return;
        }
    }

    if (!tile.classList.contains("tile-clicked") || !tile.classlist.contains("flagged")) {

        if (minesLocation.includes(tile.id)) {
            gameOver = true;
            WinOrLose();
        } else {
            checkMine(r, c);
        }
    }
}

function WinOrLose(){
    if (gameOver == true){
        Chrono();
        revealMines();
        document.getElementById("perdu").innerHTML = "Vous avez perdu ...";
    } else if ((rows * cols) - minesCount == tilesCount){
        endTime = Date.now();
        document.getElementById("victoire").innerHTML = "Vous avez gagné en " + displayTime(endTime - startTime);
        revealMines();
        Chrono();
    } else {
        return;
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }

    let tile = board[r][c];
    if (tile.classList.contains("tile-clicked")) {
        return;
    }

    tile.classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r - 1, c - 1);  
    minesFound += checkTile(r - 1, c);     
    minesFound += checkTile(r - 1, c + 1); 

    minesFound += checkTile(r, c - 1);     
    minesFound += checkTile(r, c + 1);      

    minesFound += checkTile(r + 1, c - 1); 
    minesFound += checkTile(r + 1, c);    
    minesFound += checkTile(r + 1, c + 1);   

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        board[r][c].innerText = "";
        
        checkMine(r-1, c-1);   
        checkMine(r-1, c);     
        checkMine(r-1, c+1);    

        checkMine(r, c-1);     
        checkMine(r, c+1);      

        checkMine(r+1, c-1);    
        checkMine(r+1, c);  
        checkMine(r+1, c+1);    
    }

    if (tilesClicked === rows * cols - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
    updateTileImage(tile, r, c);

    WinOrLose();
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        tilesCount += 1
        WinOrLose();
        return 0;
        
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function countAdjacentMines(r, c) {
    let minesFound = 0;

    for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols && minesLocation.includes(i.toString() + "-" + j.toString())) {
                minesFound++;
            }
        }
    }

    return minesFound;
}

function updateTileImage(tile, r, c) {

    const flagImagePath = './images/flag.png'

    if (tile.getAttribute("src") !== flagImagePath) {
        if (minesLocation.includes(r.toString() + "-" + c.toString())) {
            tile.src = "./images/bomb.png";
        } else {
            let minesFound = countAdjacentMines(r, c);
            if (minesFound > 0) {
                tile.src = `./images/${minesFound}.png`;
            } else {
                tile.src = "./images/empty.png";
            }
        }
    }
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.src = "./images/bomb.png";               
            } else {
                let minesFound = countAdjacentMines(r, c);
                if (minesFound > 0) {
                    tile.src = `./images/${minesFound}.png`;
                } else {
                    tile.src = "./images/empty.png";
                }
            }
        }
    }
}

function toggleFlag(r, c) {
    tile = board[r][c];

    if (tile.classList.contains("flagged")) {
        tile.classList = "";
        tile.src = './images/normal.png';
    } else {
        tile.classList.add("flagged");
        tile.src = './images/flag.png';
    }
    
}

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

function displayTime(duration){
    var ms = duration % 1000,
    sec = ((duration - ms) / 1000) % 60,
    min = (duration - ms - (sec * 1000)) / 1000 / 60;

    return (min + "").padStart(2, "0") + 
    ":" + (sec + "").padStart(2, "0");
}

function Chrono(){
    if (timer !== null){
        clearInterval(timer);
        timer = null;
    } else {
        startTime = Date.now();
        timer = setInterval(function(){
            timeEl.innerHTML = displayTime(Date.now() - startTime)}, 5);
    }
}