import merge from 'deepmerge'
import { getOptions } from '../utility/options.js'

export const esbuildConfiguration = (tsconfigPath) => {
  const options = getOptions()
  // dependencies and peerDependencies are installed and better bundled by user to avoid duplication.
  // Use devDependencies to ensure dependency results in distributed bundle.
  const userDependencies = []
    .concat(Object.keys(options.pkg.dependencies || {}))
    .concat(Object.keys(options.pkg.peerDependencies || {}))
  const userESBuildConfiguration = typeof options.esbuild === 'object' ? options.esbuild : {}

  let buildOptions = {
    // entryPoints needs to be an array.
    entryPoints: options.entry,
    outdir: 'dist',
    minify: false,
    bundle: true,
    external: userDependencies,
    sourcemap: true,
    color: true,
    target: 'es2020', // Browser support ± equal to CSS Grid.
    platform: 'neutral',
    absWorkingDir: process.cwd(),
  }

  if (options.react) {
    buildOptions.loader = { '.jsx': 'jsx', '.tsx': 'tsx' }
  }

  if (tsconfigPath) {
    buildOptions.tsconfig = tsconfigPath
  }

  buildOptions = merge(buildOptions, userESBuildConfiguration)

  return buildOptions
}
