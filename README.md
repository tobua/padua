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

### `npx papua build`

Builds the plugin minified for distribution including types.

### `npx papua lint`

Lints the code and prints errors.

### `npx papua release`

Creates a new release version with `standard-version`, pushes the git tag for the new version and publishes the plugin to npm.

### `npx papua update`

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

```json
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
    "entry": ["another.js", "several.jsx"]
  }
}
```

### TypeScript

Create and edit a `tsconfig.json` in the root of your project. When you run a build with `padua build` your configuration is detected and will be extended with the padua-defaults automatically.

//

### ESLint

## Commands

### Publish

Bumps version according to commits, generates changelog, commits release, pushes commit and tag and releases to npm. The plugin will detect if the package hasn't been released yet and not bump
the version in this case.

## Built with padua

- epic-react
- stylesnames
- pakag

## Future

- Use https://github.com/jeremyben/tsc-prog to bundle d.ts.
- or use compiler API: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- User tsconfig.json for ts-jest.
- Common template which will be added to every template.
