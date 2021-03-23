import { join } from 'path'
import glob from 'fast-glob'
import { getProjectBasePath } from './path.js'

const results = new Map()

// Cache the result of a function with separate method to clear between test runs.
// Only for methods that accept no arguments, but read from the filesystem, which
// isn't expected to change until refresh is called.
export const cache = (method) => () => {
  if (results.has(method)) {
    return results.get(method)
  }
  const result = method()

  results.set(method, result)

  return result
}

export const refresh = () => results.clear()

export const removeDuplicatePaths = (relativePaths) => {
  // Checking the absolute paths for duplicates, so that './index.ts' and 'index.ts'
  // count as duplicates.
  const absolutePaths = relativePaths.map((path) =>
    join(getProjectBasePath(), path)
  )
  const noDuplicatesSet = new Set()

  const indicesToRemove = []

  absolutePaths.forEach((path, index) => {
    if (noDuplicatesSet.has(path)) {
      indicesToRemove.push(index)
    }

    noDuplicatesSet.add(path)
  })

  // Remove biggest indices first, as otherwise indices change.
  indicesToRemove.reverse().forEach((index) => {
    // Remove duplicate path in-place from relativePaths.
    relativePaths.splice(index, 1)
  })

  return relativePaths
}

export const resolveGlobEntries = (inputs) => {
  let newEntries = []
  const indicesToRemove = []

  inputs.forEach((entry, index) => {
    // Resolve glob entries.
    if (entry.includes('*')) {
      const entries = glob.sync([entry], {
        cwd: getProjectBasePath(),
      })

      // Add new entries.
      newEntries = newEntries.concat(entries)
      // Remove glob entry.
      indicesToRemove.push(index)
    }
  })

  // Reverse, so that globs can be removed inline.
  indicesToRemove.reverse().forEach((index) => inputs.splice(index, 1))

  return inputs.concat(newEntries)
}
