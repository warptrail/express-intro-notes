require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Router Imports
const testRouter = require('./routers/test-router');
const moviesRouter = require('./routers/movies-router');

// Data Imports
const books = require('./data/newyorktimesbestsellersData.js');
const POKEDEX = require('./data/pokedex.json');
const validPokemonTypes = require('./data/validPokemonTypes');

// This is the backend app
const app = express();
// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

// test ENV variable for secrets... like login authentication codes
console.log(process.env.API_TOKEN);

function requestInfoObject(req) {
  return `Here are some details of your request:
  Base URL: ${req.baseUrl}
  Host: ${req.hostname}
  Path: ${req.path}
  Route: ${JSON.stringify(req.route)}
  protocol: ${req.protocol}
  originalUrl: ${req.originalUrl}
  subdomains: ${req.subdomains}
  stale?: ${req.stale}
  `;
}

// ? Validation Middleware
app.use((req, res, next) => {
  // This will come from the client's request in the header when they fetch
  const authToken = req.get('Authorization');

  const apiToken = process.env.API_TOKEN;

  // when tokens do not match:
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// next middleware a timestamp on requests received
// Simple request time logger
app.use((req, res, next) => {
  console.log(`A new request received at ${Date.now()}`);
  console.log('wow wow wow');
  console.log(requestInfoObject(req));

  // This function call is very important. It tells that more processing is
  // required for the current request and is in the next middleware
  // function route handler.
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

app.get('/pizza', (req, res) => {
  res.send('We have pizza!');
});

app.get('/pizza/pepperoni', (req, res) => {
  res.send('We have pepperoni pizza!');
});

app.get('/pizza/pineapple', (req, res) => {
  res.send('You have chosen wisely.');
});

app.get('/salad', (req, res) => {
  res.status(500).send('No Salad for you!');
});

// Send information about the request object

app.get('/echo', (req, res) => {
  res.send(requestInfoObject(req));
});

// instead of res.send('a string') use res.json({data})

app.get('/video', (req, res) => {
  const video = {
    title: 'Star Trek',
    description: 'Boldly going where no man has gone before',
    length: '100.3',
  };
  res.json(video);
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

app.get('/requestitself', (req, res) => {
  const request = req;
  console.log(typeof request);
  res.status(202);
  res.end();
});

// ! Grade API
app.get('/grade', (req, res) => {
  // get the mark from the query
  const { mark } = req.query;

  // do some validation
  if (!mark) {
    // if no mark
    res.status(400).send('Please provide a mark');
  }
  const numericMark = parseFloat(mark);
  if (Number.isNaN(numericMark)) {
    // if mark is not a number
    res.status(400).send('Mark must be a numeric value');
  }
  if (numericMark < 0 || numericMark > 100) {
    // mark must be in range 0 to 100
    res.status(400).send('Mark must be in range 0 to 100');
  }

  if (numericMark >= 90) {
    res.send('A');
  }
  if (numericMark >= 80) {
    res.send('B');
  }
  if (numericMark >= 70) {
    res.send('C');
  }
  if (numericMark >= 60) {
    res.send('D');
  }

  res.send('F');
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

  // ? Basic Sorting Function:
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

const handleGetTypes = (req, res) => {
  console.log(process.env.API_TOKEN);
  res.json(validPokemonTypes);
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

// ! Movies App:
// Here we are putting the routes in another file as the app.js file is
// getting to be too large
app.use('/some-endpoint', testRouter);
app.use('/movies', moviesRouter);

// typically want port between 1024 and 65535

const PORT = 8000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server is listening on port ${PORT}`);
}); // go to localhost:8000 to see GET response
