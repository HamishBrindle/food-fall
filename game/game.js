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


/*
Main game driver.
 */
function setup() {

    console.log("setup");

    //Setting up sprites
    catcher = new Sprite(
        resources['assets/img/entities/basket.png'].texture
    );
    apple = new Sprite(
        resources["assets/img/food/apple.png"].texture
    );

    //Catcher movement
    catcher.y = GAME_HEIGHT / 1.5;
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

    //Debugg
    console.log(renderer.width);
    console.log(renderer.height);

    // Add sprites to stage
    stage.addChild(catcher);
    stage.addChild(apple);

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    //Start the game loop
    gameLoop();

}

//Set the game's current state to `play`:
var state = play;

//Animation loop
function gameLoop() {

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

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

    //Restrict movement
    bound();
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
        if (catcher.vx > -maxXspeed && catcher.x > 0) {
            catcher.accelerationX = -catcher.speed;
            catcher.frictionX = 1;
        }
    };

    //Left arrow key `release` method
    left.release = function () {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the catcher isn't moving vertically:
        //Stop the catcher
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
    if (catcher.vy > 0 && catcher.y > GAME_HEIGHT * 0.9) {
        catcher.vy = 0;
    }
    if (catcher.vx < 0 && catcher.x < 0) {
        catcher.vx = 0;
    }
    if (catcher.vx > 0 && catcher.x > GAME_WIDTH * 0.9) {
        catcher.vx = 0;
    }
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

