const express = require('express');
const morgan = require('morgan'); // Logging Middleware

// The express module exports a top-level function.
// That function creates a new application object that encapsulates
// the functionality of your Express server.

// Think of Express like a factory with an assembly line. Each handler function
// is a station along that assembly line. As the request progresses along the
// assembly line, each handler function may modify it. Eventually, the request
// gets to the final handler function in the line and a response is sent back to
// the client.

const app = express();
app.use(morgan('dev')); // combined, common, dev, short, tiny

// ? GET requests

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
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

// 204 means no content. This endpoint will spin forever and the send doesn't
// actually send unless you put an end

app.get('/204', (req, res) => {
  res
    .status(204)
    // .send('Does not exist');
    .end();
});

// ? The Request Object

// req is an object that represents the HTTP request and has methods to access
// the various properties of that request.

// res is an object that represents the HTTP response that Express sends to the
// client after the request is processed.

// ^ Let's create a route handler function on the path /echo that will simply
// ^ respond with some details of the request
// https://expressjs.com/en/4x/api.html#req

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    Route: ${JSON.stringify(req.route)}
    protocol: ${req.protocol}
    originalUrl: ${req.originalUrl}
    subdomains: ${req.subdomains}
    stale?: ${req.stale}
  `;
  res.send(responseText);
});

// ? JSON data

// instead of res.send('a string') use res.json({data})

app.get('/video', (req, res) => {
  const video = {
    title: 'Star Trek',
    description: 'Boldly going where no man has gone before',
    length: '100.3',
  };
  res.json(video);
});

// ? The Query Object
app.get('/queryviewer', (req, res) => {
  const { q } = req.query;
  res.send(q);
});

// http://localhost:8000/queryViewer?name=Legolas
// {name: 'Legolas'}

app.get('/greetings', (req, res) => {
  // 1. get values from the request
  const { name } = req.query;
  const { race } = req.query;

  // 2. Validate the values
  if (!name) {
    res.status(400).send('Please provide a name');
  }

  if (!race) {
    res.status(400).send('Please provide a race');
  }

  // 3. if values are validated
  const greeting = `Greetings ${name} the ${race}. Welcome to our kingdom.`;

  // 4. send the response
  // http://localhost:8000/queryViewer?name=Legolas&race=elf
  res.send(greeting);
});

// ? Debugging using conditionals and query parameters

// Getting a grade from the score from the url

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
// ? This basically makes the server go on a specific port

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

// Todo Combine this app with my boilerplate reboot 2022-09-25
