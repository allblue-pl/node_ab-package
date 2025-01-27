'use strict';

import fs from 'fs';


class jsonHelper_Class {

    constructor() {

    }

    readFilePromise(fsPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(fsPath, { encoding: 'utf-8' }, (err, data) => {
                if (err)
                    reject(err);
    
                let json = null;
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            })
        });
    }

    replaceInStrings(json, search, replace) {
        for (let key in json) {
            if (typeof json[key] === 'string') {
                let regexp = new RegExp('\{\{' + search + '\}\}', 'g');
                json[key] = json[key].replace(regexp, replace);
            }
            else if (typeof json[key] === 'object')
                this.replaceInStrings(json[key], search, replace);
        }
    }

    replaceValue(json, searchKey, replace) {
        for (let key in json) {
            if (key === searchKey)
                json[key] = replace;
            else if (typeof json[key] === 'object')
                this.replaceValue(json[key], searchKey, replace);
        }
    }

    writeFilePromise(fsPath, json) {
        return new Promise((resolve, reject) => {
            let content = JSON.stringify(json, null, 2);
            fs.writeFile(fsPath, content, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    abLog.error(err.stack);
                    resolve(false);
                }
    
                resolve(true);
            });
        });
    }

}
module.exports = new jsonHelper_Class();
