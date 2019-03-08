const axios = require('axios');
const route = "http://157.230.158.143/Auth";

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
        console.log("\x1b[32mPASS:\x1b[0m" + msg);
    } else {
        console.log("\x1b[31mFAIL:\x1b[0m" + msg);
    }
}


// Test username password login
axios.post(route, validUser).then(result => {
    console.log('Testing valid user');
    console.log(result.data);
});

axios.post(route, wrongPassword).then(result => {
    console.log('Testing wrong password');
    console.log(result.data);
});

axios.post(route, wrongUsername).then(result => {
    console.log('Testing wrong username');
    console.log(result.data);
});


