const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const SECRET = 'l3jx3toxSsjnynwOFzliWbAryTD7mcKG';


var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var pool = mysql.createPool(settings.dbConnection);

var defaultLogFile;
if(settings.LogToFile)
	defaultLogFile = fs.createWriteStream(path.join(__dirname, settings.defaultLog), { flags: 'a' });
var SecurityLogFile = fs.createWriteStream(path.join(__dirname, settings.SecurityLog), { flags: 'a' });
var Emailer = nodemailer.createTransport(settings.nodeMailer);


app.use(cookieParser());
app.use(morgan('combined', { stream: SecurityLogFile }));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', settings.porthttp);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const LOG_TYPE = {
  INFO:3,
  ERROR:2,
  STATUS_BAD:2,
  STATUS_GOOD:1,
}

LogMsg = function(msg, type = LOG_TYPE.ERROR)
{
	if(settings.SendEmailError)
	{
		if(type == 2)
		{
			var mailOptions = settings.mailOptions
			mailOptions.subject = 'ERROR AT: ' + (new Date()).toISOString()
			mailOptions.text = msg;
			transporter.sendMail(mailOptions);
		}
	}
	
	if(settings.LogToFile)
	{
		var currentDate = new Date().toLocaleString(undefined, {day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit',minute: '2-digit',});
		switch(type)
		{
			case 1:
				defaultLogFile.write(currentDate + " - GOOD:" + msg + "\n");
				break;
			case 2:
				defaultLogFile.write(currentDate + " - ERRO:" + msg+ "\n");
				break;
			case 3:
				defaultLogFile.write(currentDate + " - INFO:" + msg+ "\n");
				break;
		}
	}
	
	if(settings.LogToConsole)
	{
		switch(type)
		{
			case 1:
				console.log("\x1b[32mGOOD:\x1b[0m" + msg);
				break;
			case 2:
				console.log("\x1b[31mERRO:\x1b[0m" + msg);
				break;
			case 3:
				console.log("INFO:" + msg);
				break;
		}
	}
}

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
                  {
                    LogMsg(err, LOG_TYPE.ERROR);
                  }
                else if (result.length > 0) {
                    toReturn.isErrored = true;
                    toReturn.username = "Username is already taken";
                    res.send(JSON.stringify(toReturn));
                } else {
                    if (toReturn.isErrored == false) {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                if (err != null)
                                {
                                  LogMsg(err, LOG_TYPE.ERROR);
                                }
                                pool.query("insert into users(username, email, salt, passwordHash, homeLat, homelng) values (?, ?, ?, ?, ?, ?);", [req.body.username, req.body.email, salt, hash, req.body.homeLat, req.body.homeLng],
                                    function(err, result) {
                                        if (err != null)
                                        {
                                          LogMsg(err, LOG_TYPE.ERROR);
                                        }
                                        else
                                            res.send(JSON.stringify(toReturn));
                                    });
                            });
                        });
                    }
                    else
                    {
                        res.send(JSON.stringify(toReturn));
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

/* Authentication middleware */
app.use('/home', function (req, res, next) {
  if(req.cookies) {
    jwt.verify(req.cookies.jwt, SECRET, (err, decoded) => {
      if(decoded) {
        LogMsg(JSON.stringify(decoded), LOG_TYPE.INFO);
      }
      else {
        LogMsg("JWT decoding failed. Redirecting to login page.", LOG_TYPE.INFO);
        res.render('login');
        return;
      }
      next();
    });
  }
  else {
    res.render('login');
    return;
  }
});

/* Default home page */
app.get('/', function(req, res){
  var context = { title: 'Home' }
  res.render('home', context);
});

/* Logged in page */
app.get('/home', function(req, res){
  var context = { title: 'Authenticated' }
  res.render('authenticated', context);
});

/* Logged in change password page */
app.get('/home/changePassword', function(req, res){
  var context = { title: 'Change Password' }
  res.render('changePassword', context);
});

app.get('/marketHome', function(req, res){
   var context = {title: 'Market Home Page'};
   res.render('marketHome', context);	
});

/*New market applies for market account*/
app.post('/createMarket',function(req, res){
   var toReturn = {"isErrored": false};
   res.status(400);
   if(req.body != null) {

   //Validate the market name	
   if(req.body.marketName == null || req.body.marketName == ""){
      toReturn.isErrored = true;
      toReturn.marketName = "No Name";
   }
   else if(req.body.marketName.length > 255) {
       toReturn.isErrored = true;
       toReturn.marketName = "Name too long";	 
   }
 
   //Validate the email	  
   if(req.body.email == null || req.body.email == ""){
      toReturn.isErrored = true;
      toReturn.email = "No email";
   }
   else if(!req.body.email.includes("@")){
      toReturn.isErrored = true;
      toReturn.email = "Not an email";
   }	 
   else if(req.body.email.length > 255){
       toReturn.isErrored = true;
       toReturn.email = "Email too long";
   } 	

   //Validate the phone number	
   if(req.body.phone == null || req.body.phone == ""){
      toReturn.isErrored = true;
      toReturn.phone = "No phone";
   }	
   else if(req.body.phone.length > 255){
       toReturn.isErrored = "true";
       toReturn.phone = "Invalid phone number";	
   }	

   //Validate the contact
   if(req.body.contact == null || req.body.contact == ""){
      toReturn.isErrored = true;
      toReturn.contact = "No contact";
   }	
   else if(req.body.contact.length > 255){
       toReturn.isErrored = "true";
       toReturn.contact = "Invalid contact";	
   }
	
   //Validate address
   if(req.body.address == null || req.body.address == ""){
      toReturn.isErrored = true;
      toReturn.address = "No address";
   }	
   else if(req.body.address.length > 255){
       toReturn.isErrored = "true";
       toReturn.address = "Invalid address";	
   }	
   
   //Validate the city
   if(req.body.city == null || req.body.city == ""){
      toReturn.isErrored = true;
      toReturn.city = "No city";
   }	
   else if(req.body.city.length > 255){
       toReturn.isErrored = "true";
       toReturn.city = "Invalid city";	
   }

   //Validate the state
   if(req.body.state == null || req.body.state == ""){
      toReturn.isErrored = true;
      toReturn.state = "No state";
   }	
   else if(req.body.state.length > 2){
       toReturn.isErrored = "true";
       toReturn.state = "Use state abbreviation.";	
   }
   //Validate the zip
   if(req.body.zip == null || req.body.zip == ""){
      toReturn.isErrored = true;
      toReturn.zip = "No zip";
   }	
   else if(req.body.zip.length > 255){
       toReturn.isErrored = "true";
       toReturn.zip = "Invalid zip";	
   }

   if(toReturn.marketName == null){
     pool.query("SELECT * FROM market_users m WHERE m.name=?", req.body.marketName, function(err, result){
       if(err != null){
          console.log(err);
       }
       else if(result.length > 0){
          toReturn.isErrored = true;
	  toReturn.marketName = "Market with that name already exists";
	  res.send(JSON.stringify(toReturn));    
       }
       else{
         if(toReturn.isErrored == false){
           res.status(200);
	   console.log("input is valid");
	    bcrypt.genSalt(10, function(err, salt){
	      bcrypt.hash(req.body.password, salt, function(err, hash){
          if(err != null)
          {
            LogMsg(err, LOG_TYPE.ERROR);
          }	
		pool.query("INSERT INTO market_users (name, passwordHash,  email, phone, contact, address, city, state, zip, status, salt ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [req.body.marketName, hash, req.body.email, req.body.phone, req.body.contact, req.body.address, req.body.city, req.body.state, req.body.zip, "Pending", salt ], function(err, result){
      if(err != null)
      {
        LogMsg(err, LOG_TYPE.ERROR);
      }
		  
                  else
		    res.send(JSON.stringify(toReturn));
		  
		});       
	      });
	    });
	 }
	 else
           res.send(JSON.stringify(toReturn)); 
       }
           
     });
   }
	else {
         res.send(JSON.stringify(toReturn));   
	}
    
  }
  else{ 
       toReturn.isErrored = true;
       res.send(toReturn);
     }
});

