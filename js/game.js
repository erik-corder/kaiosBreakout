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
var SCORE = 0;
var SCORE_UNITE = 10;
var LEVEL = 1;
var MAX_LEVEL = 3;
var LIFE = 3
var leftArrow = false;
var rightArrow = false;

/////// LOAD IMAGES ////////
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

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
    dx: 3 * (Math.random() * 2 - 1),
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
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballWallcollision() {
    if (ball.x + ball.redius > cvs.width || ball.x - ball.redius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.redius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.y + ball.redius > cvs.height) {
        LIFE--;
        resetBall();
    }
}

//RESET BALL
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_REDIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//ball and paddle collision
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {

        //check where the ball hit the paddle
        var collidePoint = ball.x - (paddle.x + paddle.width / 2);

        //normalize the value
        collidePoint = collidePoint / (paddle.width / 2);

        //calculate the angle of the ball
        var angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

const brick = {
    row: 3,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}

var bricks = [];

function createBricks() {
    for (var r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (var c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x : c * (brick.offSetLeft + brick.width)+brick.offSetLeft,
                y : r * (brick.offSetTop + brick.height)+ brick.offSetTop+ brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

//draw the bricks
function drawBricks(){
    for (var r = 0; r < brick.row; r++) {
        for (var c = 0; c < brick.column; c++) {
           var b = bricks[r][c];
           if(b.status){
               ctx.fillStyle = brick.fillColor;
               ctx.fillRect(b.x, b.y, brick.width, brick.height);

               ctx.strokeStyle = brick.strokeColor;
               ctx.strokeRect(b.x, b.y, brick.width, brick.height);
           }
        }
    }
}

//ball brick collision
function ballBrickCollision(){
    for (var r = 0; r < brick.row; r++) {
        for (var c = 0; c < brick.column; c++) {
           var b = bricks[r][c];
           if(b.status){
               if(ball.x + ball.redius > b.x && ball.x - ball.redius < b.x + brick.width && ball.y + ball.redius > b.y && ball.y - ball.redius < b.y + brick.height){
                   ball.dy =  -ball.dy;
                   b.status = false;
                   SCORE += SCORE_UNITE;
               }
           }
        }
    }
}

//shwo game status
function showGameStatus(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Gemania One";
    ctx.fillText(text, textX, textY);

    //draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

//draw function
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    showGameStatus(SCORE, 35, 25, SCORE_IMG, 5, 5);
    showGameStatus(LIFE, cvs.width-25, 25, LIFE_IMG, cvs.width-55, 5);
    showGameStatus(LEVEL, cvs.width/2, 25, LIFE_IMG, cvs.width/2-30, 5);
}

//update
function update() {
    movePaddle();
    moveBall();
    ballWallcollision();
    ballPaddleCollision();
    ballBrickCollision();
}

//game loop
function loop() {
    ctx.drawImage(BG_IMG, 0, 0);
    draw();

    update();

    requestAnimationFrame(loop);
}

loop();
