import prettier from 'prettier'
import sortPackageJson from 'sort-package-json'

export const formatJson = (packageContents) => {
  packageContents = sortPackageJson(packageContents)
  return prettier.format(packageContents, {
    // Same config as npm uses for formatting upon install.
    trailingComma: 'es5',
    tabWidth: 2,
    singleQuote: true,
    parser: 'json',
    // Workaround to make sure line break applies for eslintConfig.
    printWidth: 2,
  })
}
