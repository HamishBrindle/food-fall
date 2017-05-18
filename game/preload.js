// Stage-size parameters; aspect ratio.

var GAME_WIDTH = 800;
var GAME_HEIGHT = 500;

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

var instructions;

var catcherBuild;

var soundOptions = {
    soundEnabled: false,
    soundButtonOnDisplayed: true,
    soundButtonOffDisplayed: false,
};

var soundButtonOn;
var soundButtonOff;

var randFact;

loader
    .add([
        "assets/img/sprites/basket.png",
        "assets/img/sprites/basket_bottom.png",
        "assets/img/sprites/apple.png",
        "assets/img/sprites/banana.png",
        "assets/img/sprites/bread.png",
        "assets/img/sprites/broccoli.png",
        "assets/img/sprites/egg.png",
        "assets/img/sprites/cd-1.png",
        "assets/img/sprites/cd-2.png",
        "assets/img/sprites/cd-3.png",
        "assets/img/sprites/cd-go.png",
        "assets/img/sprites/orange.png",
        "assets/img/sprites/play.png",
        "assets/img/web/site-logo-white-long-shadow.png",
        "assets/img/sprites/obstacle.png",
        "assets/img/tiling-sprites/sky.png",
        "assets/img/tiling-sprites/mtn-far.png",
        "assets/img/tiling-sprites/mtn-mid.png",
        "assets/img/tiling-sprites/ground.png",
        "assets/img/tiling-sprites/clouds.png",
        "assets/img/tiling-sprites/trees.png",
        "assets/img/tiling-sprites/grass.png",
        "assets/img/sprites/sound-on.png",
        "assets/img/sprites/sound-off.png",
        "assets/img/sprites/instructions.png"
    ])
    .on("progress", loadProgressHandler)
    .load(setup);


