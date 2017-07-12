'use strict';

const fs = require('fs');
const path = require('path');

const abLog = require('ab-log');

const JSONHelper = require('./JSONHelper');


function NPM()
{ let $this = this;

}

NPM.prototype = {

    update(config, update_type, version)
    {
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

            JSONHelper.ReplaceInStrings(json, 'name', config.name);
            JSONHelper.ReplaceInStrings(json, 'version', version);
            JSONHelper.ReplaceInStrings(json, 'description', config.description);
            JSONHelper.ReplaceInStrings(json, 'gitUri', config.gitUri);
            JSONHelper.ReplaceInStrings(json, 'author', config.author);

            JSONHelper.ReplaceValue(json, 'keywords', config.keywords);

            fs.stat(npm_file_path, (err, stat) => {
                if (update_type === 'init' && err === null) {
                    abLog.error('Npm package file already exists.');
                    return;
                }

                fs.writeFile(npm_file_path, JSON.stringify(json, null, 2), { encoding: 'utf-8' },
                        (err) => {
                    if (err) {
                        abLog.error('Cannot update npm info:\r\n', err);
                        return ;
                    }

                    abLog.success('Generated npm package file.');
                });
            });
        });
    },

};

module.exports = NPM;
