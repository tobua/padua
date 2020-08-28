#!/usr/bin/env node

import log from 'logua'
import * as scripts from './script/index.js'

let script = process.argv.slice(2)[0]

if (['watch', 'build', 'test', 'lint', 'publish', 'update'].includes(script)) {
  const watch = script === 'watch'

  if (watch) {
    script = 'build'
  }

  scripts[script](watch)
} else {
  log('Please provide a valid script', 'error')
}
