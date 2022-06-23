import merge from 'deepmerge'
import { getOptions } from '../utility/options.js'

export const tsconfig = (tsconfigUserOverrides = {}) => {
  const options = getOptions()
  let userTSConfig = {
    extends: 'padua/configuration/tsconfig.json',
  }

  // The local tsconfig in this package will be written and the user config is extending it.
  const packageTSConfig = {
    compilerOptions: {
      esModuleInterop: true,
      outDir: '../../../dist',
      declaration: true,
      // Types for newest ES library, typescript won't add polyfills.
      lib: ['DOM', 'ESNext'],
      moduleResolution: 'node',
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
