import * as scripts from './script/index.js'
import { getOptions } from './utility/options.js'
import { writeConfiguration } from './utility/configuration.js'

const wrapper = (handler) => () => {
  writeConfiguration()
  handler()
}

const asyncWrapper = (handler) => async () => {
  writeConfiguration()
  return handler()
}

export const watch = asyncWrapper(scripts.build.bind(null, getOptions(), true))

export const build = asyncWrapper(scripts.build.bind(null, getOptions(), false))

export const test = wrapper(scripts.test.bind(null, getOptions()))

export const cypress = wrapper(scripts.cypress.bind(null))

export const lint = asyncWrapper(scripts.lint)

export const release = asyncWrapper(scripts.release)

export const update = asyncWrapper(scripts.update)
