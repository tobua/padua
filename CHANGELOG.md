# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.7](https://github.com/tobua/padua/compare/v0.3.6...v0.3.7) (2021-06-15)


### Features

* **lint:** add optional stylelint configuration ([bf4c8a6](https://github.com/tobua/padua/commit/bf4c8a6ed1dff0b77f15a261aea3e0b76aecba82))


### Bug Fixes

* **lint:** replace deprecated babel-eslint ([b5e858c](https://github.com/tobua/padua/commit/b5e858c9a3064caf3a57e722a49d5e76f0d88a14))

### [0.3.6](https://github.com/tobua/padua/compare/v0.3.5...v0.3.6) (2021-05-28)

### [0.3.5](https://github.com/tobua/padua/compare/v0.3.4...v0.3.5) (2021-03-23)


### Features

* **options:** allow and parse glob entries ([32b3ddf](https://github.com/tobua/padua/commit/32b3ddf8502dba43292e84a2f7dc295151e3dde0))
* **script:** add cypress script and configuration ([cf65c80](https://github.com/tobua/padua/commit/cf65c800262928d15c90b800792944749e260baa))

### [0.3.4](https://github.com/tobua/padua/compare/v0.3.3...v0.3.4) (2021-03-20)


### Bug Fixes

* **configuration:** more stages when writing package.json ([ca9c4a6](https://github.com/tobua/padua/commit/ca9c4a63b582074c76153298b179ba9dff3a47b6))

### [0.3.3](https://github.com/tobua/padua/compare/v0.3.2...v0.3.3) (2021-03-16)

### [0.3.2](https://github.com/tobua/padua/compare/v0.3.1...v0.3.2) (2021-03-15)


### Bug Fixes

* **build:** make sure imports work in test and node environment ([1828228](https://github.com/tobua/padua/commit/182822871e6f4344c2df093446005ec67139d710))

### [0.3.1](https://github.com/tobua/padua/compare/v0.3.0...v0.3.1) (2021-03-15)


### Bug Fixes

* **build:** multiple entries fixed & jest-fixture integrated ([9398800](https://github.com/tobua/padua/commit/9398800859928b4644ec78e09606a71d5ff0fe13))
* **various:** minor fixes, update and adapt eslint prettier config ([0a8d033](https://github.com/tobua/padua/commit/0a8d033c4e80a91c1ab83ba3ee4b26cd6da373ba))

## [0.3.0](https://github.com/tobua/padua/compare/v0.2.6...v0.3.0) (2021-03-04)


### ⚠ BREAKING CHANGES

* **watch:** watch script clean now optional with --clean flag

### Bug Fixes

* **watch:** make clean for watch script optional ([e1ab974](https://github.com/tobua/padua/commit/e1ab974e511b2ba9afc417c67c694b35c50352de))

### [0.2.6](https://github.com/tobua/padua/compare/v0.2.5...v0.2.6) (2021-02-27)


### Features

* **script:** improve console output on error ([5b73d6f](https://github.com/tobua/padua/commit/5b73d6f33d9a0192ea9ccd550ee73addcc2a8f8a))


### Bug Fixes

* **esbuild:** NODE_ENV variable should be kept in code without warning ([c479620](https://github.com/tobua/padua/commit/c479620b659ee1b9d155d8da4cf004c9c99e2f74))

### [0.2.5](https://github.com/tobua/padua/compare/v0.2.4...v0.2.5) (2021-02-09)


### Features

* **package:** update outdated package properties ([6b382fc](https://github.com/tobua/padua/commit/6b382fc31ab9506f269de149669106c388ade781))

### [0.2.4](https://github.com/tobua/padua/compare/v0.2.3...v0.2.4) (2021-02-04)


### Features

* **esbuild:** define NODE_ENV for production builds ([d9a1a1c](https://github.com/tobua/padua/commit/d9a1a1c19c7bbb0c01d3ba6cd5adf90b02c4b649))


### Bug Fixes

* **eslint:** allow nested param reassign ([ddf3020](https://github.com/tobua/padua/commit/ddf3020a3ca70edab81f8cc6ee35a492f547a69f))

### [0.2.3](https://github.com/tobua/padua/compare/v0.2.2...v0.2.3) (2021-01-10)


### Features

* **options:** allow multiple entries & use shared config in watch mode ([865f4cd](https://github.com/tobua/padua/commit/865f4cdafd82384abd096417b5aa558ed3f1618b))


### Bug Fixes

* **test:** allow jsx tests and reference root tsconfig ([79f0ef0](https://github.com/tobua/padua/commit/79f0ef0c12b9d0ddce78ee652a1cc4c4050279e3))

### [0.2.2](https://github.com/tobua/padua/compare/v0.2.1...v0.2.2) (2020-12-28)


### Bug Fixes

* **release:** add main branch & build before release ([b100f1f](https://github.com/tobua/padua/commit/b100f1fb8b729da04b42f93987d060bb311cb9e8))

### [0.2.1](https://github.com/tobua/padua/compare/v0.2.0...v0.2.1) (2020-12-20)


### Bug Fixes

* **build:** webpack cannot bundle minified es module ([5a79e0e](https://github.com/tobua/padua/commit/5a79e0eabdbe28cad0b3eb8b7636efb19afffff2))

## [0.2.0](https://github.com/tobua/padua/compare/v0.1.6...v0.2.0) (2020-12-17)


### ⚠ BREAKING CHANGES

* **build:** built packages switch from CJS -> ESM

### Features

* **build:** switch to ES Modules and user configurable esbuild config ([9e1e38a](https://github.com/tobua/padua/commit/9e1e38a1b74bdd48ac5b2728dea357e5a1f28f92))

### [0.1.6](https://github.com/tobua/padua/compare/v0.1.5...v0.1.6) (2020-12-17)


### Features

* **release:** detect first release and check owner ([3f90091](https://github.com/tobua/padua/commit/3f90091604048c7583b40096608ba54b0db3d3d9))

### [0.1.5](https://github.com/tobua/padua/compare/v0.1.4...v0.1.5) (2020-12-13)


### Features

* **build:** list sizes of built assets ([9d08909](https://github.com/tobua/padua/commit/9d089096d3d74dad126c73a50d5efb2eef686329))


### Bug Fixes

* **lint:** disable linting for typescript declarations in JS source mode ([099b92a](https://github.com/tobua/padua/commit/099b92a5e760b363d4c75b8bc34e6066d0b85f2c))
* **test:** change deprecated property for ts-jest ([2d96306](https://github.com/tobua/padua/commit/2d963069db3c93521b8efdd6ba9ef6aeea1c38b2))
* **typescript:** preserve dynamic imports ([7f7a93a](https://github.com/tobua/padua/commit/7f7a93abbde132adb6858dc1aaeccbc4a0c16e1b))

### [0.1.4](https://github.com/tobua/padua/compare/v0.1.3...v0.1.4) (2020-10-26)


### Bug Fixes

* **lint:** better way to include test files in lint but not build ([ad91329](https://github.com/tobua/padua/commit/ad9132957f6e0b056bf89ed11498c898eca4a73c))

### [0.1.3](https://github.com/tobua/padua/compare/v0.1.2...v0.1.3) (2020-10-20)


### Bug Fixes

* **esbuild:** make sure only user installed node_modules external ([f2b2889](https://github.com/tobua/padua/commit/f2b2889c93cfca9af0e7d431b2c8ae68e1ee1a80))
* **various:** package merge fixed and allow arguments for test command ([82fe174](https://github.com/tobua/padua/commit/82fe174bf421b529f42593376176b2cd15f22c1d))

### [0.1.2](https://github.com/tobua/padua/compare/v0.1.1...v0.1.2) (2020-10-11)


### Features

* **gitignore:** generate gitignore file with defaults ([77fec3c](https://github.com/tobua/padua/commit/77fec3ce0c8997620cabff3c0dd4dafd682fc379))


### Bug Fixes

* **gitignore:** remove duplicates from gitignore ([d5e1ab1](https://github.com/tobua/padua/commit/d5e1ab1f755c97b34b83ae1e7600bb1897bac966))
* **mobx:** remove decorator configuration as MobX 6 was released ([a62ef02](https://github.com/tobua/padua/commit/a62ef023975ecf942fa65067a21050e0f8a06405))
* **template:** ignore output directory and fix check for test files ([86cead7](https://github.com/tobua/padua/commit/86cead73b6371db8d1797829e50f35638e328e35))

### [0.1.1](https://github.com/tobua/padua/compare/v0.1.0...v0.1.1) (2020-09-27)


### Bug Fixes

* **configuration:** configure always and check if tests available ([b11d7d5](https://github.com/tobua/padua/commit/b11d7d501b89ae7bdab8fff7e26e7b240e28af80))
* **install:** proper base path on postinstall configuration ([cdbede1](https://github.com/tobua/padua/commit/cdbede10a2befe920eadbc2fec646a38983f1e46))
* **options:** always base CWD, fix test pattern and only check strings ([198e27c](https://github.com/tobua/padua/commit/198e27cb022c93bc15715667289ca105aef450d0))
* **template:** update templates ([e713e08](https://github.com/tobua/padua/commit/e713e082ab7e30d3460c16a3d08b6eec6a127541))

## [0.1.0](https://github.com/tobua/padua/compare/v0.0.11...v0.1.0) (2020-09-24)


### ⚠ BREAKING CHANGES

* **configuration:** config is now always generated and should be ignored

### Features

* **configuration:** generate both jsconfig and tsconfig ([de4be61](https://github.com/tobua/padua/commit/de4be618261124e091310c602afce17a49f21ed9))
* **package:** dynamically generate package contents from options ([fedb7d9](https://github.com/tobua/padua/commit/fedb7d93f18b44dfc443fc39647b016428e2027f))


### Bug Fixes

* **configuration:** add user config overrides ([b41c288](https://github.com/tobua/padua/commit/b41c2881965f36617fff27189c9a6909c353999b))
* **configuration:** use existing functionality ([c98f124](https://github.com/tobua/padua/commit/c98f12496589e1b3e4fbec1a4cb0d47300dfb61c))
* **configuration:** use try to check for file access ([006a654](https://github.com/tobua/padua/commit/006a654cf77e51f2a8abd8b529e15b37fe8ffc5f))
* **lint:** import extensions actually required for node source code ([13a846a](https://github.com/tobua/padua/commit/13a846a0b54d7406040b1eb20f4a7d94674b51a0))

### [0.0.11](https://github.com/tobua/padua/compare/v0.0.10...v0.0.11) (2020-09-17)


### Bug Fixes

* **log:** missed some logua use cases before ([fb2dfb0](https://github.com/tobua/padua/commit/fb2dfb0222914c8e160429e46e51592c49d3b709))

### [0.0.10](https://github.com/tobua/padua/compare/v0.0.9...v0.0.10) (2020-09-17)


### Bug Fixes

* **configuration:** some more eslint rules and tsconfig improvements ([b7958d6](https://github.com/tobua/padua/commit/b7958d67e2e39cdd48b1dd8a336224192553248d))

### [0.0.9](https://github.com/tobua/padua/compare/v0.0.8...v0.0.9) (2020-09-06)


### Bug Fixes

* **configuration:** include test files, lint log & exclude template ([6350054](https://github.com/tobua/padua/commit/635005485d0c54728dba80afe1394919e43b46ea))

### [0.0.8](https://github.com/tobua/padua/compare/v0.0.7...v0.0.8) (2020-09-01)


### Features

* **lint:** configure linting for typescript ([878f329](https://github.com/tobua/padua/commit/878f329af72fdc017d50a4192b0afb29e17ec4a3))
* **typescript:** finalize eslint config for TypeScript ([8ecbd79](https://github.com/tobua/padua/commit/8ecbd797677fffceff935581e5432e2e98c81973))

### [0.0.7](https://github.com/tobua/padua/compare/v0.0.6...v0.0.7) (2020-09-01)


### Features

* **general:** various improvements ([0ee6479](https://github.com/tobua/padua/commit/0ee6479593c21f28552f87f68fb57bec6de6c30c))

### [0.0.6](https://github.com/tobua/padua/compare/v0.0.5...v0.0.6) (2020-08-28)

### [0.0.5](https://github.com/tobua/padua/compare/v0.0.4...v0.0.5) (2020-08-24)


### Features

* **template:** add and improve node templates ([d191931](https://github.com/tobua/padua/commit/d1919314e4f40dc06e844acd92cef5b2ceb5fa97))

### [0.0.4](https://github.com/tobua/padua/compare/v0.0.3...v0.0.4) (2020-08-21)


### Features

* **install:** sort package.json properties on install ([9c503e3](https://github.com/tobua/padua/commit/9c503e3dec4c7bcc7b2712d5d1a6ba218feaf54a))


### Bug Fixes

* **lint:** configure jest globals for test files ([b1f1b99](https://github.com/tobua/padua/commit/b1f1b993a1c4b95f334b864c8964569010d156ae))

### [0.0.3](https://github.com/tobua/padua/compare/v0.0.2...v0.0.3) (2020-08-19)


### Bug Fixes

* **test:** run JS through babel-jest and add configuration ([a2ef7ca](https://github.com/tobua/padua/commit/a2ef7ca545d896c8da6e511a51fc3a096efa87e9))

### [0.0.2](https://github.com/tobua/padua/compare/v0.0.1...v0.0.2) (2020-08-18)


### Features

* **template:** add repository field and default template ([56cfa0b](https://github.com/tobua/padua/commit/56cfa0bf8e49c7c28111f8a22ad2b0eee8793b9e))

### [0.0.1](https://github.com/tobua/padua/compare/v0.0.0...v0.0.1) (2020-08-05)


### Features

* **build:** collection options from files and add JS build ([097f0b6](https://github.com/tobua/padua/commit/097f0b6264196586a7f9851992cd73f5c0e2f4af))
* **update:** implement dependency update feature ([4f9f6f8](https://github.com/tobua/padua/commit/4f9f6f8206f3b1671ff5437ca0c44625b448e10d))


### Bug Fixes

* **lint:** fix import path and complete files entry ([6f2727d](https://github.com/tobua/padua/commit/6f2727d742c94e3e389f02f0f9d0a51809e3a9b9))

## 0.0.0 (2020-08-02)


### Features

* **package:** initial implementation ([2ea4e0b](https://github.com/tobua/padua/commit/2ea4e0b90abef1340c5e3b2dad77559552e1f2e1))