/* Username and password authentication for Shoppers, React Native App */
app.post('/auth', function(req, res) {

  let response = {
    auth: null,
    success: false,
    jwt: null,
  };

  if(!req.body || !req.body.username || !req.body.password) {
    response.auth = 'Bad parameters';
    res.status(500).json(response);
    return;
  }

  pool.query('SELECT * FROM users WHERE username=?', 
    [req.body.username], 
    function(err, result, fields){
      if(err) {
        LogMsg(err, LOG_TYPE.ERROR);
        response.auth = 'Server Error';
        res.status(500).json(response);
        return;
      }
      if(result.length) {
        //console.log(result);

        bcrypt.compare(req.body.password, result[0].passwordHash, function(berr, bres) {
            if(berr) {
                //console.log(berr);
                response.auth = 'Server Error';
                res.status(500).json(response);
                return;
            }
            if(bres) {
              response.auth = 'Valid';
              response.success = true;
              response.jwt = jwt.sign({username: req.body.username, type: "shopper", exp: Date.now() / 1000 + 60 * 60 * 24 * 7}, SECRET);
              res.status(200).json(response);
            }
            else {
              response.auth = 'Invalid';
              res.status(403).json(response);
            }
        });
      }
      else {
        response.auth = 'Not Found';
        res.status(403).json(response);
      }
  });
});


