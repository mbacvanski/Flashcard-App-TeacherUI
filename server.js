// set up =====================================================================
// get all the tools we need
var express = require('express');
var app = express(); //Create our app, using our new superpowers
var port = process.env.PORT || 8080; //The port the app is running on
var mongoose = require('mongoose'); //For MongoDB
var passport = require('passport'); //Allows us to do authentication
var flash = require('connect-flash'); //Flash messages in session

var morgan = require('morgan'); //Logs HTTP requests
var cookieParser = require('cookie-parser'); //Parses cookie info
var bodyParser = require('body-parser'); //Parses HTTP PUT and POST bodies
var configDB = require('./config/database.js'); //Configuration stuff the db

var session = require('express-session'); //Sessions.

// configuration ==============================================================
mongoose.connect(configDB.studentData); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.listen(port);
    console.log('The magic happens on port ' + port);
});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating. HTML, awesomified.

// required for passport
app.use(session({secret: 'amalgamation'})); // signs sessions using this secret

app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize()); //initalizes passport
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session

// routes =====================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);
