# About

This repo contains my solutions to the [Full Stack Open course](https://fullstackopen.com/en/) from University of Helsinki.

# Useful commands

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

# Silence ESLint warning (for now)

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
