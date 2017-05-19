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
// check the amount of food caught
// resets every 5 seconds in current implementation
var caughtFood = [];

// for combo function
var eggCount = 0;
var cowLevelHasBeenActivated = false;

var score = new PIXI.Text(scoreCount, {
    fontSize: 50,
    fontFamily: 'LemonMilk',
    fill: 'white'
});


function gameInit() {
    if(gameBuild) {
        BG_RATE = 50;
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
        BASKET_HEIGHT = catcher.height;
        BASKET_WIDTH = catcher.width;
        X_OFFSET = BASKET_WIDTH / 2;
        Y_OFFSET = BASKET_HEIGHT / 2;
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

function makeFood() {
    const MAX_FOOD = 5;
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
    newFood.accelerationY = 210;
    newFood.hasBounced = false;
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

    var basketLeftX = basket.x - X_OFFSET;
    var basketRightX = basket.x  + BASKET_WIDTH - X_OFFSET;
    var basketTopY = basket.y - Y_OFFSET;

    // TODO: change naming conventions - Kerry
    var basketBotY = basket.y + BASKET_HEIGHT - Y_OFFSET;

    var upperLeftBasket = {x:basketLeftX, y:basketTopY};
    var lowerRightBasket = {x:basketRightX, y:(basketTopY + 10)};

    var inBasket = (food.x > upperLeftBasket.x) && (food.y > upperLeftBasket.y)
        && (food.x < lowerRightBasket.x) && (food.y < lowerRightBasket.y);
    return inBasket;
}

function isBounce(basket, food, catcherVelocityX) {

    var isBounce = false;
    var foodLeftX = food.x - food.width / 2;
    var foodRightX = food.x + food.width / 2;

    var foodTopY = food.y;
    var foodBotY = food.y + food.height;

    var basketLeftX = basket.x - X_OFFSET;
    var basketRightX = basket.x + BASKET_WIDTH - X_OFFSET;
    var basketTopY = basket.y - Y_OFFSET;
    var basketBotY = basket.y + BASKET_HEIGHT - Y_OFFSET;

    var basketMidLeftX = basketLeftX + 10;
    var basketMidLeftY = basket.height / 2;

    var basketMidRightX = basketRightX - 10;
    var basketMidRightY = basket.height / 2;

    var foodIsLeftOfBasket = (foodLeftX < basketLeftX);
    var foodIsRightOfBasket = (foodRightX > basketRightX);

    var foodJustAboveBasket = (foodTopY < basketTopY) && (foodBotY > basketTopY);
    var foodWithinHeightBasket = (foodTopY > basketTopY) && (foodBotY < basketBotY);
    var foodJustBelowBasket = (foodTopY < basketBotY) && (foodBotY > basketBotY);

    if(foodJustAboveBasket) {
        if (foodIsLeftOfBasket) {
            var upperLeftBasket = {x:basketLeftX, y:basketTopY + 20};
            isBounce = (catcherVelocityX > 0) && (foodRightX > upperLeftBasket.x);
        }
        else if(foodIsRightOfBasket) {
            var upperRightBasket = {x:basketRightX, y:basketTopY};
            isBounce = (catcherVelocityX < 0) && (foodLeftX < upperRightBasket.x);
        }
    } else if(foodWithinHeightBasket) {
        if (foodIsLeftOfBasket) {
            var midLeftBasket = {x:basketMidLeftX, y:basketMidLeftY};
            isBounce =  (catcherVelocityX > 0) && (foodRightX > midLeftBasket.x);
        }
        else if(foodIsRightOfBasket) {
            var midRightBasket = {x:basketMidRightX, y:basketMidRightY};
            isBounce = (catcherVelocityX < 0) && (foodLeftX < midRightBasket.x);
        }
    } else if(foodJustBelowBasket) {
        if(foodIsLeftOfBasket) {
            var lowerLeftBasket = {x:basketLeftX, y:basketBotY};
            isBounce = (catcherVelocityX > 0) && (foodRightX > lowerLeftBasket.x);
        } else if(foodIsRightOfBasket) {
            var lowRightBasket = {x:basketRightX, y:basketBotY};
            isBounce = (catcherVelocityX < 0) && (foodLeftX < lowRightBasket.x);
        }
    }
    return isBounce;
}

function bounceOffBottom(basket, food) {

}

function foodCatchCollision() {
    var currtime = new Date().getTime();
    var deltaTime = parseFloat((currtime - lastTime)/1000);
    var currentElapsedGameTime = parseInt((currtime - gameBuildTime)/1000);
    var currXPos = catcher.x;

    var catcherVelocityX = (lastXPos - currXPos) / deltaTime;
    if(!afterCountDown && currentElapsedGameTime == countDownIndex) {
        displayNo();
        if (currentElapsedGameTime == 4) {
            afterCountDown = true;
        }
    }
    if(afterCountDown) {
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
                    curObstacle.x -= BG_RATE * deltaTime + backgroundScrollSpeed.grass;
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
                    decreaseScore();
                    childrenToDelete.push(fallingItem);
                    fallingItem.destroy();
                    --foodCount;
                } else if (isInBasket(catcher, fallingItem)) {
                    let type = getFoodType(fallingItem);
                    childrenToDelete.push(fallingItem);
                    --foodCount;
                    caughtFood.push(type.name);
                    modScore(fallingItem);
                    isCombo();
                    fallingItem.destroy();
                    gameSFX.play('point');
                    scoreCount += 10;
                    stage.removeChild(score);
                    fallingItem.hasBounced = true;
                } else if (isBounce(catcher, fallingItem, catcherVelocityX)) {
                    // !fallingItem.hasBounced &&
                    fallingItem.hasBounced = true;
                    fallingItem.velocityX = -(1000 / catcherVelocityX);
                }

            }
        }

        if (currentElapsedGameTime % 2 === 0) {
            speedUpGame(deltaTime);
        }

        if (currentElapsedGameTime % 5 === 0) {
            clearCaughtFood();
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
        gameSFX.play('gameOver');
        state = gameOver;
        gameOverBuild = true;
        catcher.alpha = 0;
    }
}

