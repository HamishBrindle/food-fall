(function () {

    //Get a reference to the database service
    var database = firebase.database();

    //Get elements
    const txtName = document.getElementById('txtName');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnSignUp = document.getElementById('btnSignUp');

    //Add register event
    btnSignUp.addEventListener('click', e => {
        const name = txtName.value;
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const score = 0;
        //might not need this.  But keep for now.
        const auth = firebase.auth();
        //register
        auth.createUserWithEmailAndPassword(email, pass)
			.then(user => createUser(user))
			.catch(e => console.log(e.message));

        //firebase.database().ref('users/' + userId).set({

        //});


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
                /* const dbRefObject = firebase.database().ref().child('object');
                 const dbRefList = dbRefObject.child("users/" + user.uid);
                 dbRefList.set({
                     userName : name,
                     email : email,
                     password : pass,
                     score : score
                 });*/
            }
        }


    });





}());