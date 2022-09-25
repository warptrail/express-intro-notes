const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// Add a route
app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers here.');
});

// typically want port between 1024 and 65535
app.listen(8000, () => {
  console.log('Express server is listening on port 8000');
}); // go to localhost:8000 to see GET response
