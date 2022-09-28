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

# Actually do it all at once:

## Recap:

```
mkdir nytServer && cd $_
npm init -y
touch app.js
npm install nodemon-D
npm install morgan cors express
<Follow eslint & prettier instructions (optional)>
```

modify package.json:

```
"scripts": {
    "start": "nodemon app"
},
```
