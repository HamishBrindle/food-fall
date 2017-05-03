//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Variables
var width = 500;
var height = 800;

var stage = new Container(),
    renderer = autoDetectRenderer(width, height);
document.body.appendChild(renderer.view);

//Texture Cache
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

//Prints loading log to consol
function loadProgressHandler() {
    console.log("loading");
}

//Main
function setup() {
    console.log("setup");
    var catcher = new Sprite(
      resources["assets/img/entities/basket.png"].texture
    );
    var apple = new Sprite(
      resources["assets/img/food/apple.png"].texture
    );

    stage.addChild(catcher);
    stage.addChild(apple);

    //Tell the `renderer` to `render` the `stage`
    renderer.render(stage);
}

