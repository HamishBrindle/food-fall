// game.Stage-size parameters; aspect ratio.

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
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Ticker = PIXI.ticker.Ticker;

var rendererOptions = {
    antiAliasing: false,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoResize: true
};

// Create game.renderer.
var game = new PIXI.Application(GAME_WIDTH, GAME_HEIGHT, rendererOptions);

// game.Renderer position on screen.
game.renderer.view.style.position = "absolute";
game.renderer.view.style.top = "0px";
game.renderer.view.style.left = "0px"; // Centers window.

// Add game.renderer to page.
document.getElementById("game-window").appendChild(game.view);

//Globals -------------------------------------------------------------------------------Globals

// Game playing state globals
var catcher;
var tk;
var scale = scaleToWindow(game.renderer.view);
var setupdone = false;
var pointer;

// Main menu globals
var gameBuild = true;
var playButton;
var menuBuild;
var logo;
var catcherBuild;

// Easter egg related globals
var easterEggEnabled = false;
var items = [];
var outputSprite;
var currentTexture;
var renderTexture2;
var renderTexture;
var stuffContainer;

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
        "assets/img/web/site-logo-white-long.png",
        "assets/img/sprites/obstacle.png",
        "assets/img/tiling-sprites/sky.png",
        "assets/img/tiling-sprites/mtn-far.png",
        "assets/img/tiling-sprites/mtn-mid.png",
        "assets/img/tiling-sprites/ground.png",
        "assets/img/tiling-sprites/clouds.png",
        "assets/img/tiling-sprites/trees.png",
        "assets/img/tiling-sprites/grass.png"
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
    game.stage.addChild(sky);

    mtnFar =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/mtn-far.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    game.stage.addChild(mtnFar);

    mtnMid =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/mtn-mid.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    game.stage.addChild(mtnMid);

    ground =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/ground.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    game.stage.addChild(ground);

    clouds =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/clouds.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    game.stage.addChild(clouds);

    trees =
        new PIXI.extras.TilingSprite(resources['assets/img/tiling-sprites/trees.png'].texture, GAME_WIDTH, GAME_HEIGHT);
    game.stage.addChild(trees);

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

    // Draw the game.stage and prepare for the next frame
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

    // Add sprites to game.stage
    game.stage.addChild(grass);

    tk = new Tink(PIXI, game.renderer.view, scale);

    //Touch and Mouse Controls
    pointer = tk.makePointer();
    //Pointer Definition
    pointer.press = function () {
    };
    pointer.release = function () {
    };

    setupdone = true;

    // Resize screen when window size is adjusted.
    window.addEventListener("resize", function (event) {
        let scale = scaleToWindow(game.renderer.view);
        tk.scale = scale;
    });

    // Tell the 'game.renderer' to 'render' the 'game.stage'.
    game.renderer.render(game.stage);

    //Start the game loop
    gameLoop();

}
//Set the game's current state to `play`:
var state = menu;

menuBuild = true;
catcherBuild = false;

//Animation loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    lastTime = new Date().getTime();
    tk.update();
    game.renderer.render(game.stage);
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
        playButton.on('tap', (event) => {
            playGameFromMenu();
        });

        // Add button and logo
        game.stage.addChild(playButton);
        game.stage.addChild(logo);

        // Set game state indicators (e.i. has menu been built / has catcher been built)
        menuBuild = false;
        catcherBuild = true;
    }
}

function playGameFromMenu() {
    state = play;
    game.stage.removeChild(playButton);
    game.stage.removeChild(logo);
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

        game.stage.addChild(catcher);

        catcherBuild = false;
    }
}

function easterEgg() {

    if (!easterEggEnabled) {

        // create two render textures... these dynamic textures will be used to draw the scene into itself
        renderTexture = PIXI.RenderTexture.create(
            game.renderer.width,
            game.renderer.height
        );
        renderTexture2 = PIXI.RenderTexture.create(
            game.renderer.width,
            game.renderer.height
        );
        currentTexture = renderTexture;

        // create a new sprite that uses the render texture we created above
        outputSprite = new PIXI.Sprite(currentTexture);

        // align the sprite
        outputSprite.x = 200;
        outputSprite.y = 300;

        // add to game.stage
        game.stage.addChild(outputSprite);

        stuffContainer = new PIXI.Container();

        stuffContainer.x = GAME_WIDTH / 2;
        stuffContainer.y = GAME_HEIGHT / 2;

        game.stage.addChild(stuffContainer);

        // now create some items and randomly position them in the stuff container
        for (let i = 0; i < 100; i++) {
            let item = new Sprite(
                resources['assets/img/sprites/' + fallingObjects[i % fallingObjects.length].name + '.png'].texture
            );
            item.x = Math.random() * GAME_WIDTH - GAME_HEIGHT;
            item.y = Math.random() * GAME_WIDTH - GAME_HEIGHT;
            item.anchor.set(0.4);
            stuffContainer.addChild(item);
            items.push(item);
        }

        // used for spinning!
        var count = 0;

        easterEggEnabled = true;

    }

    function animateEasterEgg() {

        for (let i = 0; i < items.length; i++) {
            // rotate each item
            let item = items[i];
            item.rotation += 0.1;
        }

        count += 0.05;

        // swap the buffers ...
        let temp = renderTexture;
        renderTexture = renderTexture2;
        renderTexture2 = temp;

        // set the new texture
        outputSprite.texture = renderTexture;

        // twist this up!
        stuffContainer.rotation -= 0.01;
        outputSprite.scale.set(1 + Math.sin(count) * 0.6);

        // render the game.stage to the texture
        // the 'true' clears the texture before the content is rendered
        game.renderer.render(game.stage, renderTexture2, true);

    }

    animateEasterEgg();
}