/**
 * Created by hamis on 2017-05-10.
 */

var gamePaused;

$("#btn-play").click(function() {
    if (!gamePaused) {
        state = menu;
    } else {
        state = play;
    }
});

// Detects var state change
function hideMenu() {
    gamePaused = false;
    $("#overlay").css("display", "none");
}

function displayMenu() {
    gamePaused = true;
    $("#overlay").css("display", "block");
}
