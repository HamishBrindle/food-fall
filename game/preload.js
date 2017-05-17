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
    mtnFar: 0,
    mtnMid: 0.25,
    clouds: 0.25,
    trees: 0.50,
    grass: 1.5
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

var lastTime;

//Aliases.
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// Rendering Options.
var myView = document.getElementById('myCanvas');

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

// Add renderer to page.
document.getElementById("game-window").appendChild(renderer.view);

//Globals -------------------------------------------------------------------------------Globals
var catcher;

var tk;

var scale = scaleToWindow(renderer.view);

var setupdone = false;

var pointer;

gameBuild = true;

var playButton;

var menuBuild;

var logo;

var catcherBuild;

var randFact;

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
        "assets/img/sprites/cd-1.png",
        "assets/img/sprites/cd-2.png",
        "assets/img/sprites/cd-3.png",
        "assets/img/sprites/cd-go.png",
        "assets/img/sprites/orange.png",
        "assets/img/sprites/play.png",
        "assets/img/web/site-logo-white-long.png",
        "assets/img/sprites/obstacle.png"
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
    trees.tilePosition.x -= BG_RATE * delta + backgroundScrollSpeed.trees;
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

    // Initialize the the tiling-sprites background
    initBackground();

    // Add sprites to stage
    stage.addChild(grass);

    tk = new Tink(PIXI, renderer.view, scale);

    //Touch and Mouse Controls
    pointer = tk.makePointer();
    //Pointer Definition
    pointer.press = function () {};
    pointer.release = function () {};

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
//Set the game's current state to `menu`:
var state = menu;

menuBuild = true;
catcherBuild = false;

//Animation loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    lastTime = new Date().getTime();
    tk.update();
    renderer.render(stage);
}

//State definition for "playing" the game
function play() {
    gameInit();
    foodCatchCollision();
    animateBackground();
    playerMovement();
    addScore();
}
function gameMenuDisplay() {
    if (menuBuild) {

        // Add logo to menu
        logo = new Sprite(
            resources['assets/img/web/site-logo-white-long.png'].texture
        );
        logo.x = (GAME_WIDTH / 2) - (logo.width / 2);
        logo.y = (GAME_HEIGHT) - (logo.height * 1.5);

        // Add play-button to menu
        playButton = new Sprite(
            resources['assets/img/sprites/play.png'].texture
        );
        playButton.interactive = true;
        playButton.width /= 2;
        playButton.height /= 2;
        playButton.x = (GAME_WIDTH / 2) - (playButton.width / 2);
        playButton.y = (GAME_HEIGHT / 2) - (playButton.height / 2);

        // Add listener for play button
        playButton.on('pointerdown', (event) => {
            playGameFromMenu();
        });

        // Add button and logo
        stage.addChild(playButton);
        stage.addChild(logo);
        // Add a fact to the stage
        initFacts();
        // Set game state indicators (e.i. has menu been built / has catcher been built)
        menuBuild = false;
        catcherBuild = true;
    }
}

function playGameFromMenu() {
    state = play;
    stage.removeChild(playButton);
    stage.removeChild(logo);
    stage.removeChild(randFact)
}


function menu() {
    gameMenuDisplay();
}

function initCatcher() {
    if (catcherBuild) {
        //Setting up sprites
        catcher = new Sprite(
            resources['assets/img/sprites/basket.png'].texture
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

        keyControls();

        tk.makeDraggable(catcher);

        stage.addChild(catcher);

        catcherBuild = false;
    }
}

/**
 * Adds a random zero food waste tip to the screen.
 */
function initFacts() {
    var txtStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 30,
        fill: 'white',
        stroke: 'black',
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: 250,
    });
    var factIndex = getRandomInt(0, 13);
    randFact = new PIXI.Text(foodFacts[factIndex], txtStyle);
    randFact.x = GAME_WIDTH - 130;
    randFact.y = GAME_HEIGHT - 450;
    randFact.anchor.x = 0.5;
    stage.addChild(randFact);
}
