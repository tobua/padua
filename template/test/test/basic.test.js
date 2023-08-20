import { isPlain, loadProduct } from '../index' // Run a build and import ".." to test bundled assets.

// Package (plugin and tests) are written in ESM, babel will convert all CJS dependencies to ESM to work with jest.
// ESM dependencies have to be excluded manually from this transform, see "jest" property in package.json.

test('Loads the product title.', async () => {
  const { title } = await loadProduct()

  expect(title).toBe('iPhone 9')
})

test('Check if a couple of objects are plain objects.', () => {
  expect(isPlain({})).toBe(true)
})
