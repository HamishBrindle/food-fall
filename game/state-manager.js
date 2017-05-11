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
    $("#game-window #overlay #game-over").css("display", "none");
}

function displayMenu() {
    gamePaused = true;
    $("#overlay").css("display", "block");
}

//
function displayLeader() {
    $("#game-window #overlay #game-over").css("display", "block");
    console.log("lb called");

    var heading = new Array();
    heading[0] = "User Name"
    heading[1] = "Score"

    var userData = new Array();
    userData[0] = new Array("hsimah", "800")
    userData[0] = new Array("yrrek", "900")
    userData[0] = new Array("eiluj", "1000")

    var myTable = "<table><tr><td style='width: 100px; color: red;'>User Name</td>";
    myTable += "<td style='width: 100px; color: red; text-align: right;'>Score</td>";

    myTable += "<tr><td style='width: 100px;                   '>---------------</td>";
    myTable += "<td     style='width: 100px; text-align: right;'>---------------</td>";

    for (var i = 0; i < userData.length; i++) {
        myTable += "<tr><td style='width: 100px;'>Number " + i + " is:</td>";
        myTable += "<td style='width: 100px; text-align: right;'>" + userData[i] + "</td></tr>";
    }
    myTable += "</table>";

    document.getElementById('game-over').innerHTML = myTable;
}
