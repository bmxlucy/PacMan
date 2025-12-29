// This variable will hold the HTML canvas element where we draw the game
let board;

// How many rows (vertical spaces) our game board has
const rowCount = 21;

// How many columns (horizontal spaces) our game board has
const colCount = 19;

// The size of each square tile in pixels (each game character/wall takes up 32x32 pixels)
const tileSize = 32;

// Calculate the total width of the game board by multiplying columns by tile size
// Example: 19 columns * 32 pixels = 608 pixels wide
const boardWidth = colCount * tileSize;

// Calculate the total height of the game board by multiplying rows by tile size
// Example: 21 rows * 32 pixels = 672 pixels tall
const boardHeight = rowCount * tileSize;

// This will store the "2d context" - think of it as the paintbrush we use to draw on the canvas
// This will store the "2d context" - think of it as the paintbrush we use to draw on the canvas
let context;

// These variables will hold the images for each ghost character
// We create separate variables so each ghost can have a different color
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;

// These variables hold different images of Pacman facing different directions
// When Pacman moves, we change which image is shown to make him face that direction
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let pacmanUpImage;

// This variable holds the image used to draw walls on the game board
let wallImage;


// This function loads all the image files from the "img" folder into memory
// We need to do this before we can draw anything on the screen
function loadImages() {
    // Create a new Image object that will hold the wall picture
    wallImage = new Image();
    // Tell it which file to load (the wall.png file in the img folder)
    wallImage.src = "img/wall.png";

    // Do the same for Pacman facing up
    pacmanUpImage = new Image();
    pacmanUpImage.src = "img/pacmanUp.png";
    
    // Load Pacman facing down
    pacmanDownImage = new Image();
    pacmanDownImage.src = "img/pacmanDown.png";
    
    // Load Pacman facing left
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "img/pacmanLeft.png";
    
    // Load Pacman facing right
    pacmanRightImage = new Image();
    pacmanRightImage.src = "img/pacmanRight.png";

    // Load the blue ghost image
    blueGhostImage = new Image();
    blueGhostImage.src = "img/blueGhost.png";

    // Load the orange ghost image
    orangeGhostImage = new Image();
    orangeGhostImage.src = "img/orangeGhost.png";

    // Load the pink ghost image
    pinkGhostImage = new Image();
    pinkGhostImage.src = "img/pinkGhost.png";

    // Load the red ghost image
    redGhostImage = new Image();
    redGhostImage.src = "img/redGhost.png";
}

// This is the map of our game board
// Think of it as a blueprint that tells us where to place walls, ghosts, Pacman, and food
// Each character represents something different:
// "X" = wall (a barrier that nothing can pass through)
// " " (space) = empty space where food pellets will appear
// "P" = where Pacman starts
// "b" = where the blue ghost starts
// "o" = where the orange ghost starts
// "p" = where the pink ghost starts
// "r" = where the red ghost starts
// "O" = empty space with no food (the ghost house area)
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

// An array containing all possible directions a character can move
// 'U' = Up, 'D' = Down, 'L' = Left, 'R' = Right
const directions = ['U', 'D', 'L', 'R'];

// Variable to keep track of the player's current score (starts at 0)
let score = 0;

// Variable to track how many lives Pacman has left (starts with 3 lives)
let lives = 3;

// Boolean (true/false) flag to track if the game is over or still playing
let gameOver = false;

