// Stage-size parameters; aspect ratio.
var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;

//Variables
var catcher;
var apple;
var maxXspeed = 50;
var maxYspeed = 25;

//Aliases.
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// Rendering Options.
var rendererOptions = {
    antiAliasing: false,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoResize: true
};

// Create renderer.
var renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, rendererOptions);

// Create new Container for stage.
var stage = new Container();

// Renderer position on screen.
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = (GAME_WIDTH / 2) - (stage.width / 2); // Centers window.

// Resize the stage depending on size of window.
resize();

// Add renderer to page.
document.body.appendChild(renderer.view);

// Resize screen when window size is adjusted.
window.addEventListener("resize", resize);

// Texture Cache
loader
    .add([
        "assets/img/entities/basket.png",
        "assets/img/entities/basket_bottom.png",
        "assets/img/food/apple.png",
        "assets/img/food/banana.png",
        "assets/img/food/bread.png",
        "assets/img/food/broccoli.png",
        "assets/img/food/orange.png"
    ])
    .on("progress", loadProgressHandler)
    .load(setup);

/*
Prints loading log to console.
 */
function loadProgressHandler() {
    console.log("loading");
}


var catcher;
var apple = {name:"apple", weight:0.2, sprite: 0};
var banana = {name:"banana", weight:0.2, sprite: 0};
var bread = {name:"bread", weight:0.2, sprite: 0};
var orange = {name:"orange", weight:0.2,sprite: 0};
var broccoli = {name:"broccoli", weight:0.2, sprite: 0};

fallingObjects = [apple, banana, bread, orange, broccoli];

/*
Main game driver.
 */
function setup() {

    console.log("setup");

    //Setting up sprites
    catcher = new Sprite(
        resources['assets/img/entities/basket.png'].texture
    );

    apple.sprite  = new Sprite(
        resources['assets/img/food/apple.png'].texture
    );

    banana.sprite = new Sprite(
        resources['assets/img/food/banana.png'].texture
    );

    bread.sprite = new Sprite(
        resources['assets/img/food/bread.png'].texture
    );

    orange.sprite = new Sprite(
        resources['assets/img/food/orange.png'].texture
    );

    broccoli.sprite = new Sprite(
        resources['assets/img/food/broccoli.png'].texture
    );

    //Catcher movement
    catcher.y = GAME_HEIGHT / 2;
    catcher.x = GAME_WIDTH / 2;
    catcher.vx = 0;
    catcher.vy = 0;
    catcher.accelerationX = 0;
    catcher.accelerationY = 0;
    catcher.frictionX = 1;
    catcher.frictionY = 1;
    catcher.speed = 0.2;
    catcher.drag = 0.9;

    keycontrol();

    // Add sprites to stage
    stage.addChild(catcher);

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    //Start the game loop
    gameLoop();

}
setInterval(makeFood, 1000);

function myFunction() {

    alert("Hello");
}
//Set the game's current state to `play`:
var state = play;

//Animation loop
function gameLoop() {

    // //Loop this function 60 times per second
    for (var i in stage.children) {
        if(i == 0) {
            continue;
        }
        var item = stage.children[i];
        item.y += 2;
        item.rotation += 1000 * (item.anchor.x - 0.5);
        if (item.y == GAME_HEIGHT)  {
            console.log("literally dying");
            item.destroy();
        }
        //returns the bounds of the basker {x x}
    }
    requestAnimationFrame(gameLoop);
    // foodFalling(fallingObjects[0]);

    state();

    //Render the stage
    renderer.render(stage);
}


//State definition for "playing" the game
function play() {

    //Implementing acceleration
    catcher.vx += catcher.accelerationX;
    catcher.vy += catcher.accelerationY;

    //Implementing friction
    catcher.vx *= catcher.frictionX;
    catcher.vy *= catcher.frictionY;

    //Implementing movement
    catcher.x += catcher.vx;
    catcher.y += catcher.vy;
}

//Keyboard Controls Definition
function keycontrol() {
    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function () {

        //Change the catcher velocity when the key is pressed
        if (catcher.vx > -maxXspeed) {
            catcher.accelerationX = -catcher.speed;
            catcher.frictionX = 1;
        }
    };

    //Left arrow key `release` method
    left.release = function () {

        /*If the left arrow has been released, and the right arrow isn't down,
        and the catcher isn't moving vertically, Stop the catcher*/
        if (!right.isDown) {
            catcher.accelerationX = 0;
            // catcher.frictionX = catcher.drag;
        }
    };

    //Up
    up.press = function () {
        catcher.accelerationY = -catcher.speed;
        catcher.frictionY = 1;
    };
    up.release = function () {
        if (!down.isDown) {
            catcher.accelerationY = 0;
            catcher.frictionY = catcher.drag;
        }
    };

    //Right
    right.press = function () {
        if (catcher.vx < maxXspeed) {
            catcher.accelerationX = catcher.speed;
            catcher.frictionX = 1;
        }
    };
    right.release = function () {
        if (!left.isDown) {
            catcher.accelerationX = 0;
            catcher.frictionX = catcher.drag;
        }
    };

    //Down
    down.press = function () {
        catcher.accelerationY = catcher.speed;
        catcher.frictionY = 1;
    };
    down.release = function () {
        if (!up.isDown) {
            catcher.accelerationY = 0;
            catcher.frictionY = catcher.drag;
        }
    };
}

function makeFood() {
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/food/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.x = getRandomInt(0, GAME_WIDTH);
    newFood.anchor.x = 0.5 + (0.0001 * Math.random());
    console.log("asdf" + newFood.anchor.x);
    newFood.anchor.y = 0.5;
    // newFood.rotation = Math.random() * 0.01;
    stage.addChild(newFood);
}

/*
Resize canvas to fit the size of the window.
 */
function resize() {

    // Determine which screen dimension is most constrained
    var ratio = Math.min(window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT);

    // Scale the view appropriately to fill that dimension
    stage.scale.x = stage.scale.y = ratio;

    // Update the renderer dimensions
    renderer.resize(Math.ceil(GAME_WIDTH * ratio),
        Math.ceil(GAME_HEIGHT * ratio));

}


//Keyboard object definition
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function weightedRand(weightedList) {
  var i;
  var sum = 0;
  var r = Math.random();
  for (i in weightedList) {
    sum += weightedList[i].weight;
    if (r <= sum)
        return i;
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
