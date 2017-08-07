const express = require('express');
const fs = require('fs');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
// const handlebars = require('handlebars');


// create mystery word app
const app = express();

const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toLowerCase()
  .split("\n")


// mustache-express as template engine
app.engine('mustache', mustacheExpress());
app.set('views', '.views'); //********check path
app.set('view engine', 'mustache');

// static files
app.use(express.static('public'));

// parse data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// session middleware
app.use(expressSession({
  secret: 'shontae', //password
  resave: false, //dont save session
  saveUninitialized: true //force session that is unitialized to be saved
})
);



// validation middleware
app.use(expressValidator());
app.use((req, res, next) => {
  if(!req.session.word) {
    req.session.word = [];
  }
  next();
});

// variables

let guessed = []

const randomWord = words[Math.floor(Math.random() * words.length)];

let dashes = "_"
  .repeat(randomWord.length);
let remainingGuesses = 8
let win = "Winner!!!"
let lose = "Sorry, better luck next time..."

console.log(randomWord);
