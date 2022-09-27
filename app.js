const express = require('express');
const morgan = require('morgan');

const app = express();
// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));

// This is the final request handler
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

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

// typically want port between 1024 and 65535
app.listen(8000, () => {
  console.log('Express server is listening on port 8000');
}); // go to localhost:8000 to see GET response