function initBackground() {

    /*
     Layer order:
     sky | mtnFar | mtnMid | ground | clouds | trees | grass
     */
    sky =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/sky.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(sky);

    mtnFar =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/mtn-far.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(mtnFar);

    mtnMid =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/mtn-mid.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(mtnMid);

    ground =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/ground.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(ground);

    clouds =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/clouds.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(clouds);

    trees =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/trees.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    stage.addChild(trees);

    grass =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/grass.png'].texture, GAME_WIDTH, GAME_HEIGHT);

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

/*
Prints loading log to console.
 */
function loadProgressHandler() {
    console.log("loading");
}

var numberOfFood = 6;

apple = {name: "apple", weight: 1 / numberOfFood};
banana = {name: "banana", weight: 1 / numberOfFood};
bread = {name: "bread", weight: 1 / numberOfFood};
orange = {name: "orange", weight: 1 / numberOfFood};
broccoli = {name: "broccoli", weight: 1 / numberOfFood};
egg = {name: "egg", weight: 1 / numberOfFood};

fallingObjects = [apple, banana, bread, orange, broccoli, egg];


/*
Main game driver.
 */
function setup() {

    // Initialize the the tiling-sprites background
    initBackground();

    // Add sprites to stage
    stage.addChild(grass);

    tk = new Tink(PIXI, renderer.view, scale);

    // Display sound on/off button
    soundButtonDisplay();

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
    soundButtonDisplay();
    animateBackground();
    playerMovement();
    addScore();
}

function gameMenuDisplay() {
    if (menuBuild) {

        // Add logo to menu
        logo = new Sprite(
            resources['assets/img/web/site-logo-white-long-shadow.png'].texture
        );
        logo.x = (GAME_WIDTH / 2) - (logo.width / 2);
        logo.y = GAME_HEIGHT - (logo.height * 3);

        // Add play-button to menu
        playButton = new Sprite(
            resources['assets/img/sprites/play.png'].texture
        );
        playButton.interactive = true;
        playButton.width /= 2;
        playButton.height /= 2;
        playButton.x = (GAME_WIDTH / 2) - (playButton.width / 2);
        playButton.y = GAME_HEIGHT - (playButton.height * 2);

        // Add listener for play button
        playButton.on('pointerdown', (event) => {
            playGameFromMenu();
            menuSound.play('menu')
        });

        // Add logo to menu
        instructions = new Sprite(
            resources['assets/img/sprites/instructions.png'].texture
        );
        instructions.width /= 1.25;
        instructions.height /= 1.25;
        instructions.x = instructions.width / 2;
        instructions.y = GAME_HEIGHT - (instructions.height * 1.5);

        // Add button and logo
        stage.addChild(playButton);
        stage.addChild(logo);
        stage.addChild(instructions);

        // Add a fact to the stage
        initFacts();

        // Set game state indicators (e.i. has menu been built / has catcher been built)
        menuBuild = false;
        catcherBuild = true;
    }
}

function soundButtonDisplay() {
    if (soundOptions.soundButtonOnDisplayed && !soundOptions.soundButtonOffDisplayed) {
        if (!soundOptions.soundEnabled) {
            soundButtonOn = new Sprite(resources['assets/img/sprites/sound-on.png'].texture);
            soundButtonOn.interactive = true;
            soundButtonOn.width /= 3;
            soundButtonOn.height /= 3;
            soundButtonOn.x = GAME_WIDTH - soundButtonOn.width;
            soundOptions.soundEnabled = true;
            soundOptions.soundButtonOnDisplayed = false;
            soundOptions.soundButtonOffDisplayed = false;
            soundButtonOn.on('pointerdown', (event) => {
                muteSound();
                soundOptions.soundEnabled = false;
                soundOptions.soundButtonOnDisplayed = false;
                soundOptions.soundButtonOffDisplayed = true;
                stage.removeChild(soundButtonOn);
            });
            stage.addChild(soundButtonOn);
        }
    } else if (!soundOptions.soundButtonOnDisplayed && soundOptions.soundButtonOffDisplayed) {
        if (!soundOptions.soundEnabled) {
            soundButtonOff = new Sprite(resources['assets/img/sprites/sound-off.png'].texture);
            soundButtonOff.interactive = true;
            soundButtonOff.width /= 3;
            soundButtonOff.height /= 3;
            soundButtonOff.x = GAME_WIDTH - soundButtonOff.width;
            soundOptions.soundEnabled = true;
            soundOptions.soundButtonOnDisplayed = false;
            soundOptions.soundButtonOffDisplayed = false;
            soundButtonOff.on('pointerdown', (event) => {
                unmuteSound();
                soundOptions.soundEnabled = false;
                soundOptions.soundButtonOnDisplayed = true;
                soundOptions.soundButtonOffDisplayed = false;
                stage.removeChild(soundButtonOff);
            });
            stage.addChild(soundButtonOff);
        }
    }
}

function playGameFromMenu() {
    state = play;
    stage.removeChild(playButton);
    stage.removeChild(logo);
    stage.removeChild(randFact);
    stage.removeChild(instructions);
}


function menu() {
    animateBackground();
    gameMenuDisplay();
}


var config = {
    apiKey: "AIzaSyDLI2-ikgpZ8N4EX89enO8ERiMz63Rv7eo",
    authDomain: "fool-fall.firebaseapp.com",
    databaseURL: "https://fool-fall.firebaseio.com",
    projectId: "fool-fall",
    storageBucket: "fool-fall.appspot.com",
    messagingSenderId: "884200936745"
};

firebase.initializeApp(config);
var database = firebase.database();
var userData = [];
var i = 0;

var scoresRef = firebase.database().ref("users").orderByKey();
scoresRef.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var user = {};
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            user.name = childData.userName;
            user.score = childData.score;
            userData[i] = user;
            i++;
        });
    });

function initCatcher() {
    if (catcherBuild) {
        //Setting up sprites
        catcher = new Sprite(resources['assets/img/sprites/basket.png'].texture);
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