const axios = require('axios');
const route = "157.230.158.143/Auth";

console.log("connecting to " + route);


var user = {
    "username": "JamesPham",
    "password": "something",
}



function printLog(passed, msg) {
    if (passed) {
        console.log("\x1b[32mPASS:\x1b[0m" + msg);
    } else {
        console.log("\x1b[31mFAIL:\x1b[0m" + msg);
    }
}


// Test username password login
axios.post(route, user).then(result => {
    console.log(result);
});