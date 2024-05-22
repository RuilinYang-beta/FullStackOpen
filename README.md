# About

This repo contains my solutions to the [Full Stack Open course](https://fullstackopen.com/en/) from University of Helsinki.

# React Useful commands

## Init

Create and run the demo app with Vite.

```
# npm 6.x (outdated, but still used by some):
npm create vite@latest part1 --template react

# npm 7+, extra double-dash is needed:
npm create vite@latest <app_name> -- --template react

cd part1
npm install
npm run dev
```

## Silence ESLint warning (for now)

You can silence the warning `react/prop-types` by adding to the file `.eslintrc .cjs` the next line

```
module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
     'eslint:recommended',
     'plugin:react/recommended',
     'plugin:react/jsx-runtime',
     'plugin:react-hooks/recommended',
   ],
   ignorePatterns: ['dist', '.eslintrc.cjs'],
   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
   settings: { react: { version: '18.2' } },
   plugins: ['react-refresh'],
   rules: {
     'react-refresh/only-export-components': [
       'warn',
       { allowConstantExport: true },
     ],

     'react/prop-types': 0  // adding this line
   },
}
```

## JSON-server

To use without install:

```
npx json-server --port 3001 --watch db.json
```

Install and run:

```
npm install -g json-server  // global install, or
npm install json-server --save-dev // only for this project as dev dependency
json-server --port 3001 --watch db.json
```

# NodeJS Useful Commands

## Init

```
// cd into the desired project folder
npm init
```

In the generated `package.json`:

```
  "scripts": {
    "start": "node index.js",   // add this line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

In terminal, run the script like this:

```
npm start
```

## Update Dependencies

```
npm update
```

## `nodemon`

```
npm install --save-dev nodemon

// in package.json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",    // add this line
    "test": "echo \"Error: no test specified\" && exit 1"
  },


npm run dev
```

## REST client documentation

https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage
"One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. "

# Deployment with Fly.io

fly commands

```
fly auth login
fly launch              // init an app by running the command in the root directory of the app
fly deploy
fly logs
fly apps open           // open the app in the browser
fly scale show          // show the machine/CPU/memory the app is allocated
fly ping -o personal    // pin the default organization
fly secrets set MONGODB_URI="..."     // set env variables in production mode
```

streamline (building frontent) -> (add it to backend as static file):
see the script at `part3/phonebook-backend/package.json`

# Testing

When writing the test, you may want to only execute only specific tests

```
npm run test -- tests/note_api.test.js    // run tests in this file
npm run test -- --test-name-pattern="(PART_OF)_NAME_OF_THE_TEST"    // run tests with this name pattern
npm run test -- --test-concurrency=1    // run tests in diff files sequentially

```