app.get("/newMarket", function(req, res){
var context = {};
console.log("testing");
	res.render("newMarket", context);
});

/* Username and password authentication for market accounts through web app */
app.post('/authMarket', function(req, res) {
  //console.log(req.body);
  // error handling for body contains email and password

  let response = {
    auth: null,
    success: false,
    jwt: null,
  };

  if(!req.body || !req.body.email || !req.body.password) {
    response.auth = 'Bad parameters';
    res.status(500).json(response);
    return;
  }

  pool.query('SELECT * FROM market_users WHERE email=?', 
    [req.body.email], 
    function(err, result, fields){
      if(err) {
        LogMsg(err, LOG_TYPE.ERROR);
        response.auth = 'Server Error';
        res.status(500).json(response);
        return;
      }
      if(result.length) {
        //console.log(result);

        bcrypt.compare(req.body.password, result[0].passwordHash, function(berr, bres) {
            if(berr) {
              //LogMsg(berr, LOG_TYPE.ERROR);
                response.auth = 'Server Error';
                res.status(500).json(response);
                return;
            }
            if(bres) {
              response.auth = 'Valid';
              response.success = true;
              response.jwt = jwt.sign({username: req.body.email, type: "market", exp: Date.now() / 1000 + 60 * 60 * 24 * 7}, SECRET);
              res.status(200).json(response);
            }
            else {
              response.auth = 'Invalid';
              res.status(403).json(response);
            }
        });
      }
      else {
        response.auth = 'Not Found';
        res.status(403).json(response);
      }
  });
});

/* Change password for market accounts through web app */
app.post('/changePassword', function(req, res) {
  //console.log(req.body);
  // error handling for body contains email and password

  let response = {
    message: null,
    success: false,
  };

  if(!req.body || !req.body.curPass || !req.body.newPass || !req.body.token) {
    response.message = 'Bad parameters';
    res.status(500).json(response);
    return;
  }

  jwt.verify(req.body.token, SECRET, (err, decoded) => {
    if(decoded) {
      let sqlQuery;
      if(decoded.type === "shopper") {
        sqlQuery = 'SELECT * FROM users WHERE username=?';
      }
      else if(decoded.type === "market") {
        sqlQuery = "SELECT * FROM market_users WHERE email=?";
      }

      pool.query(sqlQuery, 
      decoded.username, 
      function(err, result, fields){
        if(result.length) {
          bcrypt.compare(req.body.curPass, result[0].passwordHash, function(berr, bres) {
            // curPassword matched database password
            if(bres) {
              // make new hash
              bcrypt.hash(req.body.newPass, 10, function(hashErr, hash) {
                // update DB
                let sqlUpdate;
                if(decoded.type === "shopper") {
                  sqlUpdate = "UPDATE users SET passwordHash=? WHERE username=?";
                }
                else if(decoded.type === "market") {
                  sqlUpdate = "UPDATE market_users SET passwordHash=? WHERE email=?";
                }
                pool.query(sqlUpdate, 
                  [hash, decoded.username],
                  function(Qerr, Qresult, Qfields){
                    if(Qerr) {
                      response.message = "Server error";
                      res.status(500).json(response);
                      return;
                    }
                    // DB query failed
                    else {
                      response.message = "Updated password";
                      response.success = true;
                      res.status(200).json(response);
                      return;
                    }
                  });
              });
            }
            // curPass invalid
            else {
              response.message = "Wrong current password";
              res.status(403).json(response);
              return;
            }
          });
        }
      });
    }
    else {
      response.message = "User must be logged in to change password";
      res.status(403).json(response);
      return;
    }
  });
});


//for unit testing only
app.post("/queryAccounts", function(req, res) {
    pool.query("SELECT * FROM users where username=? and email='fake@gmail.com'", req.body.username, function(err, result) {
        if (err != null)
        {
          LogMsg(err, LOG_TYPE.ERROR);
        }
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
    LogMsg(err.stack, LOG_TYPE.ERROR);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
