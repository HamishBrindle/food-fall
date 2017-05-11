/*
*   game.js
*   Main file for Food Fall!
 */
var timer = [];
// Speed of Game

function countDown() {
    displayNo;
    timer.push(setTimeout(displayNo, 1000));
    timer.push(setTimeout(displayNo, 2000));
    timer.push(setTimeout(displayNo, 3000));
    timer.push(setTimeout(displayNo, 4000));
    timer.push(setTimeout(displayNo, 5000));
    clearCountDown;
}

function gameInit() {
    if(gameBuild) {
        console.log("in game init");
        countDownIndex = 0;
        var three = PIXI.Sprite.fromImage('assets/img/sprites/cd-3.png');
        var two = PIXI.Sprite.fromImage('assets/img/sprites/cd-2.png');
        var one = PIXI.Sprite.fromImage('assets/img/sprites/cd-1.png');
        var go = PIXI.Sprite.fromImage('assets/img/sprites/cd-go.png');
        countDownNumbers = [three, two, one, go];
        countDown();
        timer.push(setTimeout(makeSprites, 5000));
    }
}

function clearCountDown() {
    for(var i = 0; i < timer.length; i++) {
        clearTimeout(timer[i]);
    }
}

function displayNo() {
    console.log("countDownIndex", countDownIndex);
    var curNum = countDownNumbers[countDownIndex];
    if(countDownIndex == 0) {
        stage.addChild(curNum);
    } else if(countDownIndex > 0 && countDownIndex < 4){
        var prevNum = countDownNumbers[countDownIndex - 1];
        prevNum.destroy();
        stage.addChild(curNum);
    } else {
        var prevNum = countDownNumbers[countDownIndex - 1];
        prevNum.destroy();
    }
    try {
        curNum.x = 100;
        curNum.y = 50;
    } catch (err) {}
    ++countDownIndex;
}

var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
  fontSize: 30,
  fontFamily: 'Arial',
  fill: 'white'
});


function makeSprites() {
    setInterval(makeFood, 100);
    setInterval(makeObstacle, 200);
}

var foodCount = 0;
function makeFood() {
    const MAX_FOOD = 5;
    if(foodCount >= MAX_FOOD) return;
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/sprites/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.x = getRandomInt(newFood.width, GAME_WIDTH - newFood.width);
    newFood.y = -newFood.height;
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    newFood.isFood = true;
    newFood.velocity = 0; //10 pixels per second
    newFood.accelerationY = 210; //
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;
    ++foodCount;

    stage.addChild(newFood);
}

function removeItem(childToDelete) {
    stage.removeChild(childToDelete);
}

// Determine if basket and food are colliding
function isCollide(basket, food) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    var upperLeft = {x:basket.x - xoffset, y:basket.y - yoffset};
    var lowerRight = {x:(basket.x + basket.width - xoffset), y:(basket.y + 10 - yoffset)};
    var inBasket = (food.x > upperLeft.x) && (food.y > upperLeft.y)
                    && (food.x < lowerRight.x) && (food.y < lowerRight.y);
    return inBasket;
}

function foodCatchCollision() {

    var currtime = new Date().getTime();
    var deltaTime = parseFloat((currtime - lastTime)/1000);
    var childrenToDelete = [];
    for (var i in stage.children) {
        var item = stage.children[i];
        if(item.isObstacle) {
            item.x -= 8;
            obstacleCollision(catcher, item);
            if(item.x < (-item.width)) {
                childrenToDelete.push(item);
                item.destroy();
                --obstacleCount;
            }
        }
        if (item.isFood) {
            var deltaY = item.velocity * deltaTime;
            var deltaVy = item.accelerationY * deltaTime;
            item.y += deltaY;
            item.velocity += deltaVy;
            item.rotation += item.rotateFactor;
             if (item.y > GAME_HEIGHT) {
                childrenToDelete.push(item);
                item.destroy();
                --foodCount;
            }
            try {
                if (isCollide(catcher, item)) {
                    childrenToDelete.push(item);
                    item.destroy();
                    sound.play('coin');
                    scoreCount += 10;
                    stage.removeChild(score);
                    --foodCount;
                }
            } catch(err) {}
        }
    }
    for (var i = 0; i < childrenToDelete.length; i++) {
        removeItem(childrenToDelete[i]);
    }
}

var obstacleCount = 0;
function makeObstacle() {
    const MAX_OBSTACLE = 1;
    if(obstacleCount >= MAX_OBSTACLE) return;
    var newObstacle = PIXI.Sprite.fromImage('assets/img/sprites/obstacle.png');
    newObstacle.x = newObstacle.width + GAME_WIDTH;
    newObstacle.height = getRandomInt(50, 300);
    newObstacle.y = GAME_HEIGHT - newObstacle.height;
    newObstacle.width = 50;
    newObstacle.isObstacle = true;
    ++obstacleCount;
    stage.addChild(newObstacle);
}

function obstacleCollision(catcher, obstacle) {
    if (isCollideWholeBasket(catcher, obstacle)) {
        state = menu;
        // destroyAll();
    }
}

function isCollideWholeBasket(basket, obstacle) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    return !(((basket.y + basket.height - yoffset) < (obstacle.y)) ||
            ((basket.y - yoffset) > (obstacle.y + obstacle.height)) ||
            ((basket.x + basket.width - xoffset - 12) < obstacle.x) ||
            ((basket.x - xoffset + 12)> (obstacle.x + obstacle.width)));
}

var scoreVisible;

function addScore() {
    if (!scoreVisible)
        score.x = GAME_WIDTH - 100;
    score.y = GAME_HEIGHT - 50;
    score.anchor.x = 0.5;
    score.text = 'Score: ' + scoreCount;
    stage.addChild(score);
    scoreVisible = true;
}

function hideScore() {
    if (scoreVisible) {
        stage.removeChild(score);
        scoreVisible = false;
    }
}

function destroyAll() {
    console.log("indestrpy");

    for (var i in stage.children) {
        if(stage.children.isBackground) continue;
        removeItem(stage.children[i]);
    }
}
