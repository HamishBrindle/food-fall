// Stage-size parameters; aspect ratio.

var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;
var gameboundw = GAME_WIDTH;
var gameboundh = GAME_HEIGHT;
/*
    TO DO: ADD SPRITES TO ONE CONTAINER IN ORDER TO OPTIMIZE REFRESH
    REDUCE LAG

    https://github.com/kittykatattack/learningPixi/blob/master/README.md

    control + f: var superFastSprites = new ParticleContainer();

    We will also need to put scorebar in it's own container, and add children
    to make incremental changes.
*/
//Variables
var maxXspeed = 50;
var maxYspeed = 25;

var backgroundScrollSpeed = {
    mtnFar: 5.4,
    mtnMid: 5.5,
    clouds: 6,
    trees: 4,
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
    Sprite = PIXI.Sprite;

// Rendering Options.
var rendererOptions = {
    antiAliasing: false,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoResize: true
};

// Create renderer.
var renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, myView, rendererOptions);

// Create new Container for stage.
var stage = new Container();

// Renderer position on screen.
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px"; // Centers window.

// Resize the stage depending on size of window.
resize();

// Add renderer to page.
document.getElementById("game-window").appendChild(renderer.view);

// Resize screen when window size is adjusted.
window.addEventListener("resize", resize);

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
    gameboundw = Math.ceil(GAME_WIDTH * ratio);
    gameboundh = Math.ceil(GAME_HEIGHT * ratio);
    console.log("gboundw" + gameboundw);
    console.log("gboundh" + gameboundh);
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
        loader.add("sky", "assets/img/tiling-sprites/sky@2x.png");
        loader.add("mtnFar", "assets/img/tiling-sprites/mtn-far@2x.png");
        loader.add("mtnMid", "assets/img/tiling-sprites/mtn-mid@2x.png");
        loader.add("ground", "assets/img/tiling-sprites/ground@2x.png");
        loader.add("clouds", "assets/img/tiling-sprites/clouds@2x.png");
        loader.add("trees", "assets/img/tiling-sprites/trees@2x.png");
        loader.add("grass", "assets/img/tiling-sprites/grass@2x.png");
    } else {
        loader.add("sky", "assets/img/tiling-sprites/sky.png");
        loader.add("mtnFar", "assets/img/tiling-sprites/mtn-far.png");
        loader.add("mtnMid", "assets/img/tiling-sprites/mtn-mid.png");
        loader.add("ground", "assets/img/tiling-sprites/ground.png");
        loader.add("clouds", "assets/img/tiling-sprites/clouds.png");
        loader.add("trees", "assets/img/tiling-sprites/trees.png");
        loader.add("grass", "assets/img/tiling-sprites/grass.png");
    }
}
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

/*
Prints loading log to console.
 */
function loadProgressHandler() {
    console.log("loading");
}

var apple = {name:"apple", weight:0.2};
var banana = {name:"banana", weight:0.2};
var bread = {name:"bread", weight:0.2};
var orange = {name:"orange", weight:0.2};
var broccoli = {name:"broccoli", weight:0.2};

fallingObjects = [apple, banana, bread, orange, broccoli];

/*
Main game driver.
 */
function setup() {

    console.log("setup");

    //Setting up sprites
    catcher = new Sprite(
        resources['assets/img/sprites/basket.png'].texture
    );

    apple.sprite  = new Sprite(
        resources['assets/img/sprites/apple.png'].texture
    );

    banana.sprite = new Sprite(
        resources['assets/img/sprites/banana.png'].texture
    );

    bread.sprite = new Sprite(
        resources['assets/img/sprites/bread.png'].texture
    );

    orange.sprite = new Sprite(
        resources['assets/img/sprites/orange.png'].texture
    );

    broccoli.sprite = new Sprite(
        resources['assets/img/sprites/broccoli.png'].texture
    );

    //Catcher movement
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
  
    // Initialize the the tiling-sprites background
    initBackground();
    // Initialize the the level background
    keyControls();


    // Add sprites to stage
    stage.addChild(grass);
    stage.addChild(catcher);

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    catcher.x = null;
    catcher.y = null;
    catcher.x = gameboundw/2;
    catcher.y = gameboundh/2;

    //Start the game loop
    gameLoop();

}


