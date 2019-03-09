const axios = require('axios');
const route = "http://157.230.158.143/auth";

console.log("connecting to " + route);


var validUser = {
    "username": "JamesPham",
    "password": "something"
}

var wrongPassword = {
	"username": "JamesPham",
	"password": "asdf"
}

var wrongUsername = {
	"username": "james",
	"password": "something"
}

function printLog(passed, msg) {
    if (passed) {
        console.log("\x1b[32mPASS:\x1b[0m " + msg);
    } else {
        console.log("\x1b[31mFAIL:\x1b[0m " + msg);
    }
}

function assertTrue(a, b, msg) {
    if(a === b) {
        printLog(1, msg);
    }
    else {
        printLog(0, msg);
    }
}

// Test username password login
axios.post(route, validUser).then(response => {
    assertTrue(response.data.auth, 'Valid', 'Log in with valid username and password combo should return Valid');
});

axios.post(route, wrongPassword).then(response => {
}).catch(error => {
    assertTrue(error.response.data.auth, 'Invalid', 'Log in with valid username and wrong password should return Invalid');
});

axios.post(route, wrongUsername).then(response => {
}).catch(error => {
    assertTrue(error.response.data.auth, 'Not Found', 'Log in with username that does not exist should return Not Found');
});

axios.post(route, {}).then(response => {
}).catch(error => {
    assertTrue(error.response.data.auth, 'Bad parameters', 'Log in without any username or password should return Bad Parameters');
});