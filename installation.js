import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import objectAssignDeep from 'object-assign-deep'
import log, { configure } from 'logua'
import formatPackageJson from 'pakag'
import configuration from './configuration/package.js'

configure({ name: 'padua', color: 'green' })

// Skip postinstall on local install.
// https://stackoverflow.com/a/53239387/3185545
const { INIT_CWD, PWD } = process.env
if (INIT_CWD === PWD || INIT_CWD.indexOf(PWD) === 0) {
  log(`Skipping 'postinstall' on local install`)
}

const packageJsonPath = join(process.cwd(), '../../package.json')

let packageContents = readFileSync(packageJsonPath, 'utf8')
packageContents = JSON.parse(packageContents)

// Merge existing configuration with additional required attributes.
objectAssignDeep(packageContents, configuration)

packageContents = JSON.stringify(packageContents)

// Format with prettier before writing.
packageContents = formatPackageJson(packageContents)

writeFileSync(packageJsonPath, packageContents)

log('installed successfully')
