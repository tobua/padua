import merge from 'deepmerge'
import { getOptions } from '../utility/options.js'

export const esbuildConfiguration = (configurationPath) => {
  const options = getOptions()
  // dependencies and peerDependencies are installed and better bundled by user to avoid duplication.
  // Use devDependencies to ensure dependency results in distributed bundle.
  const userDependencies = []
    .concat(Object.keys(options.pkg.dependencies || {}))
    .concat(Object.keys(options.pkg.peerDependencies || {}))
  const userESBuildConfiguration =
    typeof options.esbuild === 'object' ? options.esbuild : {}

  let buildOptions = {
    // entryPoints needs to be an array.
    entryPoints: options.entry,
    outdir: 'dist',
    minify: false,
    bundle: true,
    external: userDependencies,
    sourcemap: true,
    color: true,
    target: 'es6',
    platform: 'neutral',
    absWorkingDir: process.cwd(),
  }

  if (options.react) {
    buildOptions.loader = { '.jsx': 'jsx', '.tsx': 'tsx' }
  }

  if (configurationPath) {
    buildOptions.tsconfig = configurationPath
  }

  buildOptions = merge(buildOptions, userESBuildConfiguration)

  return buildOptions
}
