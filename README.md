# About

This repo contains my solutions to the [Full Stack Open course](https://fullstackopen.com/en/) from University of Helsinki.

Below are some practical notes; more wholistic notes (for myself) are here: https://docs.google.com/document/d/1-YyrtzAZ088cPPs2WPlskJYFIvtotKFatTGZ9JCLJHE/edit?usp=sharing

(sort the parts in descending order, part 1 bottom-most, the most recently learnt part top-most, etc)

# Part 3

## Init a NodeJS project

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

## Automatic restarts app on change

When we change code, we need to ctrl+c and restart the application, to save the trouble, use `node --watch index.js`

```
// in package.json
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",  // add this line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

and run the app with `npm run dev`

## Deployment with Fly.io

Fly.io workflow and common commands

```
// login to Fly.io account
fly auth login

// init an app by running the command in the root directory of the app
// this will generate config files including `fly.toml`
fly launch --no-deploy

// inside `fly.toml`, edit `internal_port` under [http_service]
// and `PORT` under [env]

// deploy the app to Fly.io servers
// later whenever the source code is changed, need to deploy again
fly deploy

// view logs from terminal, can also view in Fly.io site
fly logs

// open the app in the browser
fly apps open
```

Other Fly.io common command

```
// show the machine/CPU/memory the app is allocated
// if it's 2 machines,
// there might be inconsistencies between data on diff machines
// scale it down to 1 by `fly scale count 1`
fly scale show

// pin the default organization to make sure I can connect to Fly.io machine
fly ping -o personal

// set env variables in production mode
fly secrets set MONGODB_URI="..."
```

streamline (building frontent) -> (add it to backend as static file):
see the script at `part3/phonebook-backend/package.json`

# Part 2

## JSON-server

### No installation

Use JSON server as a mock backend during FE development.
You can start the JSON server without a separate installation:

```
npx json-server --port 3001 --watch db.json
```

### With installation

Alternatively, install and run:

```
// global install, or
npm install -g json-server

// only for this project as dev dependency
npm install json-server --save-dev
```

To run JSON-server, either by `json-server --port 3001 --watch db.json`, or adding a line to `package.json` and run `npm run server`:

```
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server -p 3001 db.json"  // this line
  },
}
```

# Part 1

## React App: Init and run

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

You can silence the warning [`react/prop-types`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) by adding to the file `.eslintrc .cjs` the next line

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

More on ESLint in Part 3.

# ------------- Old notes -------------

# Testing

When writing the test, you may want to only execute only specific tests

```
npm run test -- tests/note_api.test.js    // run tests in this file
npm run test -- --test-name-pattern="(PART_OF)_NAME_OF_THE_TEST"    // run tests with this name pattern
npm run test -- --test-concurrency=1    // run tests in diff files sequentially

```

# Part 12 Container

## 12a

- Image VS Container

## 12b run a web-server from a container

- `.dockerignore`, anything you wouldn't upload to GitHub
- Build an Image from a `Dockerfile`
  - Install dependencies **within** container by `RUN` command, this way environment-dependent things are installed
  - `npm ci` as a more dependable option of `npm install`
  - change the owner of the file copied to build the Image; change the user running the image
- Run the Image
  - map a port in host computer to one in container
- `docker-compose.yml` to instruct what image to run, if such image does not exist, use what `Dockerfile` to build, etc.
