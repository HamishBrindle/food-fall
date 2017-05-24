// Global - indicates if user is logged in or not
let loggedIn = false;

// These elements are used in preload.js so we must declare them globally for now
const logOutPanel = document.getElementById("log-out-main-menu");
const loginPanel = document.getElementById("login-panel");
const signUpPanel = document.getElementById("signupbox");

(function() {

    const config = {
        apiKey: "AIzaSyDLI2-ikgpZ8N4EX89enO8ERiMz63Rv7eo",
        authDomain: "fool-fall.firebaseapp.com",
        databaseURL: "https://fool-fall.firebaseio.com",
        projectId: "fool-fall",
        storageBucket: "fool-fall.appspot.com",
        messagingSenderId: "884200936745"
    };

    firebase.initializeApp(config);

    // Get DOM elements!
    const txtEmail = document.getElementById('txtEmail');
    const txtEmailSignUp = document.getElementById('txtEmailSignUp');
    const txtPassword = document.getElementById('txtPassword');
    const txtPasswordSignUp = document.getElementById('txtPasswordSignUp');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogOut = document.getElementById('btnLogOut');
    const btnLogOutMainMenu = document.getElementById('btnLogOutMainMenu');

    // Event listeners for LOGIN button
    btnLogin.addEventListener('click', e => {

        // Get email and password fields
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();

        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, password);

        promise.catch(e => console.log(e.message));

    });

    // Event listeners for SIGN-UP button
    btnSignUp.addEventListener('click', e => {

        // Get email and password fields
        // TODO: Check for REAL EMAIL
        const email = txtEmailSignUp.value;
        const password = txtPasswordSignUp.value;
        const auth = firebase.auth();

        // Sign in
        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise.catch(e => console.log(e.message));

    });

    // Event listener for LOGOUT button
    btnLogOut.addEventListener('click', e => {
        menuBuild = true;
        firebase.auth().signOut();
    });

    // Event listener for LOGOUT button on the MAIN MENU
    btnLogOutMainMenu.addEventListener('click', e => {
        menuBuild = true;
        firebase.auth().signOut();
    });

    // Real-time user authentication
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log("User logged in.");
            btnLogOut.classList.remove('hide');
            loggedIn = true;
            try {
                loginPanel.style.display = "none";
                signUpPanel.style.display = "none";
            } catch(exception) {
                console.log("Login hidden.");
            }

            logOutPanel.style.display = "block";

        } else {
            console.log("Not logged in");
            btnLogOut.classList.add('hide');
            loggedIn = false;
            loginPanel.style.display = "block";
            logOutPanel.style.display = "none";
        }
    });
}());