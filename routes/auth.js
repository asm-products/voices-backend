var jwt = require('jwt-simple');
var User = require('../model/user.js');
 
var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    auth.validate(username, password, function(error, dbUserObj) {
      if (!dbUserObj || error != null) {
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }

      if (dbUserObj) {
        res.json(genToken(dbUserObj));
      }
    });
   
  },

  register: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var mobileNumber = req.body.mobileNumber || '';

    if (username == '' || password == '' || mobileNumber == '') {
      res.status(400);
      res.json({
        "status": 400,
        "message": "Missing required fields"
      });
      return;
    }

    // Fire a query to your DB and check if the username is available
    auth.isUsernameAvailable(username, function(error, usernameAvailable) {
      if (error) {
        res.status(500);
        res.json({
          "status": 500,
          "message": "Unknown error"
        });
        return;
      }

      if (!usernameAvailable) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Username is taken"
        });
        return;
      }

      auth.registerUser(username, password, mobileNumber, function(error) {
        if (error == null) {
          res.status(201);
          res.json({
            "status": 201,
            "message": "User successfully created"
          });
          return;
        }

        res.status(500);
        res.json({
          "status": 500,
          "message": "Unknown error"
        });
      });
    });
  },

  validate: function(username, password, done) {
    User.findOne({'username':username},function(err, user) {
      if (user != null && err == null && user.password === password) {
        done(null, user);
        return;
      }
      done(err, null);
    });
  },
 
  isUsernameAvailable: function(username, done) {
    User.findOne({'username':username},function(err, user) {
      var userExists = (user != null);
      done(err, !userExists);
    });
  },

  registerUser: function(username, password, mobile, done) {
    var newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.mobile = mobile;

    newUser.save(function(err) {
      done(err);
    });
  }
};
 
// private method
function genToken(user) {
  var expires = expiresIn(1); // 1 day
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;
