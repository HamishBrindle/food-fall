/*
 *   game.js
 *   Main file for Food Fall!
 */

// Speed of Game
var scoreCount = 0;

var childrenToDelete = [];
const foodFadeDuration = 1;
const displayNoFadeDuration = 100;

var lastXPos = 0;

var score = new PIXI.Text('Score: ', {
    fontSize: 30,
    fontFamily: 'Arial',
    fill: 'white'
});


function gameInit() {
    if(gameBuild) {
        obstacleCount = 0;
        countDownIndex = 0;
        foodCount = 0;
        scoreCount = 0;
        afterCountDown = false;
        var three = new Sprite(resources['assets/img/sprites/cd-3.png'].texture);
        var two = new Sprite(resources['assets/img/sprites/cd-2.png'].texture);
        var one = new Sprite(resources['assets/img/sprites/cd-1.png'].texture);
        var go = new Sprite(resources['assets/img/sprites/cd-go.png'].texture);
        countDownNumbers = [three, two, one, go];
        gameBuildTime = new Date().getTime();
        initCatcher();
        catcher.alpha = 1;
        score.alpha = 1;
    }
    gameBuild = false;

}

/*
    For displaying and removing the numbers for the countdown.
*/
function displayNo() {
    if(countDownIndex >= 4) return;
    var curNum = countDownNumbers[countDownIndex];
    stage.addChild(curNum);
    curNum.x = 100;
    curNum.y = 50;
    fadeOut(curNum, displayNoFadeDuration);
    ++countDownIndex;
}

function leaderBoardMenu() {
    console.log('oh boy game over n00b');
}

function makeFood() {
    const MAX_FOOD = 10;
    if(foodCount >= MAX_FOOD) return;
    ++foodCount;
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/sprites/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.name = fallingObjects[newFoodIndex];
    newFood.x = getRandomInt(newFood.width, GAME_WIDTH - newFood.width);
    newFood.y = -newFood.height;
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    newFood.isFood = true;
    newFood.velocityY = 0; //10 pixels per second
    newFood.velocityX = 0;
    newFood.accelerationY = 210; //
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;

    stage.addChild(newFood);
}

function removeItem(childToDelete) {
    stage.removeChild(childToDelete);
}

// Determine if basket and food are colliding
function isInBasket(basket, food) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    var upperLeft = {x:basket.x - xoffset, y:basket.y - yoffset};
    var lowerRight = {x:(basket.x + basket.width - xoffset), y:(basket.y + 10 - yoffset)};

    var inBasket = (food.x > upperLeft.x) && ((food.y + food.height) > upperLeft.y)
        && (food.x < lowerRight.x) && ((food.y + food.height) < lowerRight.y);
    return inBasket;
}

