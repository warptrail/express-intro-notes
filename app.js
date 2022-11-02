require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Router Imports
const testRouter = require('./test-router');
const moviesRouter = require('./movies-router');

// Data Imports
const books = require('./newyorktimesbestsellersData.js');
const POKEDEX = require('./pokedex.json');

const app = express();
// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

// test ENV variable
console.log(process.env.API_TOKEN);

// ? Validation Middleware
app.use((req, res, next) => {
  const authToken = req.get('Authorization');

  const apiToken = process.env.API_TOKEN;

  // when tokens do not match:
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// This is the final request handler
app.get('/', (req, res) => {
  res.send('Hello Express!');
});
// ! Test Routes
// Add a route
app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers here.');
});

// Send information about the request object
app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  res.json(req.query);
});

// http://localhost:8000/queryViewer?name=Legolas
// { name: 'Legolas' }
// http://localhost:8000/queryViewer?name=Legolas&race=elf
// { name: 'Legolas', race: 'elf' }

app.get('/greetings', (req, res) => {
  // 1. get values from the request
  const { name, race } = req.query;

  // 2. validate the values
  if (!name) {
    // 3. name was not provided
    res.status(400).send('provide name in query');
  }
  if (!race) {
    // 4. race was not provided
    res.status(400).send('provide race in query');
  }

  // 5. name and race pass validation - process the greeting
  const greeting = `Greetings ${name} the ${race}. Welcome to our Kingdom`;
  res.send(greeting);
});

// Proper way to use a 204 status request
app.get('/nothing', (req, res) => {
  console.log('nothing here');
  res.status(204).end();
  // This ends the request
  // and the response is sent as is back to the client.
});

//! New York Times Best Sellers API

app.get('/books', (req, res) => {
  const { search = ' ', sort } = req.query;

  const results = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLocaleLowerCase())
  );

  // input validation required for sort

  if (sort) {
    if (!['title', 'rank'].includes(sort)) {
      res.status(400).send('Sort must be one of title or rank');
    }
  }

  if (sort) {
    results.sort((a, b) =>
      a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
    );
  }

  res.json(results);
});

//! Pokemon

// Here it becomes more important to have the callback function
// as a named function for reusability

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

const handleGetTypes = (req, res) => {
  console.log(process.env.API_TOKEN);
  res.json(validTypes);
};

app.get('/types', handleGetTypes);

// Going to test the authorization heder from process.env

const handleGetPokemon = (req, res) => {
  // res.send('gotta catch them all');

  let response = POKEDEX.pokemon;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }
  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    response = response.filter((pokemon) =>
      pokemon.type.includes(req.query.type)
    );
  }

  res.json(response);
};

app.get('/pokemon', handleGetPokemon);

// Movies App:
app.use('/some-endpoint', testRouter);
app.use('/movies', moviesRouter);

// typically want port between 1024 and 65535

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
}); // go to localhost:8000 to see GET response
