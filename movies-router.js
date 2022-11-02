const express = require('express');

const data = require('./movies-data.json');

const generateRandomArrayNoRep = require('./randNumNoRep');

const moviesRouter = express.Router();

function getMovies(req, res) {
  let response = [...data];

  // if (req.query.film_title) {
  //   response = [];
  //   for (let i = 0; i < data.length; i++) {
  //     response.push(data[i].film_title);
  //   }
  // }

  if (req.query.film_title) {
    const newResponse = response.filter((movie) =>
      movie.film_title
        .toString()
        .toLowerCase()
        .includes(req.query.film_title.toLowerCase())
    );
    response = newResponse;
  }

  if (req.query.country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.actors) {
    response = response.filter((movie) =>
      movie.actors.toLowerCase().includes(req.query.actors.toLowerCase())
    );
  }

  if (req.query.genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  // const obj = {};

  // const isEmpty = Object.keys(obj).length === 0;
  // console.log(isEmpty); // 👉️ true

  // if no req.query then select 10 random movies to respond
  if (Object.keys(req.query).length === 0) {
    const arr = generateRandomArrayNoRep(0, data.length - 1, 10);
    response = [];
    arr.forEach((i) => response.push(data[i]));
  }

  // response = response.filter((m) => m.film_title === 'Ride a Wild Pony');
  res.json(response);
}

moviesRouter.route('/').get(getMovies);

module.exports = getMovies;
