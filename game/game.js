/*
*   game.js
*   Main file for Food Fall!
 */

// Speed of Game
sizeOfEntry = 3;
var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
  fontSize: 30,
  fontFamily: 'Arial',
  fill: 'white'
});

function gameInit() {
    if(gameStart) {
        countDownIndex = 0;
        afterCountDown = false;
        var three = new Sprite(resources['assets/img/sprites/cd-3.png'].texture);
        var two = new Sprite(resources['assets/img/sprites/cd-2.png'].texture);
        var one = new Sprite(resources['assets/img/sprites/cd-1.png'].texture);
        var go = new Sprite(resources['assets/img/sprites/cd-go.png'].texture);
        countDownNumbers = [three, two, one, go];
        gameStartTime = new Date().getTime();

    }
    gameStart = false;

}

/*
    For displaying and removing the numbers for the countdown.
*/
function displayNo() {
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

function leaderBoardMenu() {
    console.log('oh boy game over n00b');
}

var foodCount = 0;
function makeFood() {
    const MAX_FOOD = 5;
    if(foodCount >= MAX_FOOD) return;
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/sprites/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.name = fallingObjects[newFoodIndex];
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
    var currentElapsedGameTime = parseInt((currtime - gameStartTime)/1000);

    console.log(currentElapsedGameTime);

    if(!afterCountDown && currentElapsedGameTime == countDownIndex) {
        displayNo();
        if (currentElapsedGameTime == 4) {
            afterCountDown = true;
        }
    }
    if(afterCountDown) {
        makeFood();
        var childrenToDelete = [];
        for (var i in stage.children) {
            var fallingItem = stage.children[i];
            if (fallingItem.isObstacle) {
                var curObstacle = fallingItem;
                curObstacle.x -= 8;
                obstacleCollision(catcher, curObstacle);
                if(curObstacle.x < (-curObstacle.width)) {
                    childrenToDelete.push(curObstacle);
                    curObstacle.destroy();
                    --obstacleCount;
                    console.log(obstacleCount);
                }
            }
            if (fallingItem.isFood) {
                var deltaY = fallingItem.velocity * deltaTime;
                var deltaVy = fallingItem.accelerationY * deltaTime;
                fallingItem.y += deltaY;
                fallingItem.velocity += deltaVy;
                fallingItem.rotation += fallingItem.rotateFactor;
                 if (fallingItem.y > GAME_HEIGHT) {
                     if (scoreCount > 0) {
                         scoreCount -= 5;
                     }
                     if (scoreCount < 0) {
                         scoreCount = 0;
                     }
                    childrenToDelete.push(fallingItem);
                    fallingItem.destroy();
                    --foodCount;
                }
                try {
                    if (isCollide(catcher, fallingItem)) {
                        modScore(fallingItem);
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

}

var obstacleCount = 0;
function makeObstacle() {
    return;
    const MAX_OBSTACLE = 1;
    if(obstacleCount >= MAX_OBSTACLE) return;

    var newTopObstacle = PIXI.Sprite.fromImage('assets/img/sprites/obstacle.png');
    newTopObstacle.x = newTopObstacle.width + GAME_WIDTH;
    newTopObstacle.height = getRandomInt(50, 300);
    newTopObstacle.y = 0;
    newTopObstacle.width = 50;
    newTopObstacle.isObstacle = true;
    stage.addChild(newTopObstacle);


    var newBotObstacle = PIXI.Sprite.fromImage('assets/img/sprites/obstacle.png');
    newBotObstacle.x =  newTopObstacle.x;
    newBotObstacle.height = getRandomInt(50, 300);
    newBotObstacle.width = newTopObstacle.height;
    newBotObstacle.y = GAME_HEIGHT - newBotObstacle.height;
    newBotObstacle.isObstacle = true;
    stage.addChild(newBotObstacle);
    // const MAX_OBSTACLE = 2;
    //     if(obstacleCount >= MAX_OBSTACLE) return;
    //     var newObstacle = PIXI.Sprite.fromImage('assets/img/sprites/obstacle.png');
    //     newObstacle.x = newObstacle.width + GAME_WIDTH;
    //     newObstacle.height = getRandomInt(50, 300);
    //     newObstacle.y = GAME_HEIGHT - newObstacle.height;
    //     newObstacle.width = 50;
    //     newObstacle.isObstacle = true;
    //     ++obstacleCount;
    //     stage.addChild(newObstacle);
    ++obstacleCount;

}
/*
    need xspeed
*/
function bounce() {

}

function obstacleCollision(catcher, obstacle) {
    if (isCollideWholeBasket(catcher, obstacle)) {
        console.log("game over");
        // state = leaderBoardMenu;
    }
}

function isCollideWholeBasket(basket, obstacle) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    return !(((basket.y + basket.height - yoffset) < (obstacle.y)) ||
            ((basket.y - yoffset) > (obstacle.y + obstacle.height)) ||
            ((basket.x + basket.width - xoffset) < obstacle.x) ||
            ((basket.x -xoffset)> (obstacle.x + obstacle.width)));
}

function addScore() {
      score.x = GAME_WIDTH - 100;
      score.y = GAME_HEIGHT - 50;
      score.anchor.x = 0.5;
      score.text = 'Score: ' + scoreCount;
      stage.addChild(score);
}
/**
 * Returns the name of the given food.
 * @param food the food to decipher.
 */
function getFoodType(food) {
    return food.name;
}

/**
 * Modifies the score based on the type of food given.
 * @param food
 */
function modScore(food) {
    var type = getFoodType(food);
    if (type.name === "apple") {
        scoreCount += 3;
    }
    if (type.name === "bread") {
        scoreCount += 2;
    }
}
