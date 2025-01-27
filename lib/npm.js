'use strict';

import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import abLog from 'ab-log';

import jsonHelper from './jsonHelper';


class npm_Class {
    
    update(config, update_type, version) {
        let base_file_path = path.join(__dirname, '../res/package.json');
        let npm_file_path = path.join(path.dirname(require.main.filename),
                'package.json');

        fs.readFile(base_file_path, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                abLog.error('Cannot update npm info:\r\n', err);
                return ;
            }

            let json = null;
            try {
                json = JSON.parse(data);
            } catch (err) {
                abLog.error('Cannot update npm info. Unable to decode base json:', err);
            }

            jsonHelper.replaceInStrings(json, 'name', config.name);
            jsonHelper.replaceInStrings(json, 'version', version);
            jsonHelper.replaceInStrings(json, 'description', config.description);
            jsonHelper.replaceInStrings(json, 'gitUri', config.gitUri);
            jsonHelper.replaceInStrings(json, 'author', config.author);

            jsonHelper.replaceValue(json, 'keywords', config.keywords);

            fs.stat(npm_file_path, (err, stat) => {
                if (update_type === 'init' && err === null) {
                    abLog.error('Npm package file already exists.');
                    return;
                }

                fs.writeFile(npm_file_path, JSON.stringify(json, null, 2), 
                        { encoding: 'utf-8' }, (err) => {
                    if (err) {
                        abLog.error('Cannot update npm info:\r\n', err);
                        return;
                    }

                    abLog.success('Generated npm package file.');
                });
            });
        });
    }

}
module.exports = npm_Class;
