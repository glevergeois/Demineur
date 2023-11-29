// Variables globales
let minesCount, minesLocation, tilesClicked, flagEnabled, gameOver, board;

document.getElementById("difficulte").addEventListener('change', function () {
    if (this.value === "") {
        clearBoard();
    } else {
        const { rows, cols, minesCount } = initGame();
        startGame(rows, cols, minesCount);
    }
});

function initGame() {
    clearBoard();

    let difficulty = document.getElementById("difficulte").value;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    let rows, cols;

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

    return { rows, cols, minesCount };
}

function startGame(rows, cols, minesCount) {
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
                clickTile(r, c, rows, cols);
            });
            tile.classList.remove("tile-clicked");
            boardContainer.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);

    setMines(rows, cols, minesCount);

    document.getElementById("flag-button").addEventListener("click", setFlag);
}


function setMines(rows, cols, minesCount) {
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

function clickTile(r, c, rows, cols) {
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
        tile.classList.add("tile-clicked"); // Ajoutez cette ligne ici pour le clic initial
        if (flagEnabled) {
            console.log('f');
            toggleFlag(tile);
            return;
        }

        if (minesLocation.includes(tile.id)) {
            console.log('g');
            gameOver = true;
            revealMines(rows, cols);
        } else {
            console.log('h');
            checkMine(r, c, rows, cols);
        }

        updateTileImage(tile, r, c, rows, cols);
    }
}

function checkMine(r, c, rows, cols) {
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

    // top 3
    minesFound += checkTile(r - 1, c - 1, rows, cols);   // top left
    minesFound += checkTile(r - 1, c, rows, cols);       // top 
    minesFound += checkTile(r - 1, c + 1, rows, cols);   // top right

    // left and right
    minesFound += checkTile(r, c - 1, rows, cols);       // left
    minesFound += checkTile(r, c + 1, rows, cols);       // right

    // bottom 3
    minesFound += checkTile(r + 1, c - 1, rows, cols);   // bottom left
    minesFound += checkTile(r + 1, c, rows, cols);       // bottom 
    minesFound += checkTile(r + 1, c + 1, rows, cols);   // bottom right

    if (minesFound === 0) {
        // Appel correct de checkMine pour les cases adjacentes
        checkMine(r - 1, c - 1, rows, cols);   // top left
        checkMine(r - 1, c, rows, cols);       // top
        checkMine(r - 1, c + 1, rows, cols);   // top right

        checkMine(r, c - 1, rows, cols);       // left
        checkMine(r, c + 1, rows, cols);       // right

        checkMine(r + 1, c - 1, rows, cols);   // bottom left
        checkMine(r + 1, c, rows, cols);       // bottom
        checkMine(r + 1, c + 1, rows, cols);   // bottom right
    }

    if (tilesClicked === rows * cols - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}


function checkTile(r, c, rows, cols) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function checkTile(r, c, rows, cols) {
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

function countAdjacentMines(row, col, rows, cols) {
    let minesFound = 0;

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols && minesLocation.includes(i.toString() + "-" + j.toString())) {
                minesFound++;
            }
        }
    }

    return minesFound;
}

function updateTileImage(tile, r, c, rows, cols) {
    const flagImagePath = "./images/flag.png";

    if (tile.getAttribute("src") !== flagImagePath) {
        if (minesLocation.includes(r.toString() + "-" + c.toString())) {
            console.log('a');
            tile.src = "./images/bomb.png";  // Changer l'image en cas de mine
        } else {
            console.log('b');
            let minesFound = countAdjacentMines(r, c, rows, cols);
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

function revealMines(rows, cols) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.src = "./images/bomb.png";                
            }
        }
    }
}




