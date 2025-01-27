# ABPackage

Node package that simplifies creating and updating simple `npm` and `bower` packages.

## Usage

### Initialization

1. Add `ab-package` as dependency.

`npm install --save-dev ab-package`

2. Create `ab-pkg.js` file containing config, package info and that executes `ab-package` script:

```
'use strict';

const abPackage = from 'ab-package');


abPackage.exec({
    /* Which repositories are used and their package names. */
    config: {
        git: 'node_ab-package_test',
        npm: 'ab-package_test',
        bower: 'ab-package_test',
    },
    /* Basic, common package info. */
    package: {
        name: 'ab-package_test',
        description: 'Test package for `ab-package` package (a lot of `package` in ' +
                'this description... package).',
        author: 'Jakub Zolcik (AllBlue)',
        gitUrl: 'https://github.com/allblue-pl-dev/dev_node_ab-package/',
        keywords: [],

        /* Specific repository overrides. */
        npm: {
            main: 'index.js',
        },
        bower: {
            ignore: [ '*', '!dist/', '!dist/*' ],
        }
    }
});

```

3. Run init command with version info.

`node ab-pkg init 0.0.1`
