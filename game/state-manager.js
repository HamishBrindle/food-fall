/**
 * Created by hamis on 2017-05-10.
 */

var gamePaused = true;

$("#btn-play").click(function() {
    if (!gamePaused) {
        state = mainMenu;
        gamePaused = true;
    } else {
        state = play;
        gamePaused = false;
        $("#inner-box").css("display", "none");
    }
});