// This special function runs automatically when the web page finishes loading
// It sets up everything we need to start the game
window.onload = function() {
    // Find the canvas element in the HTML with the id "board" and store it
    board = document.getElementById("board");
    
    // Set the width of the canvas to match our calculated board width
    board.width = boardWidth;
    
    // Set the height of the canvas to match our calculated board height
    board.height = boardHeight;
    
    // Get the "2d context" from the canvas - this is what we use to draw on it
    context = board.getContext("2d");

    // Call the function that loads all the images into memory
    loadImages();
    
    // Call the function that reads our tileMap and creates all the walls, food, ghosts, and Pacman
    loadMap();
    
    // Print to the browser console how many walls were created (for debugging)
    console.log(walls.size);
    
    // Print to the browser console how many food pellets were created (for debugging)
    console.log(foods.size);
    
    // Print to the browser console how many ghosts were created (for debugging)
    console.log(ghosts.size);

    // Loop through each ghost and give them a random starting direction
    for (let ghost of ghosts.values()) {
        // Pick a random number between 0 and 3
        // Math.random() gives us a decimal between 0 and 1
        // Multiply by 4 to get 0 to 3.99...
        // Math.floor() rounds down to get exactly 0, 1, 2, or 3
        const newDirection = directions[Math.floor(Math.random() * 4)];
        
        // Tell the ghost to start moving in that random direction
        ghost.updateDirection(newDirection);
    }
    
    // Start the main game loop that will run repeatedly
    update();
    
    // Set up a listener that watches for when the player releases a key on the keyboard
    // When a key is released, call the movePacman function
    document.addEventListener("keyup", movePacman);
}

// A "Set" is like a collection that stores unique items (no duplicates)
// This Set will hold all the wall objects in the game
const walls = new Set();

// This Set will hold all the food pellet objects that Pacman can eat
const foods = new Set();

// This Set will hold all the ghost objects (the enemies)
const ghosts = new Set();

// This variable will hold the Pacman object (the player character)
let pacman;




