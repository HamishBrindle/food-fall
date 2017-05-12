/**
 * Created by hamis on 2017-05-10.
 */

var gamePaused;
var leaderBoardVisibile;

$("#btn-play").click(function() {
    if (gamePaused) {
        state = play;
    } else {
        state = menu;
    }
});

$("#btn-leader").click(function() {
    if (leaderBoardVisibile) {
        hideLeader();
        leaderBoardVisibile = false;
    } else {
        displayLeader();
        leaderBoardVisibile = true;
    }
}).on("tap", function() {
    if (leaderBoardVisibile) {
        hideLeader();
        leaderBoardVisibile = false;
    } else {
        displayLeader();
        leaderBoardVisibile = true;
    }
});

$(window).resize(fitGameWindowDiv()).ready(fitGameWindowDiv());

function fitGameWindowDiv() {
    $("#game-window").css("height", $("#game-canvas").height);
}

// Detects var state change
function hideMenu() {
    gamePaused = false;
    $("#overlay").css("display", "none");
    $("#game-window").find("#overlay #game-over").css("display", "none");
}

function displayMenu() {
    gamePaused = true;
    $("#overlay").css("display", "block");
}

//
function displayLeader() {
    $("#game-window").find("#overlay #game-over").css("display", "block");
    console.log("lb called");

    var heading = [];
    heading[0] = "User Name";
    heading[1] = "Score";

    var userData = [
        ["hsimah", "800"],
        ["yrrek", "900"],
        ["eiluj", "1000"]
    ];


    var myTable = "<table class='table' id='leader-board-table'><thead><tr>";
    myTable += "<th>User Name</th><th>Score</th></tr>";
    myTable += "</thead><tbody>";

    for (var i = 0; i < userData.length; i++) {
        myTable += "<tr><td>"+ userData[i][0] +"</td>";
        myTable += "<td>" + userData[i][1] + "</td></tr>";
    }
    myTable += "</tbody></table>";

    document.getElementById('game-over').innerHTML = myTable;
}

function hideLeader() {
    $("#game-window").find("#overlay #game-over").css("display", "none");
}