function isCollideObstacle(basket, obstacle) {

    return !(((basket.y + BASKET_HEIGHT - Y_OFFSET) < (obstacle.y)) ||
    ((basket.y - Y_OFFSET) > (obstacle.y + obstacle.height)) ||
    ((basket.x + BASKET_WIDTH - X_OFFSET) < obstacle.x) ||
    ((basket.x -X_OFFSET)> (obstacle.x + obstacle.width)));
}

function addScore() {
    score.x = GAME_WIDTH - 100;
    score.y = GAME_HEIGHT - 50;
    score.anchor.x = 0.5;
    score.text = scoreCount;
    stage.addChild(score);
}

function addHighScore(scoreCount){
    console.log(scoreCount);
    firebase.auth().onAuthStateChanged((user) => {
        //If there is a user signed in
        if(user){
            var scoreInDatabase = firebase.database().ref("users/" + user.uid + "/score");
            scoreInDatabase.on('value', function(scoreSnapshot) {
                if(scoreCount > scoreSnapshot.val()){
                    //update database with new highscore.
                    var updateScore = firebase.database().ref("users/" + user.uid);
                    updateScore.update({
                        score : scoreCount
                    });
                }
            });
        }
    });
}

function endGame() {
    menuBuild = true;
    gameBuild = true;
    addHighScore(scoreCount);
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
 * Sets the amount of food caught to zero when needed.
 */
function clearCaughtFood() {
    caughtFood.length = 0;
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

/**
 * Decrements the score.
 */
function decreaseScore() {
    if (scoreCount > 0) {
        scoreCount -= 5;
    }
    if (scoreCount < 0) {
        scoreCount = 0;
    }
}
/**
 * Shows in logs how much food has been caught for a certain period
 * @returns {boolean} : whether x (3 right now) eggs have been caught.
 */
function isCombo() {
    console.log("you've caught : " + caughtFood.length + " foods");
    for (i = 0; i < caughtFood.length; i++) {
        if (caughtFood[i] === "egg") {
            eggCount++;
        } else {
            eggCount = 0;
        }
        console.log("egg count: " + eggCount);
        if (eggCount >= 1) {
            eggCount = 0;
            if (!cowLevelHasBeenActivated) {
                cowLevelBuild = true;
                state = cowLevel;
                cowLevelHasBeenActivated = !cowLevelHasBeenActivated;
            }
            return true;
        }
    }
    return false;
}
