(function () {
    //Initialize Firebase
    const config = {
        apiKey: "AIzaSyDLI2-ikgpZ8N4EX89enO8ERiMz63Rv7eo",
        authDomain: "fool-fall.firebaseapp.com",
        databaseURL: "https://fool-fall.firebaseio.com",
        projectId: "fool-fall",
        storageBucket: "fool-fall.appspot.com",
        messagingSenderId: "884200936745"
    };
    firebase.initializeApp(config);

    //Get a reference to the database service
    var database = firebase.database();

    //Get elements
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');

    btnLogin.addEventListener('click', e => {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.message));
        console.log("hi");
    });

}());