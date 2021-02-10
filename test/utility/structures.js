export const packageJson = (name, padua = {}, others = {}) => ({
  name: 'package.json',
  json: true,
  contents: {
    name,
    padua,
    ...others,
  },
})

export const indexJavaScript = (contents) => ({
  name: 'index.js',
  contents,
})

export const anyFile = (name, contents) => ({
  name,
  contents,
})

export const codeFile = (name, contents = `console.log('empty')`) => ({
  name,
  contents,
})

export const indexTypeScript = (contents) => ({
  name: 'index.ts',
  contents,
})

export const testJavaScript = (contents = "test('hello', () => {})") => ({
  name: 'test/basic.test.js',
  contents,
})

export const testTypeScript = (contents = "test('hello', () => {})") => ({
  name: 'test/basic.test.ts',
  contents,
})

export const javaScriptModule = (name, contents) => ({
  name: `node_modules/${name}/index.js`,
  contents,
})

export const gitignore = [
  indexJavaScript("console.log('gitignore')"),
  packageJson('gitignore'),
]

export const typescript = [
  packageJson('typescript'),
  indexTypeScript(`console.log('typescript')`),
]

export const source = [
  packageJson('source', { source: true }),
  indexJavaScript("console.log('source')"),
]

export const outdated = [
  packageJson('outdated', null, {
    engines: { hello: 'world', node: '>= 13.2.0' },
  }),
  indexTypeScript("console.log('outdated')"),
]

export const entry = [
  packageJson('entry', { entry: 'hello.js' }),
  codeFile('src/index.tsx', "console.log('what typescript?')"),
  codeFile('hello.js', "console.log('hello')"),
]

export const released = [
  packageJson('padua'),
  indexJavaScript("console.log('released')"),
  anyFile('CHANGELOG.md', '# Hello'),
]

export const unreleased = [
  packageJson('my-unreleased-package'),
  indexJavaScript("console.log('unreleased')"),
]
