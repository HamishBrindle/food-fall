/*
*   game.js
*   Main file for Food Fall!
 */

// Speed of Game
setTimeout(makeSprites, 2000);

var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
  fontSize: 30,
  fontFamily: 'Arial',
  fill: 'white'
});

function leaderBoardMenu() {
    console.log('oh boy game over n00b');
}

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
        var fallingItem = stage.children[i];
        if(fallingItem.isObstacle) {
            fallingItem.x -= 8;
            obstacleCollision(catcher, fallingItem);
            if(fallingItem.x < (-fallingItem.width)) {
                childrenToDelete.push(fallingItem);
                fallingItem.destroy();
                --obstacleCount;
            }
        }
        if (fallingItem.isFood) {
            var deltaY = fallingItem.velocity * deltaTime;
            var deltaVy = fallingItem.accelerationY * deltaTime;
            fallingItem.y += deltaY;
            fallingItem.velocity += deltaVy;
            fallingItem.rotation += fallingItem.rotateFactor;
             if (fallingItem.y > GAME_HEIGHT) {
                childrenToDelete.push(fallingItem);
                fallingItem.destroy();
                --foodCount;
            }
            try {
                if (isCollide(catcher, fallingItem)) {
                    childrenToDelete.push(fallingItem);
                    fallingItem.destroy();
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
        console.log("game over");
        state = leaderBoardMenu;
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

function addScore() {
      score.x = GAME_WIDTH - 100;
      score.y = GAME_HEIGHT - 50;
      score.anchor.x = 0.5;
      score.text = 'Score: ' + scoreCount;
      stage.addChild(score);
}
