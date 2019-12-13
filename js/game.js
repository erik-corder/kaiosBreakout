var cvs = document.createElement('canvas');
cvs.width = 400;
cvs.height = 500;
ctx = cvs.getContext('2d');
document.body.appendChild(cvs);
cvs.style.border = "1px solid #0ff";

ctx.font = "20px  'Times New Roman', Times, serif";

//make line thik when drawing to canvas
ctx.lineWidth = 3;

//variables
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_REDIUS = 8;
var LIFE = 3
var leftArrow = false;
var rightArrow = false;

/////// LOAD IMAGES ////////
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

//create paddle
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

//draw paddle
function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#b91c39";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

//control the paddle
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }
});

//move paddle
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//create the ball
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_REDIUS,
    redius: BALL_REDIUS,
    speed: 4,
    dx: 3,
    dy: -3
}

//draw the ball
function drawBall() {
    ctx.beginPath();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.redius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

//move the bole
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballWallcollision(){
    if(ball.x + ball.redius > cvs.width || ball.x - ball.redius < 0){
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.redius < 0){
        ball.dy = -ball.dy;
    }

    if(ball.y + ball.redius > cvs.height){
        LIFE--;
        resetBall();
    }
}

//RESET BALL
function resetBall(){
    ball.x= cvs.width / 2;
    ball.y= paddle.y - BALL_REDIUS;
    ball.dx= 3;
    ball.dy= -3;
}

//draw function
function draw() {
    drawPaddle();
    drawBall();
}

//update
function update() {
    movePaddle();
    moveBall();
    ballWallcollision();
}

//game loop
function loop() {
    ctx.drawImage(BG_IMG, 0, 0);
    draw();

    update();

    requestAnimationFrame(loop);
}

loop();
