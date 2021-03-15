import merge from 'deepmerge'

export const jsconfig = (jsconfigUserOverrides = {}) => {
  let userJSConfig = {
    extends: 'padua/configuration/jsconfig',
  }

  // The local tsconfig in this package will be written and the user config is extending it.
  const packageJSConfig = {
    compilerOptions: {},
  }

  userJSConfig = merge(userJSConfig, jsconfigUserOverrides)

  return [userJSConfig, packageJSConfig]
}
