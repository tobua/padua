import eslint from 'eslint'
import { execSync } from 'child_process'
import { log } from '../utility/log.js'

// CommonJS named exports not supported.
const { ESLint } = eslint
const configurationPath = './node_modules/padua/configuration'

export default async () => {
  log('formatting files...')
  execSync(
    `prettier --write '**/*.{ts,tsx,js,jsx}' --config ${configurationPath}/.prettierrc.json --ignore-path ${configurationPath}/.prettierignore`,
    { stdio: 'inherit' }
  )
  console.log('')

  log('linting files...')
  const linter = new ESLint({
    fix: true,
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  })
  const results = await linter.lintFiles('.')
  await ESLint.outputFixes(results)
  const formatter = await linter.loadFormatter('stylish')
  const resultText = formatter.format(results)

  if (resultText) {
    // eslint-disable-next-line no-console
    console.log(resultText)
  }
}
