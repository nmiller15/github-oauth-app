/* 
 * Package Imports
*/

const path = require("path");
require("dotenv").config();
const express = require('express');
const partials = require('express-partials');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;


const app = express();


/*
 * Variable Declarations
*/

const PORT = 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/*
 * Passport Configurations
*/
passport.use(new GitHubStrategy(
    {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }, 
    function(accessToken, refreshToken, profile, done) {
      return done( null, profile );
    }
  )
)
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})


/*
 *  Express Project Setup
*/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'codecademy',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.session());


/*
 * Routes
*/

app.get('/auth/github', passport.authenticate('github', { scope: 'user' }));

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
  successRedirect: '/'
}))

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




/*
 * Listener
*/

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
*/
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}


// Tutorial link: https://www.codecademy.com/journeys/full-stack-engineer/paths/fscj-22-back-end-development/tracks/fscj-22-user-authentication-authorization/modules/wdcp-22-oauth-2-5f34be97-c15d-455b-b8bf-159e7e8d099b/articles/oauth2-project
