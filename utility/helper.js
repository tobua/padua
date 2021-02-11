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