function isBounceCollide(basket, food) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    var upperLeftBasket = {x:basket.x - xoffset, y:basket.y - yoffset - 10};
    var lowerRightBasket = {x:(basket.x + basket.width - xoffset), y:(basket.y + basket.height - yoffset)};

    var upperLeftFood = {x:food.x, y:food.y};
    var lowerRightFood = {x:food.x + food.width, y:food.y + food.height};

    // var upperLeftFood_upperLeftBastket = (upperLeftFood.x > upperLeftBasket.x) && (upperLeftFood.y > upperLeftBasket.y);
    // var upperLeftFood_lowerRightBasket = (upperLeftFood.x < lowerRightBasket.x) && (upperLeftFood.y < lowerRightBasket.y);
    // var lowerRightFood_upperLeftBasket = (lowerRightFood.x > upperLeftBasket.x) && (lowerRightFood.y > upperLeftBasket.y);
    // var lowerRightFood_lowerRightBasket = (lowerRightFood.x < lowerRightBasket.x) && (lowerRightFood.y < lowerRightBasket.y);
    // //
    // console.log("upperLeftFood_upperLeftBastket", upperLeftFood_upperLeftBastket);
    // console.log("upperLeftFood_lowerRightBasket", upperLeftFood_lowerRightBasket);
    // console.log("lowerRightFood_upperLeftBasket", lowerRightFood_upperLeftBasket);
    // console.log("lowerRightFood_lowerRightBasket", lowerRightFood_lowerRightBasket);

    var bounceOffBasket = (upperLeftFood.x > upperLeftBasket.x) && (upperLeftFood.y > upperLeftBasket.y)
        && (upperLeftFood.x < lowerRightBasket.x) && (upperLeftFood.y < lowerRightBasket.y)
        || (lowerRightFood.x > upperLeftBasket.x) && (lowerRightFood.y > upperLeftBasket.y)
        && (lowerRightFood.x < lowerRightBasket.x) && (lowerRightFood.y < lowerRightBasket.y);
        console.log("bounceOffBasket", bounceOffBasket);

    return bounceOffBasket;
}
function foodCatchCollision() {
    var currtime = new Date().getTime();
    var deltaTime = parseFloat((currtime - lastTime)/1000);
    var currentElapsedGameTime = parseInt((currtime - gameBuildTime)/1000);
    var currXPos = catcher.x;
    // console.log("currXPos", currXPos);
    // console.log("lastXPos", lastXPos);
    // console.log("deltaTime", deltaTime);

    var catcherVelocityX = (lastXPos - currXPos) / deltaTime;
    // console.log("catcherVelocityX", catcherVelocityX);
    // if(!afterCountDown && currentElapsedGameTime == countDownIndex) {
    //     displayNo();
    //     if (currentElapsedGameTime == 4) {
    //         afterCountDown = true;
    //     }
    // }
    if(true) {
        lastXPos = catcher.x;
        makeFood();
        makeObstacle();
        for (var i in stage.children) {
            var fallingItem = stage.children[i];
            if (fallingItem.isObstacle) {
                var curObstacle = fallingItem;
                if(curObstacle.x < (-curObstacle.width)) {
                    childrenToDelete.push(curObstacle);
                    curObstacle.destroy();
                    --obstacleCount;
                }else {
                    curObstacle.x -= backgroundScrollSpeed.grass;
                    obstacleCollision(catcher, curObstacle);
                }
            }
            if (fallingItem.isFood) {

                var deltaY = fallingItem.velocityY * deltaTime;
                var deltaVy = fallingItem.accelerationY * deltaTime;

                fallingItem.y += deltaY;
                fallingItem.x += fallingItem.velocityX;

                fallingItem.velocityY += deltaVy;
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
                } else if (isInBasket(catcher, fallingItem)) {
                    modScore(fallingItem);
                    childrenToDelete.push(fallingItem);
                    --foodCount;
                    fallingItem.destroy();
                    coin.play('coin');
                    scoreCount += 10;
                    stage.removeChild(score);
                } else if (isBounceCollide(catcher, fallingItem)) {
                        console.log("collide part of box");
                        console.log("catcherVelocityX", catcherVelocityX);
                        console.log("fallingItem.velocityX", fallingItem.velocityX);
                        fallingItem.velocityX = -(1000 / catcherVelocityX);
                }
            }
        }
        for (var i = 0; i < childrenToDelete.length; i++) {
            removeItem(childrenToDelete[i]);
        }
    }

}

function makeObstacle() {
    const MAX_OBSTACLE = 1;
    if(obstacleCount >= MAX_OBSTACLE) return;

    var newTopObstacle = new Sprite(resources['assets/img/sprites/obstacle.png'].texture);
    newTopObstacle.x = GAME_WIDTH;
    newTopObstacle.height = getRandomInt(30, (2 * (GAME_HEIGHT / 3))); //
    newTopObstacle.y = 0;
    newTopObstacle.width = 50;
    newTopObstacle.isObstacle = true;
    stage.addChild(newTopObstacle);

    var newBotObstacle = new Sprite(resources['assets/img/sprites/obstacle.png'].texture);
    newBotObstacle.x =  newTopObstacle.x;
    newBotObstacle.y = newTopObstacle.height + (2 * catcher.height);//newBotObstacle.height ;
    newBotObstacle.height = GAME_HEIGHT - newBotObstacle.y;
    newBotObstacle.width = newTopObstacle.width;
    newBotObstacle.isObstacle = true;
    stage.addChild(newBotObstacle);
    obstacleCount += 2;

}
/*
 need xspeed
 */
function bounce() {

}

function obstacleCollision(catcher, obstacle) {
    if (isCollideObstacle(catcher, obstacle)) {
        endGame();
        state = menu;
        catcher.alpha = 0;
    }
}

function isCollideObstacle(basket, obstacle) {
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

function endGame() {
    menuBuild = true;
    gameBuild = true;
    score.alpha = 0;
    destroyOldObjects();
}
/**
  * Adds all food and obstacles to list and destroys them.
  */
function destroyOldObjects () {
    for (var i in stage.children) {
        var item = stage.children[i];
        if(item.isFood || item.isObstacle || item.name == 'score') {
            childrenToDelete.push(stage.children[i]);
        }
    }
    for (var i = 0; i < childrenToDelete.length; i++) {
        removeItem(childrenToDelete[i]);
        childrenToDelete[i].destroy()
    }
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
