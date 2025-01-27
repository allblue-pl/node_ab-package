'use strict';

import abLog from 'ab-log';

import jsonHelper from './jsonHelper';
import NPM from './npm';
import Package from './Package';


class abPackage_Class {

    get jsonHelper() {
        return jsonHelper;
    }

    get Package() { 
        return Package; 
    }


    constructor() {
        this._defaultConfig = {
            name: '###{{name}}###',
            description: '###{{description}}###',
            gitUri: '###{{getUri}}###',
            author: '###{{author}}###',
            keywords: [],
        };
    }

    exec(execConfig) {
        let config = null;
        try {
            config = this._parseConfig(execConfig);
        } catch (err) {
            abLog.error('Cannot parse `execConfig`:\r\n', err);
            return;
        }

        if (process.argv.length < 3) {
            abLog.error('\r\nCommand not set.');
            this._printHelp();

            return;
        }

        let command = process.argv[2];
        if (command === 'init')
            this._exec_Init(config);
        else if (command === 'update')
            this._exec_Update();
        else {
            abLog.error('\r\nUnknown command `%s`.', command);
            this._printHelp();
        }
    }


    _exec_Init(config) {
        if (process.argv.length < 4) {
            abLog.error('\r\n[version] not set.');
            this._printHelp();

            return;
        }

        let npm = new NPM();
        npm.update(config, 'init', process.argv[3]);
    }

    _createBower(config) {

    }

    _createNPM(config) {

    }

    _parseConfig(execConfig) {
        if (typeof execConfig !== 'object')
            throw new Error('`execConfig` must be an object');

        var config = {};

        for (let key in this._defaultConfig) {
            if (key in execConfig.package)
                config[key] = execConfig.package[key]
            else
                config[key] = this._defaultConfig[key];
        }

        return config;
    }

    _printHelp() {
        abLog.log('\r\nAvailable commands:\r\n');
        abLog.log('  - init [version]');
        abLog.log('  - update [step]');
        abLog.log('  - publish [all, git, npm, bower]');
    }

}
module.exports = new abPackage_Class();
