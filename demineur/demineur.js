// Variables globales
let minesCount, minesLocation, tilesClicked, flagEnabled, gameOver, board;
let rows, cols;


document.getElementById("difficulte").addEventListener('change', function () {
    if (this.value === "") {
        clearBoard();
    } else {
        initGame();
        startGame();
    }
});

function initGame() {
    clearBoard();

    let difficulty = document.getElementById("difficulte").value;
    document.getElementById("flag-button").addEventListener("click", setFlag);

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

    board = []; // Initialisation de la variable globale board

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/normal.png";
            tile.addEventListener("click", function() {
                clickTile(r, c);
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

    document.getElementById("flag-button").addEventListener("click", setFlag);
}


function setMines() {
    let minesLeft = minesCount;

    if (!minesLocation) {
        minesLocation = [];
    }

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

function setFlag() {
    flagEnabled = !flagEnabled;
    document.getElementById("flag-button").style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile(r, c) {
    let tile = board[r][c];

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
            revealMines();
        } else {
            console.log('h');
            checkMine(r, c);
        }
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
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        console.log('n');
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
    const flagImagePath = "./images/flag.png";

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


function toggleFlag(tile) {
    if (tile.innerText === "") {
        tile.innerText = "🚩";
    } else if (tile.innerText === "🚩") {
        tile.innerText = "";
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




