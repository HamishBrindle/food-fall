/**
 * Created by hamis on 2017-05-10.
 */

var gamePaused = false;

$("#btn-pause").click(function() {
    if (!gamePaused) {
        state = mainMenu;
        gamePaused = true;
    } else {
        state = play;
        gamePaused = false;
    }
});

$("#btn-leaderboard").click(function() {
    $('div').html('<ul>')
});
