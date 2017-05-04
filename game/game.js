// Stage-size parameters; aspect ratio.
var GAME_WIDTH = 500;
var GAME_HEIGHT = 800;

//Aliases.
var loader = PIXI.loader,
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
var renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, rendererOptions);

// Create new Container for stage.
var stage = new PIXI.Container();

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
    var catcher = new Sprite(
        resources['assets/img/entities/basket.png'].texture
    );
    var apple = new Sprite(
        resources["assets/img/food/apple.png"].texture
    );

    // Add sprites to stage
    stage.addChild(catcher);
    stage.addChild(apple);

    // Tell the 'renderer' to 'render' the 'stage'.
    renderer.render(stage);

}

/*
Resize canvas to fit the size of the window.
 */
function resize() {

    // Determine which screen dimension is most constrained
    ratio = Math.min(window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT);

    // Scale the view appropriately to fill that dimension
    stage.scale.x = stage.scale.y = ratio;

    // Update the renderer dimensions
    renderer.resize(Math.ceil(GAME_WIDTH * ratio),
        Math.ceil(GAME_HEIGHT * ratio));

}

