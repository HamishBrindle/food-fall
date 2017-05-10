//Capture the keyboard arrow keys
var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40)

if (isMobile.any) {
    stage.interactive = true;
    document.interactive = true;
    touch();

    var currentMousePos = { x: -1, y: -1 };
    var keepmoving = false;
}

function touch() {  
    document.addEventListener("pointerdown", onTouchStart, true);  
    document.addEventListener("pointerup", onTouchEnd, true);  
    document.addEventListener("pointermove", onTouchMove, true);
}

function onTouchStart(event){  
    currentMousePos.x = event.pageX;  
    currentMousePos.y = event.pageY;
    console.log("Down started");
    
}
function onTouchMove(event) {
    if (keepmoving) {
        onpointerdown();
    }
    currentMousePos.x = event.pageX;  
    currentMousePos.y = event.pageY;
    console.log("Move started");
}
function onTouchEnd(event){  
    currentMousePos.x = event.pageX;  
    currentMousePos.y = event.pageY;
    console.log("Up started");
}

stage.on('pointerdown', movemore);

function movemore() {
    keepmoving = true;
}

stage.on('pointerdown', onpointerdown);

function onpointerdown() {
    if (currentMousePos.x < catcher.x) {
        leftpress();
        console.log("Xmouse: " + currentMousePos.x + "Xcatcher: " + catcher.x);
    }
    if (currentMousePos.y < catcher.y) {
        uppress();
        console.log("Ymouse: " + currentMousePos.y + "Ycatcher: " + catcher.y);
    }
    if (currentMousePos.x > catcher.x) {
        rightpress();
        console.log("Xmouse: " + currentMousePos.x + "Xcatcher: " + catcher.x);
    }
    if (currentMousePos.y > catcher.y) {
        console.log("Ymouse: " + currentMousePos.y + "Ycatcher: " + catcher.y);
        downpress();
    }
}

stage.pointerup = function () {
    console.log("released");
    keepmoving = false;
    catcher.accelerationX = 0;
    catcher.accelerationY = 0;
    catcher.frictionX = catcher.drag;
    catcher.frictionY = catcher.drag;
}

//Keyboard Controls Definition
function keyControls() {

    //Left arrow key `press` method
    left.press = function () {
        leftPress();
    };

    //Left arrow key `release` method
    left.release = function () {
        leftRelease();
    };

    //Up
    up.press = function () {
        upPress();
    };
    up.release = function () {
        upRelease();
    };

    //Right
    right.press = function () {
        rightPress();
    };
    right.release = function () {
        rightRelease();
    };

    //Down
    down.press = function () {
        downPress();
    };
    down.release = function () {
        downRelease();
    };
}

function leftPress() {
    //Change the catcher velocity when the key is pressed
    if (catcher.vx > -maxXspeed && catcher.x > 0) {
        catcher.accelerationX = -catcher.speed;
        catcher.frictionX = 1;
    }
}

function leftRelease() {
    /*If the left arrow has been released, and the right arrow isn't down,
        and the catcher isn't moving vertically, Stop the catcher*/
    if (!right.isDown) {
        catcher.accelerationX = 0;
        catcher.frictionX = catcher.drag;
    }
}

function upPress() {
    if (catcher.vy > -maxYspeed && catcher.y > GAME_HEIGHT / 6) {
        catcher.accelerationY = -catcher.speed;
        catcher.frictionY = 1;
    }
}

function upRelease() {
    if (!down.isDown) {
        catcher.accelerationY = 0;
        catcher.frictionY = catcher.drag;
    }
}

function rightpress() {
    if (catcher.vx < maxXspeed && catcher.x < GAME_WIDTH * 0.85) {

        catcher.accelerationX = catcher.speed;
        catcher.frictionX = 1;
    }
}

function rightRelease() {
    if (!left.isDown) {
        catcher.accelerationX = 0;
        catcher.frictionX = catcher.drag;
    }
}

function downpress() {
    if (catcher.vy < maxYspeed && catcher.y < GAME_WIDTH * 0.85)

        catcher.accelerationY = catcher.speed;
    catcher.frictionY = 1;
}

function downRelease() {
    if (!up.isDown) {
        catcher.accelerationY = 0;
        catcher.frictionY = catcher.drag;
    }
}

//Binds catcher to part of the screen
function bound() {
    if (catcher.vy < 0 && catcher.y < GAME_HEIGHT / 6) {
        catcher.vy = 0;
        uprelease();
    }
    if (catcher.vy > 0 && catcher.y > GAME_HEIGHT * 0.85) {
        catcher.vy = 0;
        downrelease();
    }
    if (catcher.vx < 0 && catcher.x < 0) {
        catcher.vx = 0;
        leftrelease();
    }
    if (catcher.vx > 0 && catcher.x > GAME_WIDTH * 0.85) {
        catcher.vx = 0;
        rightrelease();
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
    if (isMobile.any) {
        //Touch
        if (currentMousePos.x >= catcher.x && catcher.vx < 0) {
            leftrelease();
            catcher.vx = 0;
        }
        if (currentMousePos.x <= catcher.x && catcher.vx > 0) {
            rightrelease();
            catcher.vx = 0;
        }
        if (currentMousePos.y <= catcher.y && catcher.vy > 0) {
            downrelease
            catcher.vy = 0;
        }
        if (currentMousePos.y >= catcher.y && catcher.vy < 0) {
            uprelease();
            catcher.vy = 0;
        }
    }


    //Implementing acceleration
    catcher.vx += catcher.accelerationX;
    catcher.vy += catcher.accelerationY;

    //Implementing friction
    catcher.vx *= catcher.frictionX;
    catcher.vy *= catcher.frictionY;
}
