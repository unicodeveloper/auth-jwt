require('dotenv').load();
var  express       = require('express'),
     jwt           = require('jsonwebtoken');
     morgan        = require('morgan'),
     bodyParser    = require('body-parser'),
     mongoose      = require('mongoose'),
     User          = require('./server/models/user.model'),
     cor           = require('cors'),
     secrets       = require('./config/secrets'),
     testdb        = require('./config/testdb'),
     route         = require('./server/routes'),
     passport      = require('passport'),
     LocalStrategy = require('passport-local').Strategy,
     cookieParser  = require('cookie-parser'),
     session       = require('express-session');

var port = process.env.PORT || 3030;

/**
 * Connect to MongoDB.
 */
testdb.dbconnect();


/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true})); //use bodyParser for request and parsing info
app.use(bodyParser.json());
app.use(session({
  secret: secrets.sessionSecret,
  resave: true,
  saveUninitialized: true }));
app.use(passport.initialize()); //initialize passport middleware
app.use(passport.session()); //Tell passport to use sessionsapp.use(prerender.set('prerenderToken', secrets.prerenderToken)) //Tell prerender.io to serve your cached pages to improve SEapp.use( express.static( __dirname + '/public')); //use to serve static files like favicon, css, angular and the rest

// app.get('/setup', function(req, res) {

//   // create a sample user
//   var nick = new User({
//     name: 'Prosper Otemuyiwa',
//     email: 'prosper@gmail.com',
//     user_avatar: 'http://prisper.dfhdhfdfhd',
//     password: 'prosper',
//     admin: true
//   });

//   // save the sample user
//   nick.save(function(err) {
//     if (err) throw err;

//     console.log('User saved successfully');
//     res.json({ success: true });
//   });
// });

/**
 * Routes Configuration
 */
route(app);


/**
 * Start Express server.
 */
app.listen( port, function(){
  console.log("authJwt Server Listening on port ", port );
});