const axios = require('axios')
console.log("connecting to 157.230.158.143/CreateAccount")


var user = {
    "username": "jason",
    "password": "password",
    "email": "fake@gmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}



function printLog(passed, msg) {
    if (passed) {
        console.log("\x1b[32mPASS:\x1b[0m" + msg);
    } else {
        console.log("\x1b[31mFAIL:\x1b[0m" + msg);
    }
}



//email testing
axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "password",
    "email": "fakegmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.email == "Not an email") {
        printLog(true, "Not An Email");
    } else
        printLog(false, "Not An Email");
});


axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "password",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.email != null) {
        printLog(true, "No Email");
    } else
        printLog(false, "No Email");
});



//username testing
axios.post('http://157.230.158.143/CreateAccount', {
    "password": "password",
    "email": "fake@mail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.username == "No username") {
        printLog(true, "No username");
    } else
        printLog(false, "No username");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "a",
    "password": "password",
    "email": "fake@mail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.username == "Username too short") {
        printLog(true, "Username too short");
    } else
        printLog(false, "Username too short");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "mikeisthebestpersonthathaseverylivedandheisacowthisisareallylong1",
    "password": "password",
    "email": "fake@gmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.username == "Username too long") {
        printLog(true, "Username too long");
    } else
        printLog(false, "Username too long");
});





//password testing
axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "email": "fake@gmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.password == "No password") {
        printLog(true, "No password");
    } else
        printLog(false, "No password");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "123456",
    "email": "fake@gmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.password == "Password too short") {
        printLog(true, "Password too short");
    } else
        printLog(false, "Password too short");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "akjhlasdflkjhasdfkjlhasfkljehfaklmbnsbnfdlkjhdsflkjdhfslkjfhlkjdhasdfsadf",
    "email": "fake@gmail.com",
    "homeLat": "12",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.password == "Password too long") {
        printLog(true, "Password too long");
    } else
        printLog(false, "Password too long");
});


//latitude testing
axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "123456",
    "email": "fake@gmail.com",
    "homeLat": "-90.1",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.homeLat == "Latitude outside domain") {
        printLog(true, "Latitude outside domain below");
    } else
        printLog(false, "Latitude outside domain below");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "akjhlasdflkjhasdfkjlhasfkljehfaklmbnsbnfdlkjhdsflkjdhfslkjfhlkjdhasdfsadf",
    "email": "fake@gmail.com",
    "homeLat": "90.1",
    "homeLng": "12.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.homeLat == "Latitude outside domain") {
        printLog(true, "Latitude outside domain above");
    } else
        printLog(false, "Latitude outside domain above");
});


//longitude
axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "123456",
    "email": "fake@gmail.com",
    "homeLat": "0",
    "homeLng": "180.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.homeLng == "Longitude outside domain") {
        printLog(true, "Longitude outside domain above");
    } else
        printLog(false, "Longitude outside domain above");
});

axios.post('http://157.230.158.143/CreateAccount', {
    "username": "jason",
    "password": "akjhlasdflkjhasdfkjlhasfkljehfaklmbnsbnfdlkjhdsflkjdhfslkjfhlkjdhasdfsadf",
    "email": "fake@gmail.com",
    "homeLat": "0",
    "homeLng": "-180.1"
}).then(result => {
    var resultOBJ = result.data;
    if (resultOBJ.isErrored == true && resultOBJ.homeLng == "Longitude outside domain") {
        printLog(true, "Longitude outside domain below");
    } else
        printLog(false, "Longitude outside domain below");
});

var username = Math.random().toString(36).substring(6) + Math.random().toString(36).substring(6);
var newUser = {
    "username": username,
    "password": "password",
    "email": "fake@gmail.com",
    "homeLat": "0",
    "homeLng": "0"
};

axios.post('http://157.230.158.143/CreateAccount', newUser).then(result => {
    var resultOBJ = result.data;

    axios.post('http://157.230.158.143/queryAccounts', { "username": newUser.username }).then(resQuery => {
        //check that a second user cannot be created

        if (resultOBJ.isErrored == false && resQuery.data.length == 1) {
            printLog(true, "Creating Account");
            axios.post('http://157.230.158.143/CreateAccount', newUser).then(result => {
                var resultOBJ = result.data;
                if (resultOBJ.isErrored == true && resultOBJ.username == "Username is already taken") {
                    printLog(true, "Username is already taken");
                } else
                    printLog(false, "Username is already taken");
            });
            if (resQuery.data[0].passwordHash != newUser.password)
                printLog(true, "Password is hashed");
            else
                printLog(false, "Password is hashed");


            if (resQuery.data[0].email == newUser.email || resQuery.data[0].homeLat == newUser.homeLat || resQuery.data[0].homeLng == newUser.homeLng)
                printLog(true, "User info saved correctly");
            else
                printLog(false, "User info saved correctly");

        } else {
            printLog(false, "Creating Account");
            console.log(resultOBJ);
        }
    })
});