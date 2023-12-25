import merge from 'deepmerge'
import { getOptions } from '../utility/options.js'

export const tsconfig = (tsconfigUserOverrides = {}) => {
  const options = getOptions()
  let userTSConfig = {
    extends: './node_modules/padua/configuration/tsconfig.json',
  }

  // The local tsconfig in this package will be written and the user config is extending it.
  const packageTSConfig = {
    compilerOptions: {
      esModuleInterop: true,
      skipLibCheck: true,
      outDir: '../../../dist',
      rootDir: '../../..',
      declaration: true,
      // Types for newest ES library, typescript won't add polyfills.
      lib: ['DOM', 'ESNext'],
      target: 'esnext',
      moduleResolution: 'bundler', // Full ES Module compatibility (requires TypeScript > 5).
      module: 'esnext',
    },
    files: options.entry.map((entry) => `../../../${entry}`),
    exclude: [`../../../${options.output}`],
  }

  if (options.react) {
    packageTSConfig.compilerOptions.jsx = 'react'
  }

  userTSConfig = merge(userTSConfig, tsconfigUserOverrides)

  return [userTSConfig, packageTSConfig]
}
