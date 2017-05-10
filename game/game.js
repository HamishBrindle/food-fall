/*
*   game.js
*   Main file for Food Fall!
 */

// Speed of Game
// setInterval(makeFood, 10);

//Set the game's current state to `play`:
var state = play;
var scoreCount = 0;
var score = new PIXI.Text('Score: ', {
  fontSize: 30,
  fontFamily: 'Arial',
  fill: 'white'
});

//Animation loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    lastTime = new Date().getTime();
    renderer.render(stage);
}

//State definition for "playing" the game
function play() {
    // foodCatchCollision();
    animateBackground();
    // playerMovement();
    // addScore();
}

var foodCount = 0;
function makeFood() {
    const MAX_FOOD = 5;
    if(foodCount >= MAX_FOOD) return;
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/food/' + fallingObjects[newFoodIndex].name + '.png');
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

function removeFood(childToDelete) {
    --foodCount;
    console.log("foodCount ", foodCount);
    stage.removeChild(childToDelete);
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
    // var currtime = new Date().getTime();
    // var deltaTime = parseFloat((currtime - lastTime)/1000);
    // var childrenToDelete = [];
    // for (var i in stage.children) {
    //     var fallingItem = stage.children[i];
    //     if (fallingItem.isFood) {
    //         var deltaY = fallingItem.velocity * deltaTime;
    //         var deltaVy = fallingItem.accelerationY * deltaTime;
    //         fallingItem.y += deltaY;
    //         fallingItem.velocity += deltaVy;
    //         fallingItem.rotation += fallingItem.rotateFactor;
    //          if (fallingItem.y > GAME_HEIGHT) {
    //             childrenToDelete.push(fallingItem);
    //             fallingItem.destroy();
    //         }
    //         try {
    //             if (isCollide(catcher, fallingItem)) {
    //                 childrenToDelete.push(fallingItem);
    //                 fallingItem.destroy();
    //                 sound.play('coin');
    //                 scoreCount += 10;
    //                 stage.removeChild(score);
    //             }
    //         } catch(err) {}
    //     }
    // }
    // for (var i = 0; i < childrenToDelete.length; i++) {
    //     removeFood(childrenToDelete[i]);
    // }
}

function addScore() {
      score.x = GAME_WIDTH - 100;
      score.y = GAME_HEIGHT - 50;
      score.anchor.x = 0.5;
      score.text = 'Score: ' + scoreCount;
      stage.addChild(score);
}
