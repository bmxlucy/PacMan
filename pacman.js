let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 32;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let pacmanUpImage;
let wallImage;

function loadImages() {
    wallImage = new Image();
    wallImage.src = "img/wall.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "img/pacmanUp.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "img/pacmanDown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "img/pacmanLeft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "img/pacmanRight.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "img/blueGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "img/orangeGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "img/pinkGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "img/redGhost.png";
}


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    loadImages();
}

const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;


function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            const row = tileMap[row];
            const tileMapChar = row[col];
        }

}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;
    }
}