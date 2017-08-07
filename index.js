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

// status check
app.get('/', function(req, res) {
console.log(randomWord);

req.session.randomWord = randomWord
console.log(req.session)

res.render('index', {
  dashes: dashes,
  guessed: guessed,
  remainingGuesses: remainingGuesses,
  win: winner,
  lose: loser
})
})

// guess a letter
app.post('/', function(req, res) {
  let letter = req.body.letter
  guessed.push(letter)

// if random word contains guessed letters
if(!randomWord.includes(letter)) {
// subtract one from remainingGuesses if wrong letter guessed
  remainingGuesses -= 1
}

// loop through word's letters
dashes = ''
for(let i = 0; i < randomWord.length; i++) {
  let letter = randomWord[i]
  if(guessed.includes(letter)) {
    dashes += letter
  } else {
    dashes += '_'
  }
}

if(!dashes.includes('_')) {
  res.render('win', {message: win})
} else if (remainingGuesses === 0) {
  res.render('lose', {message: lose})
} else {
  res.redirect('/')
}
})

// app.listen(3000, function() {
//   console.log("It's all good, you got this!!!");
// })
