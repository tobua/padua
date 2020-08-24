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

Upon installation the following scripts along with the necessary configuration have already been added to your `package.json` unless they already existed.

```json
{
  "scripts": {
    "watch": "padua watch",
    "build": "padua build",
    "test": "padua test",
    "lint": "padua lint",
    "publish": "padua publish"
  }
}
```

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

Everything is **zero-configuration** but the configurations can easily be extended.

### TypeScript

Create and edit a `tsconfig.json` in the root of your project. When you run a build with `padua build` your configuration is detected and will be extended with the padua-defaults automatically.

//

### ESLint

## Commands

### Publish

Bumps version according to commits, generates changelog, commits release, pushes commit and tag and releases to npm.

```
npm publish [-- --first-release]
```

Add `--first-release` to avoid bumping the version on your first release.

## Build with padua

- epic-react
- stylesnames
- pakag

## Future

- Use https://github.com/jeremyben/tsc-prog to bundle d.ts.
- or use compiler API: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- User tsconfig.json for ts-jest.
- Common template which will be added to every template.
