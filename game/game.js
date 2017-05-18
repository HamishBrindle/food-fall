/*
 *   game.js
 *   Main file for Food Fall!
 */

// Speed of Game
var scoreCount = 0;

var childrenToDelete = [];
const foodFadeDuration = 1;

const displayNoFadeDuration = 100;

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
    newFood.velocity = 0; //10 pixels per second
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
    var currentElapsedGameTime = parseInt((currtime - gameBuildTime)/1000);

    if(!afterCountDown && currentElapsedGameTime == countDownIndex) {
        displayNo();
        if (currentElapsedGameTime == 4) {
            afterCountDown = true;
        }
    }
    if(afterCountDown) {
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
                var deltaY = fallingItem.velocity * deltaTime;
                var deltaVy = fallingItem.accelerationY * deltaTime;
                fallingItem.y += deltaY;
                fallingItem.velocity += deltaVy;
                fallingItem.rotation += fallingItem.rotateFactor;
                 if (fallingItem.y > GAME_HEIGHT) {
                     decreaseScore();
                     childrenToDelete.push(fallingItem);
                     fallingItem.destroy();
                     --foodCount;
                }
                try {
                    if (isCollide(catcher, fallingItem)) {
                        let type = getFoodType(fallingItem);
                        caughtFood.push(type.name);
                        modScore(fallingItem);
                        isCombo();
                        console.log(isCombo());
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
    if (isCollideWholeBasket(catcher, obstacle)) {
        endGame();
        state = gameOver;
        gameOverBuild = true;
        catcher.alpha = 0;
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
var caughtFood = [];
eggCount = 0;

function isCombo() {
    console.log("you've caught : " + caughtFood.length + " foods");
    for (i = 0; i < caughtFood.length; i++) {
        if (caughtFood[i] === "egg") {
            eggCount++;
        }
        console.log("egg count: " + eggCount);
        if (eggCount >= 3) {
            eggCount = 0;
            return true;
        }
    }
    return false;
}
