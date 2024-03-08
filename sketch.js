// Define some global variables
let x, y, z; // The position of the current block
let cols, rows, depth; // The size of each cube
let speed; // The speed of the block falling
let blocks; // An array of existing blocks
let colors; // An array of possible colors
let currentColor; // The color of the current block
let score; // The current score
let gameOver; // A flag to indicate if the game is over

function setup() {
  // Create a canvas with WEBGL renderer
  createCanvas(500, 500, WEBGL);
  // Set the frame rate to 10
  frameRate(10);
  // Initialize the global variables
  x = 0;
  y = -200;
  z = 0;
  cols = 50;
  rows = 50;
  depth = 50;
  speed = 10;
  blocks = [];
  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0), color(0, 255, 255), color(255, 0, 255)];
  currentColor = random(colors);
  score = 0;
  gameOver = false;
}

function draw() {
  // Set the background color to black
  background(0);
  // Set the camera position and angle
  camera(200, -400, 400, 0, 0, 0, 0, 1, 0);
  // Use the orbitControl() function to enable mouse movement
  orbitControl();
  // Set the ambient light and the directional light
  ambientLight(100);
  directionalLight(255, 255, 255, 0, -1, -1);
  // Draw the grid lines
  stroke(255);
  strokeWeight(2);
  for (let i = -200; i <= 200; i += cols) {
    line(i, -200, -200, i, -200, 200);
    line(i, -200, -200, i, 200, -200);
    line(-200, i, -200, 200, i, -200);
    line(-200, -200, i, -200, 200, i);
    line(-200, -200, i, 200, -200, i);
    line(-200, i, -200, -200, i, 200);
  }
  // Draw the current block
  noStroke();
  fill(currentColor);
  push();
  translate(x, y, z);
  box(cols, rows, depth);
  pop();
  // Draw the existing blocks
  for (let block of blocks) {
    fill(block.color);
    push();
    translate(block.x, block.y, block.z);
    box(cols, rows, depth);
    pop();
  }
  // Update the position of the current block
  y += speed;
  // Check if the current block hits the bottom or any other block
  if (y > 200 - rows / 2 || collide(x, y, z)) {
    // Add the current block to the blocks array
    blocks.push({x: x, y: y - speed, z: z, color: currentColor});
    // Reset the position and color of the current block
    x = 0;
    y = -200;
    z = 0;
    currentColor = random(colors);
    // Check if any line is complete and clear it
    checkLines();
    // Check if the game is over
    checkGameOver();
  }
  // Display the score
  fill(255);
  textSize(32);
  text("Score: " + score, -width / 2 + 20, -height / 2 + 40);
  // Display the game over message
  if (gameOver) {
    fill(255, 0, 0);
    textSize(64);
    text("Game Over", -width / 4, 0);
    noLoop();
  }
}

// A function to check if a position collides with any existing block
function collide(x, y, z) {
  for (let block of blocks) {
    if (x == block.x && y == block.y && z == block.z) {
      return true;
    }
  }
  return false;
}

// A function to check if any line is complete and clear it
function checkLines() {
  // Loop through all possible y values
  for (let j = -200 + rows / 2; j <= 200 - rows / 2; j += rows) {
    // Count how many blocks are on this y value
    let count = 0;
    for (let block of blocks) {
      if (block.y == j) {
        count++;
      }
    }
    // If the count is 8, then the line is complete
    if (count == 8) {
      // Increase the score
      score++;
      // Remove the blocks on this line
      blocks = blocks.filter(block => block.y != j);
      // Move the blocks above this line down
      for (let block of blocks) {
        if (block.y < j) {
          block.y += rows;
        }
      }
    }
  }
}

// A function to check if the game is over
function checkGameOver() {
  // Loop through all the blocks
  for (let block of blocks) {
    // If any block is on the top, then the game is over
    if (block.y == -200 + rows / 2) {
      gameOver = true;
      break;
    }
  }
}

// A function to handle the keyboard input
function keyPressed() {
  // If the game is not over, move the current block according to the key pressed
  if (!gameOver) {
    if (keyCode == LEFT_ARROW) {
      // Move left
      if (x > -200 + cols / 2 && !collide(x - cols, y, z)) {
        x -= cols;
      }
    } else if (keyCode == RIGHT_ARROW) {
      // Move right
      if (x < 200 - cols / 2 && !collide(x + cols, y, z)) {
        x += cols;
      }
    } else if (keyCode == UP_ARROW) {
      // Move forward
      if (z > -200 + depth / 2 && !collide(x, y, z - depth)) {
        z -= depth;
      }
    } else if (keyCode == DOWN_ARROW) {
      // Move backward
      if (z < 200 - depth / 2 && !collide(x, y, z + depth)) {
        z += depth;
      }
    } else if (key == ' ') {
      // Drop faster
      speed = 50;
    }
  }
}

// A function to reset the speed when the key is released
function keyReleased() {
  speed = 10;
}
