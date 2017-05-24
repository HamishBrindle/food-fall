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

var txtEmailSignIn = document.getElementById('login-username');
var txtPasswordSignIn = document.getElementById('');

var logoutInfo = document.getElementById('logoutInfo');
var loginRegisterForm = document.getElementById('loginRegisterForm');

const userScore = 0;

//Authentication for Google sign-in
var googleProvider = new firebase.auth.GoogleAuthProvider();

// This function checks to see if the information used when
// entering the credentials if the email already exists in the database or not.
// If it does, then log in with the provided email and password.
// If it doesn't, then register with the provided email and password and use the email
// (ex. example@test.com becomes example) for the userName.
// Or, that's what I'm trying to do.  On the side is the order of what code runs.
// The image that goes with this code is the attempt at logging into an already
// existing account.
function checkIfUserExists() {
    //boolean to check if a user is in the database or not
    var checkedEmail = false;
    var checkedPass = false;

    //values from the input on the website
    const emailLogin = txtEmailSignIn[0].value;
    const passLogin = txtPasswordSignIn[0].value;
    const nameLogin = createGameNameFromEmail(txtEmailSignIn[0].value);
    var query = database.ref("users/").orderByKey();
    query.once('value', function(snapshotOfDatabase) {
        //loop through all the user id's
        snapshotOfDatabase.forEach(function(childSnapshot) {
                //if the data for that userID's email and password match with the inputs
                if (childSnapshot.child('email').val() === emailLogin){
                    checkedEmail = true;
                    console.log("email is a match?", checkedEmail);
                    if(childSnapshot.child('password').val() === passLogin){
                        checkedPass = true;
                        console.log("pass is a match?", checkedPass);
                        console.log("starting login process!");
                        // then log in
                        login(emailLogin, passLogin);
                        //return true to exit out of the forEach loop and stop comparing.
                        return checkedEmail && checkedPass;
                    }
                }
        });
        if(checkedEmail && !checkedPass){
            console.log("Incorrect log in information.");
            document.getElementById('txtEmail').value = '';
            document.getElementById('txtPassword').value = '';
        }
        if (!checkedEmail && !checkedPass) {
            console.log("starting registration process!")
            register(nameLogin, emailLogin, passLogin);
            return true;
        }
        auth.onAuthStateChanged((user) => {
            if (user) {
                // alert(user.uid);
                console.log("redirecting to game");
                // window.location.replace('game.html');
            }
        });
    });
}

function login(emailLogin, passLogin){
    auth.signInWithEmailAndPassword(emailLogin, passLogin)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            console.log(error);
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
}

function createUser(user, name, email, pass) {
    if (user) {
        var rootRef = firebase.database().ref();
        var storesRef = rootRef.child('users/' + user.uid);
        storesRef.set({
            userName: name,
            email: email,
            password: pass,
            score: userScore
        });
    }
}

function createGameNameFromEmail(email) {
    var name;
    for(var i = 0; i < email.length; i++){
        if(email[i] === '@'){
            break;
        }
    }
    name = email.substr(0, i);
    return name;
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
            console.log(user.uid);
            console.log(user.email);
            console.log(createGameNameFromEmail(user.email));

            var userInSystem;
            var query = database.ref("users/").orderByKey();
            query.once('value', function(snapshotOfDatabase) {
                //loop through all the user id's
                snapshotOfDatabase.forEach(function(childSnapshot) {
                        //if the data for that userID's email and password match with the inputs

                    console.log(childSnapshot.key);
                    console.log(user.uid);
                    if (user.uid === childSnapshot.key) {
                            console.log("email found in system");
                            userInSystem = true;
                            console.log(userInSystem);
                            return userInSystem;
                    }
                    userInSystem = false;
                });
                console.log("Checking after database check", userInSystem);
                if(userInSystem === false){
                    console.log(userInSystem);
                    console.log("this is called when reg a new account?");
                    var nameReg = createGameNameFromEmail(user.email);
                    var emailReg = user.email;
                    var password = "123456";
                    createUser(user, nameReg, emailReg, password);
                }
                displayScore(user);
            });
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

        } else {
            //no user is signed in
            //display div that shows login/register information
            if(logoutInfo.style.display === 'block'){
                logoutInfo.style.display = 'none';
            }
            //if user isn't logged in, show forms.
            if(loginRegisterForm.style.display === 'none') {
                loginRegisterForm.style.display = 'block';
            }
        }
    });
}

function displayScore(user) {
    var welcomeUserInfo = document.getElementById('welcomeUserInfo');
    var userInDatabase = database.ref("users/" + user.uid);
    // var welcomeUserInfo = database.ref("users/" + user.uid + "/userName");
    userInDatabase.on('value', function(userSnapshot) {
        console.log(userSnapshot.val());
        welcomeUserInfo.innerText = "Welcome " + userSnapshot.child("userName").val()
                        + ", your highscore is " + userSnapshot.child("score").val();
    });
}

//Authentication for Facebook sign-in
var facebookProvider = new firebase.auth.FacebookAuthProvider();

function googleSignIn() {
    //Sign in and redirect to a page to select an account
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    auth.signInWithRedirect(googleProvider);
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

