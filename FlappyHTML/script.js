// Flappy Bird Game

// Get the canvas element
var canvas = document.getElementById('canvas');
canvas.width = 1280;
canvas.height = 650;
var ctx = canvas.getContext('2d');

// Define game variables
var bird = {
  x: 100,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  velocity: 0,
  gravity: 0.1,
  jump: -3
};

var pipes = [];
var score = 0;
var gameOver = false;
var lastPipeTime = 0;
var pipeGap = 150; // Gap between top and bottom pipes

// Function to get random interval between 3-7 seconds
function getRandomInterval() {
  return Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw bird
  ctx.fillStyle = 'red';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  
  // Draw pipes
  for (var i = 0; i < pipes.length; i++) {
    ctx.fillStyle = 'lime';
    // Draw top pipe
    ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].topHeight);
    // Draw bottom pipe
    ctx.fillRect(pipes[i].x, pipes[i].bottomY, pipes[i].width, canvas.height - pipes[i].bottomY);
  }
  
  // Draw ground
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  
  // Draw score
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Score: ' + score, 10, 10);
}

// Update game state
function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Check collision with ground
  if (bird.y + bird.height > canvas.height - 50) {
    gameOver = true;
  }
  
  // Update pipes
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    
    // Check collision with pipes
    if (bird.x + bird.width > pipes[i].x &&
        bird.x < pipes[i].x + pipes[i].width &&
        (bird.y < pipes[i].topHeight || bird.y + bird.height > pipes[i].bottomY)) {
      gameOver = true;
    }
    
    // Remove pipe if it's off screen
    if (pipes[i].x < -pipes[i].width) {
      pipes.splice(i, 1);
      score++;
    }
  }
  
  // Add new pipe with random interval
  if (!lastPipeTime || Date.now() - lastPipeTime > getRandomInterval()) {
    var topHeight = Math.random() * (canvas.height - pipeGap - 100);
    var bottomY = topHeight + pipeGap;
    
    pipes.push({
      x: canvas.width,
      width: 80,
      topHeight: topHeight,
      bottomY: bottomY
    });
    lastPipeTime = Date.now();
  }
}

// Handle user input
document.addEventListener('keydown', function(event) {
  if (event.key === ' ') {
    bird.velocity = bird.jump;
  }
});

// Start game
function startGame() {
  bird.x = 100;
  bird.y = canvas.height / 8;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  lastPipeTime = 0;
  
  // Main game loop
  function loop() {
    if (!gameOver) {
      update();
      draw();
      requestAnimationFrame(loop);
    } else {
      alert('Koniec');
      document.getElementById('start-button').style.display = 'block';
    }
  }
  loop();
}

// Start button
var startButton = document.getElementById('start-button');
startButton.addEventListener('click', function() {
  startButton.style.display = 'none';
  startGame();
});

// Initialize game
startButton.style.display = 'block';
