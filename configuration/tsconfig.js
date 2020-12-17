import objectAssignDeep from 'object-assign-deep'
import { getOptions } from '../utility/options.js'

export const tsconfig = (tsconfigUserOverrides = {}) => {
  const options = getOptions()
  const userTSConfig = {
    extends: 'padua/configuration/tsconfig',
  }

  // The local tsconfig in this package will be written and the user config is extending it.
  const packageTSConfig = {
    compilerOptions: {
      esModuleInterop: true,
      outDir: '../../../dist',
      declaration: true,
      lib: ['DOM', 'ES6'],
      moduleResolution: 'node',
      module: 'esnext',
    },
    files: [`../../../${options.entry}`],
    exclude: [`../../../${options.output}`],
  }

  if (options.react) {
    packageTSConfig.compilerOptions.jsx = 'react'
  }

  objectAssignDeep(userTSConfig, tsconfigUserOverrides)

  return [userTSConfig, packageTSConfig]
}
