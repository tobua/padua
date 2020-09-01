#!/usr/bin/env node

import log, { configure } from 'logua'
import * as scripts from './script/index.js'

configure({ name: 'padua', color: 'green' })

let script = process.argv.slice(2)[0]

if (['watch', 'build', 'test', 'lint', 'release', 'update'].includes(script)) {
  const watch = script === 'watch'

  if (watch) {
    script = 'build'
  }

  scripts[script](watch)
} else {
  log('Please provide a valid script', 'error')
}
