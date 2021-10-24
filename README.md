<p align="center">
  <img src="https://github.com/tobua/padua/raw/master/logo.png" alt="padua" height="300">
</p>

# padua

Tool to configure, setup, build and publish npm plugins.

## Installation

First setup a new project with `npm init` or by manually creating a `package.json` and then add this tool to the project.

```
npm i --save-dev padua
```

## Usage

Upon installation a start and test script along with the necessary configuration have already been added to your `package.json` unless they already existed.

### `npm start`

Builds the plugin in watch mode. Full command `npx padua watch [--clean]`.

### `npm test`

Run tests if there are any.

### `npx padua build`

Builds the plugin minified for distribution including types.

### `npx padua lint`

Lints the code and prints errors.

### `npx padua release`

- Build if necessary
- Checks if owner logged in
- Automatically detects first release
- Bumps version otherwise
- Creates a release tag and changelog
- Pushes tag to git
- Runs `npm publish`
- Released as version in `package.json` if yet unreleased

### `npx padua update`

Checks if there are updates to any dependencies and automatically updates them.

## Features

The goal of this package is to allow you to create npm plugins just having to focus on writing the actual features.

- TypeScript / JavaScript
- React
- Jest
- ESLint & Prettier Configuration and Integration
- Standard-Versioning
- Polyfills
- Automatic Updates
- Built with esbuild and tsc

## Configuration

Everything is **zero-configuration** but the configurations can easily be extended. To do that add
a `padua` property to your `package.json` with the following options available:

```js
{
  "name": "my-plugin",
  "padua": {
    // No build step, directly publish source files, default false.
    "source": true,
    // Output directory for build files, default 'dist'.
    "output": "public",
    // Is project written in TypeScript, automatically detected from extension (ts).
    "typescript": true,
    // Does the project include React, automatically detected from extension (jsx, tsx).
    "react": true,
    // Are there any tests, default false.
    "test": true,
    // Name of the entry files, automatically adds [src/]?index.[jt]sx? files if available.
    "entry": "another.tsx",
    "entry": ["another.js", "several.jsx"],
    "entry": "theme/*.ts",
    // package.json properties to be left untouched during configuration.
    "ignorePkgProperties": ["engines", "eslintConfig.rules"],
    // Additional tsconfig properties that will be added to the extended tsconfig.json.
    "tsconfig": {
      "compilerOptions": {
        "types": [
          "@types/jest"
        ]
      }
    },
    // Additional configuration passed to esbuild.
    "esbuild": {
      "external": [
        "naven"
      ]
    },
    // Add stylelint configuration, default false.
    // true if @emotion/react, styled-components or jss installed.
    "stylelint": true,
    // Folders to ignore by lint and/or test tools, "output" folder always ignored.
    // String => ignore for lint & test, disable ignore for tools with `test: false` or `lint: false`.
    "ignore": ['demo', { name: 'index.d.ts', test: false }, { name: 'test/fixture', lint: false }]
  },
  "eslintConfig": {
    // Added automatically upon installation.
    "extends": "./node_modules/padua/configuration/eslint.cjs"
    // Override ESLint default here.
    "rules": {
      "no-console": 0
    }
  },
}
```
