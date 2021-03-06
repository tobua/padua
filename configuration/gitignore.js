import { getOptions } from '../utility/options.js'

export const gitignore = () => {
  const options = getOptions()

  const entries = ['node_modules', 'package-lock.json']

  if (options.typescript) {
    entries.push('tsconfig.json')
  } else {
    entries.push('jsconfig.json')
  }

  if (!options.source) {
    entries.push(options.output)
  }

  return entries
}
