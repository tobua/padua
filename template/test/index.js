import ky from 'ky'
import isPlainObject from 'is-plain-obj'

export const loadProduct = async () => {
  const data = await ky.get('https://dummyjson.com/products/1').json()
  return data
}

export const isPlain = (value) => isPlainObject(value)
