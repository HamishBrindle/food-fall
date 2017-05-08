// Stage-size parameters; aspect ratio.
var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;
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
    mtnFar: 0.125,
    mtnMid: 0.25,
    clouds: 0.30,
    trees: 1,
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
    var delta = parseFloat((currtime - lastTime)/1000);

    // Scroll the terrain
    mtnFar.tilePosition.x -= BG_RATE * delta * backgroundScrollSpeed.mtnFar;
    mtnMid.tilePosition.x -= BG_RATE * delta * backgroundScrollSpeed.mtnMid;
    clouds.tilePosition.x -= BG_RATE * delta * backgroundScrollSpeed.clouds;
    trees.tilePosition.x -= FG_RATE * delta * backgroundScrollSpeed.trees;
    grass.tilePosition.x -= BG_RATE * delta * backgroundScrollSpeed.grass;

    // Draw the stage and prepare for the next frame
    lastTime = currtime;

}

function loadBackgroundTextures() {

    if (window.devicePixelRatio >= 2 &&
        renderer instanceof PIXI.WebGLRenderer) {
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

var apple = {name:"apple", weight:0.2, sprite: 0};
var banana = {name:"banana", weight:0.2, sprite: 0};
var bread = {name:"bread", weight:0.2, sprite: 0};
var orange = {name:"orange", weight:0.2,sprite: 0};
var broccoli = {name:"broccoli", weight:0.2, sprite: 0};

fallingFood = [apple, banana, bread, orange, broccoli];

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

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

    //Start the game loop
    gameLoop();

}
