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
var auth = firebase.auth();


//vars for email and password
// var idName = document.getElementById('txtName');
// var idEmail = document.getElementById('txtEmail');
// var idPassword = document.getElementById('txtPassword');

var txtNameSignIn = document.getElementsByClassName('txtNameSignIn');
var txtEmailSignIn = document.getElementsByClassName('txtEmailSignIn');
var txtPasswordSignIn = document.getElementsByClassName('txtPasswordSignIn');

var txtName = document.getElementById('txtName');

var logoutInfo = document.getElementById('logoutInfo');
var loginRegisterForm = document.getElementById('loginRegisterForm');


const score = 0;

//Authentication for Google sign-in
var googleProvider = new firebase.auth.GoogleAuthProvider();


// var playBtn = document.getElementById('playBtn');


function checkIfUserExists() {
    var emailExists = false;
    var passExists = false;
    var query = database.ref("users/");
    const emailLogin = txtEmailSignIn[0].value;
    const passLogin = txtPasswordSignIn[0].value;
    const nameLogin = txtNameSignIn[0].value;
    query.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            // console.log(childSnapshot.child('email').val());
            // console.log(emailLogin);
            if ((childSnapshot.child('email').val() === emailLogin) && childSnapshot.child('password').val() === passLogin){
                emailExists = true;
                console.log(emailExists);
                console.log("starting login process!");
                txtName.required = true;
                login(emailLogin, passLogin);
                passExists = true;
                return true;
            }

        });
        console.log(emailExists);
        if(emailExists === false && passExists === false){
            console.log("Starting register process!")
            register(nameLogin, emailLogin, passLogin);
        }

    });

}

function login(emailLogin, passLogin){
    auth.signInWithEmailAndPassword(emailLogin, passLogin)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password' || 'errorCode === auth/invalid-email') {
                alert('Wrong email or password.');
                document.getElementById('txtEmail').value = '';
                document.getElementById('txtPassword').value = '';
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });

    auth.onAuthStateChanged((user) => {
        if (user) {
            // alert(user.uid);
            window.location.replace('game.html');
        }
    });
}
function register(nameLogin, emailLogin, passLogin) {
    auth.createUserWithEmailAndPassword(emailLogin, passLogin)
        .then(user => createUser(user, nameLogin, emailLogin, passLogin))
        .catch(function(error){
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorCode === 'auth/weak-password'){
                alert('Password must be at least 6 characters.');
            }else if(errorCode === 'auth/invalid-email'){
                alert('Wrong email');
            }
            else {
                alert(errorMessage);
            }
            console.log(error);
        });
    auth.onAuthStateChanged((user) => {
        if (user) {
            // alert(user.uid);
            window.location.replace('game.html');
        }
    });
}

function createUser(user, name, email, pass) {
    if (user) {
        var rootRef = firebase.database().ref();
        var storesRef = rootRef.child('users/' + user.uid);
        storesRef.set({
            userName: name,
            email: email,
            password: pass,
            score: score
        });
    }
}

function userSignOut() {
    auth.signOut().then(function () {
        console.log('Sign-out successful!');

    }, function (error) {
        console.log('Sign-out failed');
        console.log(error);
    });
}

function checkUser(){
    auth.onAuthStateChanged(function(user){
        //check if user is logged in
        if(user){
            //display div that shows currentUser name
            //also retrieve top score and play button.

            //if user is signed in, then check if the logout button is hidden
            //if it is, then show it.
            if(logoutInfo.style.display === 'none'){
                logoutInfo.style.display = 'block';
            }
            //if user is signed in, then hide sign in inputs
            if(loginRegisterForm.style.display === 'block'){
                loginRegisterForm.style.display ='none';
            }
            //
            displayScore(user);
        }else {
            //no user is signed in
            //display div that shows login/register information
            if(logoutInfo.style.display === 'block'){
                logoutInfo.style.display = 'none';
            }
            //if user isn't logged in, show forms.
            if(loginRegisterForm.style.display === 'none'){
                loginRegisterForm.style.display = 'block';
            }

        }
    });
}

function displayScore(user) {
    var welcomeUserInfo = document.getElementById('welcomeUserInfo');
    var userInDatabase = database.ref("users/" + user.uid);
    // var welcomeUserInfo = database.ref("users/" + user.uid + "/userName");
    console.log(userInDatabase);
    userInDatabase.on('value', function(userSnapshot) {
        console.log(userSnapshot.val());
        welcomeUserInfo.innerText = "Welcome " + userSnapshot.child("userName").val()
                        + ", your highscore is " + userSnapshot.child("score").val();
        // if(scoreCount > scoreSnapshot.val()){
        //     //update database with new highscore.
        //     var updateScore = firebase.database().ref("users/" + user.uid);
        //     updateScore.update({
        //         score : scoreCount
        //     });
        // }
    });
}

//button pressed to show or hide signup information
const btnRegister = document.getElementById('btnRegister');


//Authentication for Facebook sign-in
var facebookProvider = new firebase.auth.FacebookAuthProvider();


function googleSignIn() {
    //Sign in and redirect to a page to select an account
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    auth.signInAndRetrieveDataWithCredential(googleProvider);

    auth.getRedirectResult()
        .then(function(result){
            if(result.credential) {
                //This gives you a Google Access Token
                var token = result.credential.accessToken;
            }
            var user = result.user;
            alert(user.uid);
        });
    //after the page is finished loading, get data from the user.
    //
    // auth.onAuthStateChanged((user) => {
    //     auth.getRedirectResult().then(function (result) {
    //         var person = result.user;
    //     if (user) {
    //         alert(person.uid);
    //         window.location.replace('game.html');
    //     }
    // });
    //
    // });

    // firebase.auth().getRedirectResult().then(function (result) {
    //     //error here, get's data while choosing an account.
    //     var token = result.credential;
    //     var user = result.user;
    //
    //     console.log(result.user);
    //     var userIDinDatabase = firebase.database().ref("users/");
    //     userIDinDatabase.once("values", function (snapshot) {
    //         console.log(shapshot.uid);
    //         if (snapshot.uid == user.uid) {
    //             alert("hi");
    //         }
    //     });
    //     console.log(token);
    //     console.log(user.uid);
    // }).catch(function (error) {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //
    //     console.log(errorCode);
    //     console.log(errorMessage);
    // });
}



function facebookSignIn() {
    firebase.auth().signInWithRedirect(facebookProvider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;

        console.log(token);
        console.log(user);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);
    });
}

