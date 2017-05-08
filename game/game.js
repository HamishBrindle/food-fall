/*
*   game.js
*   Main file for Food Fall!
 */

// Speed of Game
setInterval(makeFood, 1000);

//Set the game's current state to `play`:
var state = play;



//Animation loop
function gameLoop() {
    var frameRate = 1000 / ((new Date().getTime()) - lastTime);
    console.log("frameRate ", frameRate);
    // requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);
    lastTime = new Date().getTime();

    setTimeout(gameLoop, 1000 / 45);
}

//State definition for "playing" the game
function play() {
    foodCatchCollision();
    animateBackground();
    playerMovement();
}

var foodCount = 0;
function makeFood() {
    const MAX_FOOD = 5;
    if(foodCount >= MAX_FOOD) return;

    var newFoodIndex = weightedRand(fallingFood);
    var newFood = PIXI.Sprite.fromImage('assets/img/food/' + fallingFood[newFoodIndex].name + '.png');
    newFood.x = getRandomInt(newFood.width, GAME_WIDTH - newFood.width);
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    newFood.isFood = true;
    newFood.velocity = 0; //10 pixels per second
    newFood.accelerationY = 90; //
    newFood.collideOne = false;
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;
    foodCount++;
    stage.addChild(newFood);
}

function removeFood(childToDelete) {
    console.log("removing")
    stage.removeChild(childToDelete);
    foodCount--;
}
// Determine if basket and food are colliding
function isCollide(basket, food) {
    var upperLeft = {x:basket.x, y:basket.y};
    var lowerRight = {x:(basket.x + basket.width), y:(basket.y + 10)};
    var inBasket = (food.x > upperLeft.x) && (food.y > upperLeft.y)
                    && (food.x < lowerRight.x) && (food.y < lowerRight.y);
    return inBasket;
}

function foodCatchCollision() {
    var deltaTime = (new Date().getTime()) - lastTime;
    var childrenToDelete = [];
    for (var i in stage.children) {
        var fallingItem = stage.children[i];
        if (fallingItem.isFood) {
            var deltaY = fallingItem.velocity * deltaTime / 1000;
            var deltaVy = fallingItem.accelerationY * deltaTime / 1000;
            fallingItem.y += deltaY;
            fallingItem.velocity += deltaVy;
            fallingItem.rotation += fallingItem.rotateFactor;
             if (fallingItem.y > GAME_HEIGHT) {
                childrenToDelete.push(fallingItem);
                fallingItem.destroy();
                console.log("destroyed, ", fallingItem);
            }
            try {
                if (isCollide(catcher, fallingItem)) {
                    childrenToDelete.push(fallingItem);
                    fallingItem.destroy();
                    console.log("destroyed, ", fallingItem);
                    sound.play('coin');
                }
            } catch(err) {console.log("incatch", err);}
        }
    }
    for (var i = 0; i < childrenToDelete.length; i++) {
        removeFood(childrenToDelete[i]);
    }
}
