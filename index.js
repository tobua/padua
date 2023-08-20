import * as scripts from './script/index.js'
import { getOptions } from './utility/options.js'
import { writeConfiguration } from './utility/configuration.js'

const wrapper = (handler) => async () => {
  await writeConfiguration()
  return handler()
}

export const watch = wrapper(scripts.build.bind(null, getOptions(), true))

export const build = wrapper(scripts.build.bind(null, getOptions(), false))

export const test = wrapper(scripts.test.bind(null, getOptions()))

export const cypress = wrapper(scripts.cypress.bind(null))

export const lint = wrapper(scripts.lint)

export const release = wrapper(scripts.release)

export const update = wrapper(scripts.update)
