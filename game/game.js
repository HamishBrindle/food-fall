// Stage-size parameters; aspect ratio.
var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;

//Variables
var catcher;
var apple;
var maxXspeed = 50;
var maxYspeed = 25;

var backgroundScrollSpeed = {
    mtnFar: 0.125,
    mtnMid: 0.25,
    clouds: 0.30,
    trees: -1,
    grass: 2
};

// Background textures
var sky,
    mtnFar,
    mtnMid,
    ground,
    clouds,
    trees,
    grass;

var BG_RATE = 50;
var FG_RATE = 125;

var lastTime;

//Aliases.
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TileSprite = PIXI.extras.TilingSprite;

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
renderer.view.style.left = "0px"; // Centers window.

// Resize the stage depending on size of window.
resize();

// Add renderer to page.
document.body.appendChild(renderer.view);

// Resize screen when window size is adjusted.
window.addEventListener("resize", resize);

// Texture Cache
loadBackgroundTextures();
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
    catcher.y = GAME_HEIGHT / 1.5;
    catcher.x = GAME_WIDTH / 2;
    catcher.vx = 0;
    catcher.vy = 0;
    catcher.accelerationX = 0;
    catcher.accelerationY = 0;
    catcher.frictionX = 0.5;
    catcher.frictionY = 0.5;
    catcher.speed = 0.2;
    catcher.drag = 0.8;

    // Initialize the the level background
    initBackground();

    keyControls();
    // Add sprites to stage
    stage.addChild(catcher);

    stage.addChild(apple);

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    //Start the game loop
    gameLoop();

}
setInterval(makeFood, 4000);

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
        item.rotation += item.rotateFactor;
        if (isCollide(catcher, item)) {
            console.log("collided");
        }
        if (item.y == GAME_HEIGHT)  {
            console.log("literally dying");
            item.destroy();
        }
        //returns the bounds of the basker {x x}
    }
    requestAnimationFrame(gameLoop);
    // foodFalling(fallingObjects[0]);

    state();

    lastTime = new Date().getTime();
    //Render the stage
    renderer.render(stage);
}


//State definition for "playing" the game
function play() {

    animateBackground();

    playerMovement();
}

//Keyboard Controls Definition
function keyControls() {
    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function () {

        //Change the catcher velocity when the key is pressed
        if (catcher.vx > -maxXspeed && catcher.x > 0) {
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
            catcher.frictionX = catcher.drag;
        }
    };

    //Up
    up.press = function () {
        if (catcher.vy > -maxYspeed && catcher.y > GAME_HEIGHT/3) {
            catcher.accelerationY = -catcher.speed;
            catcher.frictionY = 1;
        }
    };
    up.release = function () {
        if (!down.isDown) {
            catcher.accelerationY = 0;
            catcher.frictionY = catcher.drag;
        }
    };

    //Right
    right.press = function () {
        if (catcher.vx < maxXspeed && catcher.x < GAME_WIDTH) {
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
        if (catcher.vy < maxYspeed && catcher.y < GAME_WIDTH)
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

//Binds catcher to part of the screen
function bound() {
    if (catcher.vy < 0 && catcher.y < GAME_HEIGHT / 4) {
        catcher.vy = 0;
    }
    if (catcher.vy > 0 && catcher.y > GAME_HEIGHT * 0.85) {
        catcher.vy = 0;
    }
    if (catcher.vx < 0 && catcher.x < 0) {
        catcher.vx = 0;
    }
    if (catcher.vx > 0 && catcher.x > GAME_WIDTH * 0.85) {
        catcher.vx = 0;
    }
}

function makeFood() {
    var newFoodIndex = weightedRand(fallingObjects);
    var newFood = PIXI.Sprite.fromImage('assets/img/food/' + fallingObjects[newFoodIndex].name + '.png');
    newFood.x = getRandomInt(0, GAME_WIDTH);
    console.log("asdf" + newFood.anchor.x);
    newFood.anchor.x = 0.5;
    newFood.anchor.y = 0.5;
    var randomBoolean = Math.random() >= 0.5;
    if(randomBoolean) {
        newFood.rotateFactor = Math.random() * 0.1;
    }
    else
        newFood.rotateFactor = -Math.random() * 0.1;

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

function playerMovement() {
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

function initBackground() {
    /*
     Layer order:
     sky | mtnFar | mtnMid | ground | clouds | trees | grass
     */

    sky =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.sky.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(sky);

    mtnFar =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.mtnFar.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(mtnFar);

    mtnMid =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.mtnMid.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(mtnMid);

    ground =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.ground.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(ground);

    clouds =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.clouds.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(clouds);

    trees =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.trees.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(trees);

    grass =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.grass.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(grass);

    // Prepare for first frame of game loop/animation
    lastTime = new Date().getTime();

}

function animateBackground() {

    // Determine seconds elapsed since last frame
    var currtime = new Date().getTime();
    var delta = (currtime - lastTime) / 1000;

    // Scroll the terrain
    mtnFar.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.mtnFar;
    mtnMid.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.mtnMid;
    clouds.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.clouds;
    trees.tilePosition.x -= FG_RATE * delta + backgroundScrollSpeed.trees;
    grass.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.grass;

    // Draw the stage and prepare for the next frame
    lastTime = currtime;

}

function loadBackgroundTextures() {

    if (window.devicePixelRatio >= 2 &&
        renderer instanceof PIXI.WebGLRenderer) {
        // WebGL clause works around an apparent issues with
        // TilingSprites on high-res devices using canvas:
        // https://github.com/pixijs/pixi.js/issues/2083
        loader.add("sky", "assets/img/level/sky@2x.png");
        loader.add("mtnFar", "assets/img/level/mtn-far@2x.png");
        loader.add("mtnMid", "assets/img/level/mtn-mid@2x.png");
        loader.add("ground", "assets/img/level/ground@2x.png");
        loader.add("clouds", "assets/img/level/clouds@2x.png");
        loader.add("trees", "assets/img/level/trees@2x.png");
        loader.add("grass", "assets/img/level/grass@2x.png");
    } else {
        loader.add("sky", "assets/img/level/sky.png");
        loader.add("mtnFar", "assets/img/level/mtn-far.png");
        loader.add("mtnMid", "assets/img/level/mtn-mid.png");
        loader.add("ground", "assets/img/level/ground.png");
        loader.add("clouds", "assets/img/level/clouds.png");
        loader.add("trees", "assets/img/level/trees.png");
        loader.add("grass", "assets/img/level/grass.png");
    }
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

// Determine if basket and food are colliding
function isCollide(basket, food) {
  return !(((basket.y + basket.height) < food.y) ||
    (basket.y > (food.y + food.height)) ||
    ((basket.x + basket.width) < food.x) ||
    (basket.x > (food.x + food.width)))
}