// This function reads the tileMap blueprint and creates all the game objects
// It places walls, food, ghosts, and Pacman in their correct positions
function loadMap() {
    // Clear out any existing walls from the Set (removes all old walls)
    walls.clear();
    
    // Clear out any existing food pellets
    foods.clear();
    
    // Clear out any existing ghosts
    ghosts.clear();

    // Loop through each row in the tileMap (r goes from 0 to 20)
    for (let r = 0; r < rowCount; r++) {
        // Loop through each column in the current row (col goes from 0 to 18)
        for (let col = 0; col < colCount; col++) {
            // Get the string for the current row from the tileMap
            const row = tileMap[r];
            
            // Get the specific character at this column position
            // For example, if row is "XXX  X" and col is 0, tileMapChar would be "X"
            const tileMapChar = row[col];

            // Calculate the x position in pixels (how far from the left)
            // Example: column 3 * 32 pixels = 96 pixels from the left
            const x = col * tileSize;
            
            // Calculate the y position in pixels (how far from the top)
            // Example: row 5 * 32 pixels = 160 pixels from the top
            const y = r * tileSize;
            
            // Check what character we found and create the appropriate object
            // If we found an "X", it means we need to place a wall here
            if (tileMapChar === "X") {
                // Create a new Block object with the wall image at this x,y position
                // The wall will be 32x32 pixels (one tileSize)
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                
                // Add this wall to our collection of walls
                walls.add(wall);
            }
            // If we found a "b", place a blue ghost here
            else if (tileMapChar === "b") {
                const blueGhost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(blueGhost);
            }
            // If we found an "o", place an orange ghost here
            else if (tileMapChar === "o") {
                const orangeGhost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(orangeGhost);
            }
            // If we found a "p", place a pink ghost here
            else if (tileMapChar === "p") {
                const pinkGhost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(pinkGhost);
            }
            // If we found an "r", place a red ghost here
            else if (tileMapChar === "r") {
                const redGhost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(redGhost);
            }
            // If we found a "P", place Pacman here (this is where the player starts)
            else if (tileMapChar === "P") {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            // If we found a space " ", place a food pellet here for Pacman to eat
            else if (tileMapChar === " ") {
                // Create a small white square (4x4 pixels) centered in the tile
                // The +14 centers it (32-4 = 28, divided by 2 = 14)
                // We pass "null" for the image because food is just a colored square
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            // If we found "O", we don't place anything (empty space, no food)
        }
    }
}

// This is the main game loop function - it runs repeatedly to update and redraw the game
// Think of it like frames in a movie - each time it runs, we show a new "frame" of the game
function update() {
    // If the game is over, stop running the update loop (don't do anything)
    if (gameOver) {
        return;
    }
    
    // Move all the characters (Pacman and ghosts) to their new positions
    move();
    
    // Draw everything on the screen in their updated positions
    draw();
    
    // Wait 50 milliseconds (0.05 seconds), then call update() again
    // This creates a loop that runs about 20 times per second
    setTimeout(update, 50);
}

// This function draws everything on the canvas - walls, food, ghosts, Pacman, and score
function draw() {
    // Clear the entire canvas (erase everything that was drawn before)
    // This is like erasing a whiteboard before drawing the next frame
    // We clear from position (0,0) to the full width and height of the board
    context.clearRect(0, 0, board.width, board.height);
    
    // Draw Pacman's image at his current x,y position with his current width and height
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    
    // Loop through all the ghosts and draw each one
    for(let ghost of ghosts.values()) {
        // Draw this ghost's image at its current position
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    
    // Loop through all the walls and draw each one
    for(let wall of walls.values()) {
        // Draw this wall's image at its position
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    
    // Set the color we'll use for the next things we draw (white color)
    context.fillStyle = "white";
    
    // Loop through all the food pellets and draw each one as a white square
    for(let food of foods.values()) {
        // Draw a filled rectangle (the food pellet) at the food's position
        context.fillRect(food.x, food.y, food.width, food.height);
    }
    
    // Now draw the score and lives text at the top of the screen
    // Set the text color to white
    context.fillStyle = "white";
    
    // Set the font size and style for the text
    context.font = "14px sans-serif";
    
    // Check if the game is over
    if (gameOver) {
        // If game over, show the "Game Over" message with the final score
        // tileSize/2 = 16 pixels from the left and 16 pixels from the top
        context.fillText("Game Over! Final Score: " + score, tileSize/2, tileSize/2);
    }
    else {
        // If game is still going, show the number of lives and current score
        // Example: "x3 100" means 3 lives and 100 points
        context.fillText("x" + lives + " " + score, tileSize/2, tileSize/2);
    }
}

// This function handles moving Pacman and all the ghosts
// It also checks for collisions (when things bump into each other)
function move() {
    // Update Pacman's x position (horizontal) by adding his horizontal speed
    // If velocityX is positive, he moves right. If negative, he moves left
    pacman.x += pacman.velocityX;
    
    // Update Pacman's y position (vertical) by adding his vertical speed
    // If velocityY is positive, he moves down. If negative, he moves up
    pacman.y += pacman.velocityY;

    // Check if Pacman hit any walls
    // Loop through each wall in our walls collection
    for (let wall of walls.values()) {
        // Check if Pacman is colliding (overlapping) with this wall
        if (collision(pacman, wall)) {
            // If he hit a wall, undo his movement by subtracting the velocity
            // This pushes him back to where he was before hitting the wall
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            
            // Stop checking other walls (we found a collision, no need to keep checking)
            break;
        }
    }

    // Check if Pacman hit any ghosts
    // Loop through each ghost in our ghosts collection
    for (let ghost of ghosts.values()) {
        // Check if Pacman is colliding with this ghost
        if (collision(pacman, ghost)) {
            // Pacman got caught by a ghost! Lose one life
            lives -= 1;
            
            // Check if we have no lives left
            if (lives <= 0) {
                // No lives left = game over
                gameOver = true;
                
                // Stop this function immediately (don't continue running)
                return;
            }
            
            // We still have lives left, so reset everyone's positions
            resetPositions();
        }

        // Special rule: If a ghost is at row 9 and moving horizontally (not up or down)
        // tileSize*9 = 288 pixels from the top (this is the ghost house exit)
        // Force the ghost to move up to leave the ghost house
        if (ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D') {
            ghost.updateDirection('U');
        }

        // Update this ghost's x position by adding its horizontal speed
        ghost.x += ghost.velocityX;
        
        // Update this ghost's y position by adding its vertical speed
        ghost.y += ghost.velocityY;
        
        // Check if this ghost hit a wall or went out of bounds
        // Loop through all walls
        for (let wall of walls.values()) {
            // Check if the ghost hit a wall OR went too far left OR went too far right
            if (collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth) {
                // Undo the ghost's movement
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                
                // Pick a random new direction for the ghost
                const newDirection = directions[Math.floor(Math.random() * 4)];
                
                // Make the ghost start moving in that new direction
                ghost.updateDirection(newDirection);
            }
        }
    }

    // Check if Pacman ate any food
    // Create a variable to remember which food was eaten (starts as null = no food eaten)
    let foodEaten = null;
    
    // Loop through all the food pellets
    for (let food of foods.values()) {
        // Check if Pacman is touching this food
        if (collision(pacman, food)) {
            // Remember which food was eaten
            foodEaten = food;
            
            // Add 10 points to the score
            score += 10;
            
            // Stop checking (Pacman can only eat one food pellet at a time)
            break;
        }
    }
    
    // Remove the eaten food from the foods collection
    // If foodEaten is null (no food was eaten), this does nothing
    foods.delete(foodEaten);
    
    // Check if there's no food left
    if(foods.size == 0) {
        // Player ate all the food! Load a new level
        loadMap();
        
        // Reset everyone back to their starting positions
        resetPositions();
    }
}

// This function handles keyboard input - it's called when the player releases a key
// The "e" parameter contains information about which key was pressed
function movePacman(e) {
    // If the game is over and the player presses any key, restart the game
    if (gameOver) {
        // Reload the map (recreate all walls, food, ghosts, and Pacman)
        loadMap();
        
        // Reset everyone's positions to their starting points
        resetPositions();
        
        // Reset the score back to 0
        score = 0;
        
        // Give the player 3 lives again
        lives = 3;
        
        // Set gameOver to false (game is no longer over)
        gameOver = false;
        
        // Start the game loop again
        update();
        
        // Exit this function (don't continue with the movement code below)
        return;
    }
    
    // Check which key was pressed and update Pacman's direction accordingly
    // e.code tells us which key was pressed
    // If the player pressed the Up Arrow or W key
    if(e.code == "ArrowUp" || e.code == "KeyW") {
        // Tell Pacman to start moving up
        pacman.updateDirection('U');
    }
    // If the player pressed the Down Arrow or S key
    else if(e.code == "ArrowDown" || e.code == "KeyS") {
        // Tell Pacman to start moving down
        pacman.updateDirection('D');
    }
    // If the player pressed the Left Arrow or A key
    else if(e.code == "ArrowLeft" || e.code == "KeyA") {
        // Tell Pacman to start moving left
        pacman.updateDirection('L');
    }
    // If the player pressed the Right Arrow or D key
    else if(e.code == "ArrowRight" || e.code == "KeyD") {
        // Tell Pacman to start moving right
        pacman.updateDirection('R');
    }

    // Now update Pacman's image to face the direction he's moving
    // If Pacman is moving up
    if(pacman.direction == 'U') {
        // Change Pacman's image to the one facing up
        pacman.image = pacmanUpImage;
    }
    // If Pacman is moving down
    else if(pacman.direction == 'D') {
        // Change Pacman's image to the one facing down
        pacman.image = pacmanDownImage;
    }
    // If Pacman is moving left
    else if(pacman.direction == 'L') {
        // Change Pacman's image to the one facing left
        pacman.image = pacmanLeftImage;
    }
    // If Pacman is moving right
    else if(pacman.direction == 'R') {
        // Change Pacman's image to the one facing right
        pacman.image = pacmanRightImage;
    }
}



// This function checks if two rectangular objects are overlapping (colliding)
// It takes two objects (a and b) and returns true if they're touching, false if they're not
function collision(a, b) {
    // This uses rectangle collision detection
    // Four conditions must ALL be true for rectangles to be colliding:
    
    // 1. a's left edge is to the left of b's right edge
    // 2. a's right edge is to the right of b's left edge
    // 3. a's top edge is above b's bottom edge
    // 4. a's bottom edge is below b's top edge
    
    // If all four are true, the rectangles overlap (return true)
    // If any one is false, they don't overlap (return false)
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// This function resets Pacman and all ghosts back to their starting positions
// It's called when Pacman loses a life or when starting a new level
function resetPositions() {
    // Reset Pacman to his starting position (calls the reset method on the pacman object)
    pacman.reset();
    
    // Stop Pacman from moving by setting his horizontal velocity to 0
    pacman.velocityX = 0;
    
    // Stop Pacman from moving by setting his vertical velocity to 0
    pacman.velocityY = 0;

    // Loop through all the ghosts
    for (let ghost of ghosts.values()) {
        // Reset this ghost to its starting position
        ghost.reset();
        
        // Give this ghost a random new direction to move
        const newDirection = directions[Math.floor(Math.random() * 4)];
        
        // Make the ghost start moving in that direction
        ghost.updateDirection(newDirection);
    }
}

// This is a "class" - think of it as a blueprint for creating game objects
// We use this class to create Pacman, ghosts, walls, and food
// A class defines what properties (data) and methods (functions) each object will have
class Block {
    // This is the "constructor" - it runs automatically when we create a new Block
    // It takes 5 pieces of information: image, x position, y position, width, and height
    constructor(image, x, y, width, height) {
        // Store the image for this block (what it looks like)
        this.image = image;
        
        // Store the x position (how far from the left edge)
        this.x = x;
        
        // Store the y position (how far from the top edge)
        this.y = y;
        
        // Store the width (how wide the block is in pixels)
        this.width = width;
        
        // Store the height (how tall the block is in pixels)
        this.height = height;

        // Remember the starting x position (we need this to reset later)
        this.startX = x;
        
        // Remember the starting y position (we need this to reset later)
        this.startY = y;

        // The direction this block is moving ('R'=right, 'L'=left, 'U'=up, 'D'=down)
        // Default starting direction is right
        this.direction = 'R';
        
        // How fast the block moves horizontally (positive=right, negative=left, 0=not moving)
        this.velocityX = 0;
        
        // How fast the block moves vertically (positive=down, negative=up, 0=not moving)
        this.velocityY = 0;
    }

    // This method updates which direction the block is moving
    // It takes one parameter: the new direction ('U', 'D', 'L', or 'R')
    updateDirection(direction){
        // Remember what direction we were moving before (we might need to restore it)
        const prevDirection = this.direction;   
        
        // Update to the new direction
        this.direction = direction;
        
        // Update the velocity (speed) based on the new direction
        // This will change velocityX and velocityY
        this.updateVelocity();
        
        // Try moving one step in the new direction by adding the velocity
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check if this new position would hit a wall
        // Loop through all the walls
        for (let wall of walls.values()) {
            // If we're colliding with a wall in this new position
            if (collision(this, wall)) {
                // Undo the movement (go back to where we were)
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                
                // Restore the previous direction (keep moving the old way)
                this.direction = prevDirection;
                
                // Update velocity back to match the previous direction
                this.updateVelocity();
                
                // Exit this method (don't continue)
                return;
            }
        }
    }

    // This method calculates the velocity (speed) based on the current direction
    // It sets velocityX and velocityY based on which way the block should move
    updateVelocity(){ 
        // If moving up
        if(this.direction == 'U') {
            // Don't move horizontally
            this.velocityX = 0;
            
            // Move upward (negative y means going up)
            // tileSize/4 = 32/4 = 8 pixels per frame
            this.velocityY = -tileSize / 4;
        }
        // If moving down
        else if(this.direction == 'D') {
            // Don't move horizontally
            this.velocityX = 0;
            
            // Move downward (positive y means going down)
            this.velocityY = tileSize / 4;
        }
        // If moving left
        else if(this.direction == 'L') {
            // Move left (negative x means going left)
            this.velocityX = -tileSize / 4;
            
            // Don't move vertically
            this.velocityY = 0;
        }
        // If moving right
        else if(this.direction == 'R') {
            // Move right (positive x means going right)
            this.velocityX = tileSize / 4;
            
            // Don't move vertically
            this.velocityY = 0;
        }
    }
    
    // This method resets the block back to its starting position
    // It's called when we need to restart the level or when Pacman loses a life
    reset() {
        // Set x back to the starting x position we remembered
        this.x = this.startX;
        
        // Set y back to the starting y position we remembered
        this.y = this.startY;
    }
}

