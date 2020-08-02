# padua

Tool to configure, setup, build and publish npm plugins.

## Installation

```
npm i padua
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

## Future

- Use https://github.com/jeremyben/tsc-prog to bundle d.ts.
- or use compiler API: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- User tsconfig.json for ts-jest.
