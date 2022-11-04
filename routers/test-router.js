const express = require('express');

const testRouter = express.Router();

function getHelloWorld(req, res) {
  res.send('hello world');
}

testRouter.route('/').get(getHelloWorld);

module.exports = testRouter;
