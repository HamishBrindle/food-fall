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
	const txtEmailLogin = document.getElementById('txtEmailLogin');
    const txtPasswordLogin = document.getElementById('txtPasswordLogin');
    const txtNameSignup = document.getElementById('txtNameSignup');
    const txtEmailSignup = document.getElementById('txtEmailSignup');
    const txtPasswordSignup = document.getElementById('txtPasswordSignup');
    const btnSignUp = document.getElementById('btnSignUp');
	const googleSignIn = document.getElementById('googleSignIn');
	const googleSignOut = document.getElementById('googleSignOut');
	const facebookSignIn = document.getElementById('facebookSignIn');
	const facebookSignOut = document.getElementById('facebookSignOut');
	
	//Authentication for Google sign-in
	var googleProvider = new firebase.auth.GoogleAuthProvider();
	//Authentication for Facebook sign-in
	var facebookProvider = new firebase.auth.FacebookAuthProvider();
	
	facebookSignIn.addEventListener('click', e => {
		firebase.auth().signInWithRedirect(facebookProvider).then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
			
			console.log(token);
			console.log(user);
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			
			console.log(errorCode);
			console.log(errorMessage);
		});
	});
	
	facebookSignOut.addEventListener('click', e => {
		firebase.auth().signOut()
			.then(function() {
				console.log('Sign-out successful!');
			}, function(error) {
				console.log('Sign-out failed');
			});
	});
	
	googleSignIn.addEventListener('click', e => {
		firebase.auth()
			.signInWithRedirect(googleProvider).then(function(result){
				var token = result.credential.accessToken;
				var user = result.user;
				
				console.log(token);
				console.log(user);
			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				
				console.log(errorCode);
				console.log(errorMessage);
			})
	});
	
	googleSignOut.addEventListener('click', e => {
		firebase.auth().signOut()
			.then(function() {
				console.log('Sign-out successful!');
			}, function(error) {
				console.log('Sign-out failed');
			});
	});
	
	//add login event
	btnLogin.addEventListener('click', e => {
        const email = txtEmailLogin.value;
        const pass = txtPasswordLogin.value;
        const auth = firebase.auth();
        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.message));
        console.log("hi");
    });
	
	
    //Add register event
    btnSignUp.addEventListener('click', e => {
        const name = txtNameSignup.value;
        const email = txtEmailSignup.value;
        const pass = txtPasswordSignup.value;
        const score = 0;
       
        const auth = firebase.auth();
        //register
        auth.createUserWithEmailAndPassword(email, pass)
			.then(user => createUser(user))
			.catch(e => console.log(e.message));


        function createUser(user) {
            if (user) {
                var rootRef = firebase.database().ref();
                var storesRef = rootRef.child('users/' + user.uid);
                var newStoreRef = storesRef.push();
                newStoreRef.set({
                    userName: name,
                    email: email,
                    password: pass,
                    score: score
                })
            }
        }

    });

}());