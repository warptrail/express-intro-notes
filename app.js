const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const books = require('./newyorktimesbestsellersData.js');

const app = express();
// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('common'));
app.use(cors());

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
  console.log(req.query);
  res.end();
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

// typically want port between 1024 and 65535
app.listen(8000, () => {
  console.log('Express server is listening on port 8000');
}); // go to localhost:8000 to see GET response
