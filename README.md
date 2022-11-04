# Npm Initialization

Step 1: `npm init`

Step 2: `touch app.js`

Step 3: Modify `package.json`

```
// changes
"main": "app.js",
"scripts": {
  "start": "node app.js"
}
```

`npm start`

# Eslint & Prettier

<https://gist.github.com/geordyjames/b071e0bb13e74dea94ec37a704d26b8b>

`npm i -D eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-config-airbnb-base eslint-plugin-node eslint-config-node`

Add the following files:

`.eslint.json` -->

```
{
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": ["airbnb-base", "prettier", "plugin:node/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "parser": "flow"
      }
    ],
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-plusplus": "off",
    "no-process-exit": "off",
    "class-methods-use-this": "off"
  }
}


```

`.prettierrc.json` -->

```
{
  "singleQuote": true,
  "tabWidth": 2,
  "avoidEscape": false
}

```

`.prettierignore` -->

```
/node_modules
```

Run eslint json file in CLI:

`npx eslint --init`

# Install Express

`npm install express`

Establish Basic app.js before getting fancy

```
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

```

Note: The Basic Method Structure for Routes
`app.get(PATH, HANDLER)`

# GIT INIT

Totally forgot to git init. I'm rusty, that's why I'm documenting this all again for practice sake. Let's do that and keep different versions as we got through the curriculum.

1. Create a `.gitignore` file and add `node_modules` to line 1.

2. `git init`
3. `git add .`
4. `git commit -m "first commit" `
5. Log onto Github
6. Create new Repository called something along the lines of "my-express-boilerplate"
7. Follow the instructions on the quick setup page to push your repo to github
8. Create a new branch: `git branch logging`
9. Switch to new branch to apply new features: `git checkout logging`
10. Create a new branch from the current branch:

    `git checkout -b feature/new-feature`

# Logging

[Morgan](https://www.npmjs.com/package/morgan)

`npm install morgan`

```
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

```

# Nodemon

`npm install nodemon --save-dev`

add following script to `package.json`:

```
"scripts": {
    "start": "node app",
    "dev": "nodemon app"
},
```

Then start server in development mode

`npm run dev`

# Install CORS

["Cross-Origin Resource Sharing"](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

`npm install cors`

Short version - this just allows for servers on different domains to talk to one another.

# Actually do it all at once:

## Recap:

```
mkdir nytServer && cd $_
npm init -y
touch app.js
npm install nodemon-D
npm install morgan cors dotenv express
<Follow eslint & prettier instructions (optional)>
```

modify package.json:

```
"scripts": {
    "start": "nodemon app"
},
```

# Authorization

For now, real JWT authorization is outside the scope of this project.
We will use a hacky shortcut for generating tokens

DO NOT USE IN REAL LIFE

## Introduction to ENV

Environment variables -- not accessible in source code (aka - keep things secret from github)

Go to [uuidgenerator.net](https://www.uuidgenerator.net/version1) to generate a unique token - save in a txt file for reference

Our application needs to use this UUID when it's validating every request by checking the request's headers.

Environment variables need to be set before server starts so Node can access them using process.env. Close server in a command line and then use the env command to print current environment variables.

`echo $USER` --> pints out system username

How to set the UUID as a environment variable from the CLI.

```
# save the env var
export API_TOKEN=put-your-uuid-here
# print out the env var to check it worked
echo $API_TOKEN
# you should see your UUID printed in the command line
```

and to see the new `API_TOKEN` ENV variable from Express type:

` console.log(process.env.API_TOKEN);

### Note: setting ENV variables this way are only temporary and bound to the specific terminal window. When server restarts - ENV variables must be re-declared.

We can add a temporary ENV variable by prefixing each server start command such as:

```
API_TOKEN=foo node server.js
```

It would be terrible to manually re-enter the key every time server resets. We will use a `.env' file and it is important to have git ignore this file so the key is not in source code.

# How to set up .env file

![keep it secret - keep it safe](./img/1mp8zb.gif)

Make a file called `.env` and append it to your `.gitignore`.

❗️ WE DO NOT WANT THIS FILE ON GITHUB ❗️

```
touch .env
echo ".env" >> .gitignore
```

Store your uuid token in the `.env file`

```
API_TOKEN=put-your-token-here
```

## dotenv

Install a package that automatically syncs the `process.env` object with what is listed in the `.env` file

`npm install dotenv`

Add the dotenv config file to the top of your app.

```
require('dotenv').config();
```

# How to use tokens

Adding middleware to validate requests for `.get('/types')` and `.get('/ pokemon')` - so only authorized elite trainers have access to the data.

```
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})
```

Every request requires

`Authorization: "2b2d2a8e-3ee9-11ed-b878-0242ac120002"`

in Postman "Headers" to work with the requireAuth is being required on all endpoints

to use in a specific endpoint:

`app.get('/types', validateBearerToken, handleGetTypes);`

`app.get('/pokemon', validateBearerToken, handleGetPokemon);`

`app.get('/any-path', middleware1, middleware2, middleware3, ...)`

# Pokemon Search

Example GET query

`http://localhost:8000/pokemon?name=PsyDuCk&type=Water`

Use Fetchful app for client-side Interface

```
git clone https://github.com/tomatau/fetchful.git
cd ./fetchful
npm i
```

Change the fetch request to the following function:

```
  performFetch = () =>
    fetch('http://localhost:8000/pokemon?name=pik&type=Electric', {
      headers: {
        Authorization: 'Bearer 2b2d2a8e-3ee9-11ed-b878-0242ac120002',
      },
    });
```

![fetchful screenshot](./img/fetchful_screenshot.png)

# Helmet

There is a security vulnerability when browsers are making api calls directly from the server like this. A bunch of information is connected with the requests, and some of that should be hidden and Express does not do it on it's own. Install Helmet to all Express Apps.

`npm install helmet`

```
const helmet = require('helmet');
app.use(morgan('dev'))
app.use(helmet)
app.use(cors())
```

Make sure to place helmet before cors in the pipeline. With helmet in place, restart your API and make the request from Fetchful

X-Powered-By header will be removed and others were added

[helmet documentation](https://github.com/helmetjs/helmet#how-it-works)

# Modularized Routers

Divide the API into modules so the `app.js` file doesn't get bloated.

1. Create new file called `test-router.js`
2. Add the following template code

```
const express = require('express');

const testRouter = express.Router();

function getHelloWorld(req, res) {
  res.send('hello world');
}

testRouter.route('/').get(getHelloWorld);

module.exports = testRouter;

```

3. In the `app.js` - import the router

```
const testRouter = require('./test-router');
app.use('/some-endpoint', testRouter);
```

# Endpoint Map

GET '/'
GET '/burgers'
GET '/pizza'
GET '/pizza/pepperoni'
GET 'pizza/pineapple'
GET '/salad' -- (returns intentional error status 500 - No salad for you)

# Notes

The express module exports a top-level function.

That function creates a new application object that encapsulates

## the functionality of your Express server.

Think of Express like a factory with an assembly line. Each handler function is a station along that assembly line. As the request progresses along the assembly line, each handler function may modify it. Eventually, the request gets to the final handler function in the line and a response is sent back to the client.

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. These functions are used to modify req and res objects for tasks like parsing request bodies, adding response headers, etc.

[tutorials point about Express Middleware](https://www.tutorialspoint.com/expressjs/expressjs_middleware.htm)

req is an object that represents the HTTP request and has methods to access the various properties of that request.

[request object documentation](https://expressjs.com/en/4x/api.html#req)

Note to Self: See notes in Notes app for more info on Express

command line to change a file:

`echo "# express-intro-notes" >> README.md`
