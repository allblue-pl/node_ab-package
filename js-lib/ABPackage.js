'use strict';

const abLog = require('ab-log');

const NPM = require('./NPM.js');


class ABPackage {

    constructor()
    { let self = this;
        self._defaultConfig = {
            name: '###{{name}}###',
            description: '###{{description}}###',
            gitUri: '###{{getUri}}###',
            author: '###{{author}}###',
            keywords: [],
        };
    }

    exec(exec_config)
    { let self = this;
        let config = null;
        try {
            config = self._parseConfig(exec_config);
        } catch (err) {
            abLog.error('Cannot parse `exec_config`:\r\n', err);
            return;
        }

        if (process.argv.length < 3) {
            abLog.error('\r\nCommand not set.');
            self._printHelp();

            return;
        }

        let command = process.argv[2];
        if (command === 'init')
            self._exec_Init(config);
        else if (command === 'update')
            self._exec_Update();
        else {
            abLog.error('\r\nUnknown command `%s`.', command);
            self._printHelp();
        }
    }


    _exec_Init(config)
    { let self = this;
        if (process.argv.length < 4) {
            abLog.error('\r\n[version] not set.');
            self._printHelp();

            return;
        }

        let npm = new NPM();
        npm.update(config, 'init', process.argv[3]);
    }

    _createBower(config)
    { let self = this;

    }

    _createNPM(config)
    { let self = this;

    }

    _parseConfig(exec_config)
    { let self = this;
        if (typeof exec_config !== 'object')
            throw new Error('`exec_config` must be an object');

        var config = {};

        for (let key in self._defaultConfig) {
            if (key in exec_config.package)
                config[key] = exec_config.package[key]
            else
                config[key] = self._defaultConfig[key];
        }

        return config;
    }

    _printHelp()
    { let self = this;
        abLog.log('\r\nAvailable commands:\r\n');
        abLog.log('  - init [version]');
        abLog.log('  - update [step]');
        abLog.log('  - publish [all, git, npm, bower]');
    }

}

module.exports = ABPackage;
