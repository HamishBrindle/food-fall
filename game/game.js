/*
*   game.js
*   Main file for Food Fall!
 */



// Speed of Game
setInterval(makeFood, 1000);

//Set the game's current state to `play`:
var state = play;
var scoreCount = 0;

//Animation loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    lastTime = new Date().getTime();
    renderer.render(stage);
}

//State definition for "playing" the game
function play() {
    foodCatchCollision();
    animateBackground();
    playerMovement();
    addScore();
}


function makeFood() {
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/food/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.x = getRandomInt(0, GAME_WIDTH);
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    newFood.isFood = true;
    var randomBoolean = Math.random() >= 0.5;
    if (randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;

    stage.addChild(newFood);
}

// Determine if basket and food are colliding
function isCollide(basket, food) {
    return !(((basket.y + basket.height) < food.y) ||
    (basket.y > (food.y + food.height)) ||
    ((basket.x + basket.width) < food.x) ||
    (basket.x > (food.x + food.width)))
}

function foodCatchCollision() {
    // //Loop this function 60 times per second
    for (var i in stage.children) {
        if (i == 0) {
            continue;
        }
        var item = stage.children[i];
        if (item.isFood) {
            item.y += 2;
            item.rotation += item.rotateFactor;
            if (isCollide(catcher, item)) {
                item.destroy();
                sound.play('coin');
                scoreCount++;
            }
            else if (item.y === GAME_HEIGHT) {
                item.destroy();
            }
        }
      }
    }

    function addScore() {
      var score = new PIXI.Text('Score: ', {
        fontSize: 30,
        fontFamily: 'Arial',
        fill: '#FF69B4'
      });
      score.x = GAME_WIDTH - 100;
      score.y = GAME_HEIGHT - 50;
      score.anchor.x = 0.5;
      score.text = 'Score: ' + scoreCount;
      stage.addChild(score);
    }
