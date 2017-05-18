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
var txtName = document.getElementById('txtName');
var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var signInButton = document.getElementById('signInButton');
var backBtn = document.getElementById('backBtn');


var txtNameSignUp = document.getElementsByClassName('txtNameSignUp');
var txtEmailSignUp = document.getElementsByClassName('txtEmailSignUp');
var txtPasswordSignUp = document.getElementsByClassName('txtPasswordSignUp');

var txtEmailSignIn = document.getElementsByClassName('txtEmailSignIn');
var txtPasswordSignIn = document.getElementsByClassName('txtPasswordSignIn');


const score = 0;

//button pressed to show or hide signup information
const btnRegister = document.getElementById('btnRegister');

//Authentication for Google sign-in
var googleProvider = new firebase.auth.GoogleAuthProvider();
//Authentication for Facebook sign-in
var facebookProvider = new firebase.auth.FacebookAuthProvider();

var registerBtn = false;

function registerButtonPressed() {

    //pressed to register
    if (registerBtn === false) {
        //changes userName to be showing
        txtName.style.display = 'block';
        //changes signin button to be hidden
        signInButton.style.display = 'none';
        //changes input class to be signUp
        if (txtEmail.classList.contains('txtEmailSignIn')) {
            txtEmail.classList.remove('txtEmailSignIn');
        }
        txtEmail.classList.add('txtEmailSignUp');
        if (txtPassword.classList.contains('txtPasswordSignIn')) {
            txtPassword.classList.remove('txtPasswordSignIn');
        }
        //changes name to be required
        document.querySelector('#txtName').required = true;
        btnRegister.innerText = 'Register and Play!'
        txtPassword.classList.add('txtPasswordSignUp');
        backBtn.style.display = 'block';
        registerBtn = true;
    }
    //pressed to sign in
    else if (registerBtn === true) {
        emailAndPasswordSignUp();
        auth.onAuthStateChanged((user) => {
            if (user) {
                //changes userName to be hidden
                txtName.style.display = 'none';
                //changes signin button to be showing
                signInButton.style.display = 'block';
                //changes input class to be signIn
                if (txtEmail.classList.contains('txtEmailSignUp')) {
                    txtEmail.classList.remove('txtEmailSignUp');
                }
                txtEmail.classList.add('txtEmailSignIn');
                if (txtPassword.classList.contains('txtPasswordSignUp')) {
                    txtPassword.classList.remove('txtPasswordSignUp');
                }
                txtPassword.classList.add('txtPasswordSignIn');
                document.querySelector('#txtName').required = false;
                btnRegister.innerText = 'Register'
                //pressing register again actually takes in the input
                //to register the user into the database
                backBtn.style.display = 'none';
                registerBtn = false;
            }
        });
    }
}

function goBack() {
        //changes userName to be hidden
        txtName.style.display = 'none';
        //changes signin button to be showing
        signInButton.style.display = 'block';
        //changes input class to be signIn
        if (txtEmail.classList.contains('txtEmailSignUp')) {
            txtEmail.classList.remove('txtEmailSignUp');
        }
        txtEmail.classList.add('txtEmailSignIn');
        if (txtPassword.classList.contains('txtPasswordSignUp')) {
            txtPassword.classList.remove('txtPasswordSignUp');
        }
        txtPassword.classList.add('txtPasswordSignIn');
        document.querySelector('#txtName').required = false;
        btnRegister.innerText = 'Register'
        //pressing register again actually takes in the input
        //to register the user into the database
        backBtn.style.display = 'none';
        registerBtn = false;
}

function emailAndPasswordLogIn() {
    const emailLogin = txtEmailSignIn[0].value;
    const passLogin = txtPasswordSignIn[0].value;
    console.log(emailLogin);
    console.log(passLogin);

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

function emailAndPasswordSignUp() {
    var nameSignup = txtNameSignUp[0].value;
    var emailSignup = txtEmailSignUp[0].value;
    var passSignup = txtPasswordSignUp[0].value;
    console.log(nameSignup);
    console.log(emailSignup);
    console.log(passSignup);
    //register
    auth.createUserWithEmailAndPassword(emailSignup, passSignup)
        .then(user => createUser(user, nameSignup, emailSignup, passSignup))
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

function userSignOut() {
    firebase.auth().signOut().then(function () {
        console.log('Sign-out successful!');
    }, function (error) {
        console.log('Sign-out failed');
        console.log(error);
    });
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

