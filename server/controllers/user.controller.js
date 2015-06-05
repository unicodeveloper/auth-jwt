var User        = require('../models/user.model');

module.exports = {
  welcome: function(req, res){
    res.status(200).json({ message: 'Welcome to our api shinanengan'});
  },

  registerUser: function(req, res){
    var user  = new User();
    var token = jwt.sign(user, secrets.sessionSecret, { expiresInMinutes: 1440 });

    user.username = req.body.username;
    user.email     = req.body.email;
    user.password  = user.hashPassword(req.body.password);

    user.save( function(err, users){
      if(err) {
        if(err.name == 'MongoError') {
          res.status(400).json({ err: err, error: 'Email is already registered before. Please choose another' });
        } else {
          res.status(500).json({ error: 'Server error' });
        }
      } else {
        res.status(200).json({ token: token, success: true, message: "User Registered successfully" });
      }
    });
  },

  authenticateUser: function(req, res){
    User.find({email: req.body.email}, function(err, user) {
      if(err){
        res.status(500).json({ error: 'Server Error'});
      }

      if(user.length === 0){
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
      else if(user.length == 1) {
        var users = new User();
        users.comparePassword(req.body.password, user[0].password, function(err, result){

          if(err){
            res.status(500).json({ error: 'Server Error'});
          }

          if(result){
            res.json({
              success: true,
              message: 'User authenticated successfully',
              token: user[0].token
            });
          } else {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          }
      });
    }});
  },

  getAllUsers: function(req, res){
     User.find({}, function(err, users) {
        res.json(users);
     });
  }
};