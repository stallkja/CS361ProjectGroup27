const axios = require('axios');
const loginShopperRoute = "http://157.230.158.143:8080/auth";
const loginMarketRoute = "http://157.230.158.143:8080/authMarket";
const changePasswordRoute = "http://157.230.158.143:8080/changePassword";

console.log("Connecting to http://157.230.158.143:8080");

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

var marketUser = {
    "email": "the@orville.org",
    "password": "something"
}

var marketUser2 = {
    "email": "green@green.org",
    "password": "something"
}

var shopperUser = {
    "username": "JamesPham",
    "password": "something"
}

var shopperUser2 = {
    "username": "Megatron",
    "password": "something"
}

var passOne = "something";
var passTwo = "testing";

// Test change market password with valid info
axios.post(loginMarketRoute, marketUser).then(response => {
    const payload = {
        "curPass": passOne,
        "newPass": passTwo,
        "token": response.data.jwt
    };
    axios.post(changePasswordRoute, payload).then(res => {
        assertTrue(res.data.success, true, "Market: Change password from 'something' to 'testing' should succeed");
        console.log(res.data);
        payload.curPass = passTwo;
        payload.newPass = passOne;
        axios.post(changePasswordRoute, payload).then(res2 => {
            assertTrue(res2.data.success, true, "Market: Change password from 'testing' back to 'something' should succeed");
            console.log(res2.data);
        });
    });
});

// Test change market password with wrong current password
axios.post(loginMarketRoute, marketUser).then(response => {
    const payload = {
        "curPass": passTwo,
        "newPass": passOne,
        "token": response.data.jwt
    };
    axios.post(changePasswordRoute, payload).then(res => {
    }).catch(error => {
        assertTrue(error.response.data.success, false, "Market: Change password with wrong current password should fail");
        console.log(error.response.data);
    });
});

// Test change password without jwt or being logged in
axios.post(changePasswordRoute, {"curPass": passOne, "newPass": passTwo}).then(response => {
}).catch(error => {
    assertTrue(error.response.data.success, false, "Market: Change password with without being logged in should fail");
    console.log(error.response.data);
});


// Test change shopper password
axios.post(loginShopperRoute, shopperUser).then(response => {
    const payload = {
        "curPass": passOne,
        "newPass": passTwo,
        "token": response.data.jwt
    };
    axios.post(changePasswordRoute, payload).then(res => {
        assertTrue(res.data.success, true, "Shopper: Change password from 'something' to 'testing' should succeed");
        console.log(res.data);
        payload.curPass = passTwo;
        payload.newPass = passOne;
        axios.post(changePasswordRoute, payload).then(res2 => {
            assertTrue(res2.data.success, true, "Shopper: Change password from 'testing' back to 'something' should succeed");
            console.log(res2.data);
        });
    });
});

// Test change shopper password with wrong current password
axios.post(loginShopperRoute, shopperUser2).then(response => {
    const payload = {
        "curPass": passTwo,
        "newPass": passOne,
        "token": response.data.jwt
    };
    axios.post(changePasswordRoute, payload).then(res => {
    }).catch(error => {
        assertTrue(error.response.data.success, false, "Shopper: Change password with wrong current password should fail");
        console.log(error.response.data);
    });
});
