#!/usr/bin/env node
import isCI from 'is-ci'
import { log } from './utility/log.js'
import * as scripts from './script/index.js'
import { getOptions } from './utility/options.js'
import { writeConfiguration } from './utility/configuration.js'

let script = process.argv.slice(2)[0]

if (['watch', 'build', 'test', 'cypress', 'lint', 'release', 'update'].includes(script)) {
  const watch = script === 'watch'

  if (watch) {
    script = 'build'
  }

  await writeConfiguration()

  const options = getOptions()

  try {
    scripts[script](options, watch)
  } catch (error) {
    log(`script ${script} exited with an error`)

    if (script !== 'test' && !isCI) {
      console.log(error)
    }

    if (isCI) {
      throw new Error(error)
    }
  }
} else {
  log('Please provide a valid script', 'error')
}
