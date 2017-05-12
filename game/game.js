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
/*
    Initializes Game and countdown
*/
function gameInit() {
    if(gameBuild) {
        countDownIndex = 0;
        var three = PIXI.Sprite.fromImage('assets/img/sprites/cd-3.png');
        var two = PIXI.Sprite.fromImage('assets/img/sprites/cd-2.png');
        var one = PIXI.Sprite.fromImage('assets/img/sprites/cd-1.png');
        var go = PIXI.Sprite.fromImage('assets/img/sprites/cd-go.png');
        countDownNumbers = [three, two, one, go];
        countDown();
        timer.push(setTimeout(makeSprites, 5000));
        catcher = new Sprite(
            resources['assets/img/sprites/basket.png'].texture
        );
        //Catcher movement
        catcher.alpha = 1;
        catcher.y = GAME_HEIGHT / 2;
        catcher.x = GAME_WIDTH / 2;
        catcher.vx = 0;
        catcher.vy = 0;
        catcher.accelerationX = 0;
        catcher.accelerationY = 0;
        catcher.frictionX = 0.5;
        catcher.frictionY = 0.5;
        catcher.speed = 0.2;
        catcher.drag = 0.98;
        catcher.anchor.x = 0.5;
        catcher.anchor.y = 0.5;
        catcher.interactive = true;
        stage.addChild(catcher);
        tk.makeDraggable(catcher);
    }
}

/*
    Initializes menu
*/
function menuInit() {
    if(typeof menuDisplay != 'undefined' && menuDisplay) {
        var childrenToDelete = [];
        for (var i in stage.children) {
            if(stage.children[i].isFood || stage.children[i].isObstacle) {
                childrenToDelete.push(stage.children[i]);
            }
        }
        for (var i = 0; i < childrenToDelete.length; i++) {
            removeItem(childrenToDelete[i]);
        }
    }
}

/*
    Clears all of the countdown timers.
*/
function clearCountDown() {
    for(var i = 0; i < timer.length; i++) {
        clearTimeout(timer[i]);
    }
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

var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
  fontSize: 30,
  fontFamily: 'Arial',
  fill: 'white'
});

/*
    Initializes all of the Intervals for making the food and the obstacles.
*/
function makeSprites() {
    foodInterval = setInterval(makeFood, 100);
    obstacleInterval = setInterval(makeObstacle, 200);
}

var foodCount = 0;

/*
    Makes new food sprites if MAX_FOOD has not been reached.
*/
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

/*
    Removes item from stage.
*/
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

/*
    Main game function.  Goes through each child of the stage, and detects if the
    child is a food or an obstacle, then tests if anything has collided with the
    basket.  If it has collided with the basket, then either increment points,
    or enter game over/leaderboard state.
*/
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

/*
    Makes obstacle if the MAX_OBSTACLE has not been reached.
*/
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

/*
    Tests if the basket has collided with any obstacles.  If it has collided, enter the
    menu state
*/
function obstacleCollision(catcher, obstacle) {
    if (isCollideWholeBasket(catcher, obstacle)) {
        state = menu;
        endGame();
    }
}

/*
    Tests if obstacle has collided with the basket.
*/

function isCollideWholeBasket(basket, obstacle) {
    var xoffset = basket.width / 2;
    var yoffset = basket.height / 2;
    return !(((basket.y + basket.height - yoffset) < (obstacle.y)) ||
            ((basket.y - yoffset) > (obstacle.y + obstacle.height)) ||
            ((basket.x + basket.width - xoffset - 12) < obstacle.x) ||
            ((basket.x - xoffset + 12)> (obstacle.x + obstacle.width)));
}

var scoreVisible;

/*
    Adds score to the screen
*/
function addScore() {
    if (!scoreVisible)
        score.x = GAME_WIDTH - 100;
    score.y = GAME_HEIGHT - 50;
    score.anchor.x = 0.5;
    score.text = 'Score: ' + scoreCount;
    stage.addChild(score);
    scoreVisible = true;
}

/*
    Hides the score from the screen
*/
function hideScore() {
    if (scoreVisible) {
        stage.removeChild(score);
        scoreVisible = false;
    }
}

/*
    Clears all of the intervals, and sets appropriate variables to zero.
*/
function endGame() {
    clearInterval(foodInterval);
    clearInterval(obstacleInterval);
    scoreCount = 0;
    foodCount = 0;
    obstacleCount = 0;
    catcher.alpha = 0;
}
