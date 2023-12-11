// Variables globales
let minesCount, minesLocation, tilesClicked, tilesCount, flagEnabled, gameOver, board;
let rows, cols;

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
document.getElementById("Gagner").addEventListener('click', function () {
    if (gameOver == false) {
        gameOver = true
        revealMines()
        console.log('gagné')
    }
});

function initGame() {
    clearBoard();

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
    console.log(tilesCount)

    board = []; // Initialisation de la variable globale board

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

    console.log(board);

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
    console.log(minesLocation)
}

function clearBoard() {
    if (board) {
        board = []; // Réinitialisation de la variable globale board
    }

    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
}

function clickTile(r, c, event) {
    let tile = board[r][c];
    if (event.which == 3){
        handleRightClick(r, c, event);
    }

    console.log('Clicked Tile:', r, c);

    if (gameOver == true) {
        console.log('y')
        if (!tile.classList.contains("tile-clicked")) {
            console.log('e');
            return;
        }
    }

    if (!tile.classList.contains("tile-clicked")) {
        if (flagEnabled) {
            console.log('f');
            toggleFlag(tile);
            return;
        }

        if (minesLocation.includes(tile.id)) {
            console.log('g');
            gameOver = true;
            WinOrLose();
        } else {
            console.log('h');
            checkMine(r, c);
        }
    }
}

function WinOrLose(){
    if (gameOver == true){
        document.getElementById("perdu").innerHTML = "Vous avez perdu ...";
        revealMines();
    } else if ((rows * cols) - minesCount == tilesCount){
        document.getElementById("victoire").innerHTML = "Vous avez gagné !";
        revealMines();
    } else {
        return;
    }
}

function checkMine(r, c) {
    console.log('Clicked Tile:', r, c);
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }

    let tile = board[r][c];
    console.log('b');
    if (tile.classList.contains("tile-clicked")) {
        return;
    }

    console.log('c');
    tile.classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // top 3
    minesFound += checkTile(r - 1, c - 1);   // top left
    minesFound += checkTile(r - 1, c);       // top 
    minesFound += checkTile(r - 1, c + 1);   // top right

    // left and right
    minesFound += checkTile(r, c - 1);       // left
    minesFound += checkTile(r, c + 1);       // right

    // bottom 3
    minesFound += checkTile(r + 1, c - 1);   // bottom left
    minesFound += checkTile(r + 1, c);       // bottom 
    minesFound += checkTile(r + 1, c + 1);   // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        board[r][c].innerText = "";
        
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked === rows * cols - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
    console.log('d');
    updateTileImage(tile, r, c);

    WinOrLose();
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        console.log('n');
        tilesCount += 1
        console.log(tilesCount)
        WinOrLose();
        return 0;
        
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        console.log('o');
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

    if (tile.classList == "flagged"){
        tile.src = `./images/flag.png`;
        tile.disabled = true;
    }

    if (tile.getAttribute("src") !== flagImagePath) {
        if (minesLocation.includes(r.toString() + "-" + c.toString())) {
            console.log('a');
            tile.src = "./images/bomb.png";  // Changer l'image en cas de mine
        } else {
            console.log('b');
            let minesFound = countAdjacentMines(r, c);
            if (minesFound > 0) {
                console.log('c');
                tile.src = `./images/${minesFound}.png`;  // Changer l'image en cas de mine adjacente
            } else {
                console.log('d');
                tile.src = "./images/empty.png";  // Changer l'image s'il n'y a pas de mine
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
                    tile.src = `./images/${minesFound}.png`;  // Changer l'image en cas de mine adjacente
                } else {
                    tile.src = "./images/empty.png";  // Changer l'image s'il n'y a pas de mine
                }
            }
        }
    }
}

function handleRightClick(r, c, event) {
    tile = board[r][c];
    tile.classList.add("flagged");
    updateTileImage();
    event.preventDefault();
}

document.oncontextmenu = new Function("return false");