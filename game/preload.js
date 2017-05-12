// Stage-size parameters; aspect ratio.

var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;

//Variables
var maxXspeed = 50;
var maxYspeed = 25;
var backgroundScrollSpeed = {
    mtnFar: 0,
    mtnMid: 0.25,
    clouds: -0.5,
    trees: 0.5,
    grass: 4
};

// Background textures
var sky,
    mtnFar,
    mtnMid,
    ground,
    clouds,
    trees,
    grass;

// Adjust to speed/slow background scrolling.
var BG_RATE = 100;

var lastTime;

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

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
    autoResize: true,
    view: document.getElementById('game-canvas')
};

// Create renderer.
var renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, rendererOptions);

// Create new Container for stage.
var stage = new Container();

// Renderer position on screen.
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px"; // Centers window.


//Globals -------------------------------------------------------------------------------Globals

// Player controlled basket
var catcher;

//  Tink.js object
var tk;

//  Scalefactor amount
var scale = scaleToWindow(renderer.view);

var setupdone = false;

// Pointer Object for Mouse and Touch
var pointer;

// Texture Cache
loadBackgroundTextures();

loader
    .add([
        "assets/img/sprites/basket.png",
        "assets/img/sprites/basket_bottom.png",
        "assets/img/sprites/apple.png",
        "assets/img/sprites/banana.png",
        "assets/img/sprites/bread.png",
        "assets/img/sprites/broccoli.png",
        "assets/img/sprites/orange.png"
    ])
    .on("progress", loadProgressHandler)
    .load(setup);


function initBackground() {

    /*
     Layer order:
     sky | mtnFar | mtnMid | ground | clouds | trees | grass
     */
    sky =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.sky.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(sky);

    clouds =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.clouds.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(clouds);

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

    trees =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.trees.texture,
            GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(trees);

    grass =
        new PIXI.extras.TilingSprite(PIXI.loader.resources.grass.texture,
            GAME_WIDTH, GAME_HEIGHT);
    sky.isBackground = true;
    clouds.isBackground = true;
    mtnFar.isBackground = true;
    mtnMid.isBackground = true;
    ground.isBackground = true;
    trees.isBackground = true;
    grass.isBackground = true;

    // Prepare for first frame of game loop/animation
    lastTime = new Date().getTime();

}

function animateBackground() {

    // Determine seconds elapsed since last frame
    var currtime = new Date().getTime();
    var delta = (currtime - lastTime) / 1000;

// Scroll the terrain
    mtnFar.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.mtnFar;
    clouds.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.clouds;
    mtnMid.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.mtnMid;
    trees.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.trees;
    grass.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.grass;

    // Draw the stage and prepare for the next frame
    lastTime = currtime;

    if (mtnFar.tilePosition.x > mtnFar.width - window.width) {
        mtnFar.destroy();
    }
}

function loadBackgroundTextures() {
    loader.add("sky", "assets/img/tiling-sprites/sky.png");
    loader.add("mtnFar", "assets/img/tiling-sprites/mtn-far.png");
    loader.add("mtnMid", "assets/img/tiling-sprites/mtn-mid.png");
    loader.add("ground", "assets/img/tiling-sprites/ground.png");
    loader.add("clouds", "assets/img/tiling-sprites/clouds.png");
    loader.add("trees", "assets/img/tiling-sprites/trees.png");
    loader.add("grass", "assets/img/tiling-sprites/grass.png");
}

/*
 Prints loading log to console.
 */
function loadProgressHandler() {
    console.log("loading");
}

var apple = {name: "apple", weight: 0.2};
var banana = {name: "banana", weight: 0.2};
var bread = {name: "bread", weight: 0.2};
var orange = {name: "orange", weight: 0.2};
var broccoli = {name: "broccoli", weight: 0.2};

fallingObjects = [apple, banana, bread, orange, broccoli];

/*
 Main game driver.
 */
function setup() {

    // Initialize the the tiling-sprites background
    initBackground();
    // Initialize the the level background
    keyControls();


    // Add sprites to stage
    stage.addChild(grass);

    tk = new Tink(PIXI, renderer.view, scale);

    //Touch and Mouse Controls
    pointer = tk.makePointer();
    //Pointer Definition

    setupdone = true;

    // Resize screen when window size is adjusted.
    window.addEventListener("resize", function (event) {
        let scale = scaleToWindow(renderer.view);
        tk.scale = scale;
    });

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    //Start the game loop
    gameLoop();

}
//Set the game's current state to `play`:
var state = menu;

//Animation loop
function gameLoop() {
    stats.begin();
    state();
    lastTime = new Date().getTime();
    tk.update();
    requestAnimationFrame(gameLoop);
    stats.end();
}

//State definition for "playing" the game
function play() {
    gameInit();
    gameBuild = false;
    menuDisplay = true;
    foodCatchCollision();
    animateBackground();
    playerMovement();
    addScore();
    hideMenu();
    renderer.render(stage);
}

//State definition for leaderboard
function leaderBoard() {
    animateBackground();
    foodCatchCollision();
    hideScore();
    dbInsert();
    displayLeader();
    renderer.render(stage);
}

//Inserts highscore into database
function dbInsert() {
    //firebase injections here
}

function menu() {
    menuInit();
    gameBuild = true;
    menuDisplay = false;
    animateBackground();
    foodCatchCollision();
    hideScore();
    displayMenu();
    renderer.render(stage);
    // This is what animates play
}
