let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    ballRadius = 9,
    x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
    y = canvas.height - 40,
    dx = 2,
    dy = -2;

let paddleHeight = 12,
    paddleWidth = 72;

let paddleX = (canvas.width - paddleWidth) / 2;

let rowCount = 5,
    columnCount = 9,
    brickWidth = 54,
    brickHeight = 18,
    brickPadding = 12,
    topOffset = 40,
    leftOffset = 33,
    score = 0;

let bricks = [];
for (let c = 0; c < columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);
canvas.addEventListener("touchend", touchEndHandler, false);

let touchX = null;
let paddleTouchOffset = null;

function touchStartHandler(e) {
  e.preventDefault();
  let touch = e.touches[0];
  touchX = touch.clientX;
  let canvasPosition = canvas.getBoundingClientRect().left;
  paddleTouchOffset = touch.clientX - canvasPosition - paddleX;
}

function touchMoveHandler(e) {
  e.preventDefault();
  let touch = e.touches[0];
  let canvasPosition = canvas.getBoundingClientRect().left;
  let newPaddleX = touch.clientX - canvasPosition - paddleTouchOffset;
  if (newPaddleX >= 0 && newPaddleX + paddleWidth <= canvas.width) {
    paddleX = newPaddleX;
  }
}

function touchEndHandler() {
  touchX = null;
  paddleTouchOffset = null;
}

function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 30);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + leftOffset;
        let brickY = (r * (brickHeight + brickPadding)) + topOffset;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function trackScore() {
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#333';
  ctx.fillText('Score : ' + score, 8, 24);
}

function hitDetection() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === rowCount * columnCount) {
            alert('You Win!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trackScore();
  drawBricks();
  drawBall();
  drawPaddle();
  hitDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert('Game Over!');
      document.location.reload();
    }
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }

  x += dx;
  y += dy;

  if (touchX !== null) {
    let canvasPosition = canvas.getBoundingClientRect().left;
    let newPaddleX = touchX - canvasPosition - paddleTouchOffset;
    if (newPaddleX >= 0 && newPaddleX + paddleWidth <= canvas.width) {
      paddleX = newPaddleX;
    }
  }
}

setInterval(init, 10);
