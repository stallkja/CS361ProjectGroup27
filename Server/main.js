const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const fs = require('fs');
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

var pool = mysql.createPool(settings.dbConnection);

//var Emailer = nodemailer.createTransport(settings.nodeMailer);


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', settings.porthttp);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post("/CreateAccount", function(req, res) {
    var toReturn = { "isErrored": false };
    if (req.body != null) {

        if (req.body.email == null || req.body.email == "") {
            toReturn.isErrored = true;
            toReturn.email = "No email";
        } else if (!req.body.email.includes("@")) {
            toReturn.isErrored = true;
            toReturn.email = "Not an email";
        } else if (req.body.email.length > 255) {
            toReturn.isErrored = true;
            toReturn.email = "Email too long";
        }

        if (req.body.password == null || req.body.password == "") {
            toReturn.isErrored = true;
            toReturn.password = "No password";
        } else if (req.body.password.length < 8) {
            toReturn.isErrored = true;
            toReturn.password = "Password too short";
        } else if (req.body.password.length > 72) {
            toReturn.isErrored = true;
            toReturn.password = "Password too long";
        }

        if (req.body.username == null || req.body.username == "") {
            toReturn.isErrored = true;
            toReturn.username = "No username";
        } else if (req.body.username.length < 8) {
            toReturn.isErrored = true;
            toReturn.username = "Username too short";
        } else if (req.body.username.length > 64) {
            toReturn.isErrored = true;
            toReturn.username = "Username too long";
        }

        if (req.body.homeLat < -90) {
            toReturn.isErrored = true;
            toReturn.homeLat = "Latitude outside domain";
        } else if (req.body.homeLat > 90) {
            toReturn.isErrored = true;
            toReturn.homeLat = "Latitude outside domain";
        }

        if (req.body.homeLng < -180) {
            toReturn.isErrored = true;
            toReturn.homeLng = "Longitude outside domain";
        } else if (req.body.homeLng > 180) {
            toReturn.isErrored = true;
            toReturn.homeLng = "Longitude outside domain";
        }
        if (toReturn.username == null) {
            pool.query("SELECT * FROM users where username=?", req.body.username, function(err, result) {
                if (err != null)
                    console.log(err);
                else if (result.length > 0) {
                    toReturn.isErrored = true;
                    toReturn.username = "Username is already taken";
                    res.send(JSON.stringify(toReturn));
                } else {
                    if (toReturn.isErrored == false) {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                if (err != null)
                                    console.log(err);
                                pool.query("insert into users(username, email, salt, passwordHash, homeLat, homelng) values (?, ?, ?, ?, ?, ?);", [req.body.username, req.body.email, salt, hash, req.body.homeLat, req.body.homeLng],
                                    function(err, result) {
                                        if (err != null)
                                            console.log(err);
                                        else
                                            res.send(JSON.stringify(toReturn));
                                    });
                            });
                        });
                    }
                }
            })
        } else {
            res.send(JSON.stringify(toReturn));
        }
    } else {
        toReturn.isErrored = true;
        res.send(JSON.stringify(toReturn));
    }


});





//for unit testing only
app.post("/queryAccounts", function(req, res) {
    pool.query("SELECT * FROM users where username=? and email='fake@gmail.com'", req.body.username, function(err, result) {
        if (err != null)
            console.log(err);
        else {
            res.send(JSON.stringify(result));
        }
    })
});










app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});