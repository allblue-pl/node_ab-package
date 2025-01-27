'use strict';

import childProcess from 'child_process';
import path from 'path';

import abFS from 'ab-fs';
import abLog from 'ab-log';
import nodegit from 'nodegit';

import jsonHelper from './jsonHelper';


class Package {

    get name() {
        return path.basename(this._path);
    }

    get path() {
        return this._path;
    }


    constructor(fsPath) {
        this._path = fsPath;
    }

    async hasBranchAsync(branchName) {
        return await nodegit.Repository.open(this._path)
            .then((repo) => {
                return nodegit.Reference.lookup(repo, 
                        `refs/remotes/origin/${branchName}`);
            })
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log('Error: ' + err);
                return false;
            });
    }

    async getCommitAsync_Branch(branchName) {
        return await nodegit.Repository.open(this._path)
            .then((repo) => {
                return repo.getBranchCommit(branchName);
            })
            .then((commit) => {
                return commit.sha();
            });
    }

    async getCommitAsync_Tag(tagName) {
        return await nodegit.Repository.open(this._path)
            .then((repo) => {
                return nodegit.Reference.lookup(repo, `refs/tags/${tagName}`)
                    .then((ref) => ref.peel(nodegit.Object.TYPE.COMMIT))
                    .then((ref) => nodegit.Commit.lookup(repo, ref.id()))
                    .then((commit) => commit.sha());
            });
            
            // .then((tag) => {
            //     console.log(tag);
            //     // return commit.sha();
            // });
    }

    async hasUnstagedChangesAsync() {
        let repo = await nodegit.Repository.open(this._path);

        let diff = await nodegit.Diff.indexToWorkdir(repo, null, {
            flags: nodegit.Diff.OPTION.INCLUDE_UNTRACKED |
                    nodegit.Diff.OPTION.RECURSE_UNTRACKED_DIRS,
        });

        return (await diff.patches()).length !== 0;
    }

    async getPackageJSONAsync() {
        let pkgFSPath = path.join(this._path, `package.json`);
        if (!(await abFS.existsFilePromise(pkgFSPath)))
            throw new Error(`'package.json' does not exists for '${this._path}'.`);

        return await jsonHelper.readFilePromise(pkgFSPath);
    }

    async getPackageJSONAsync_Published() {
        let npmName = await this.getNameAsync_NPM();

        return new Promise((resolve, reject) => {
            const npmCheckPS = childProcess.spawn(`cmd`, [ `/c`, `npm`, `view`, 
                    '--json', npmName ]);
            let publishedInfo = null;
            npmCheckPS.stdout.on('data', (data) => {
                try {
                    publishedInfo = eval(`(` + data.toString() + `)`);
                } catch (err) {
                    abLog.error('Eval Error:');
                    abLog.log(data.toString());
                }
            });
            npmCheckPS.stderr.on('data', (data) => {
                publishedInfo = null;
            });
            npmCheckPS.on('close', (code) => {
                if (publishedInfo === null)
                    reject(`Cannot parse 'publishedInfo'.`);

                resolve(publishedInfo);
            });
        }); 

        reject('Cannot view published package.');
    }

    async getNameAsync_NPM() {
        let packageJSON = await this.getPackageJSONAsync();
        if (!(`name` in packageJSON))
            return null;

        return packageJSON.name;
    }

    getVerAsync_Git() {
        return nodegit.Repository.open(this._path)
            .then((repo) => {
                return nodegit.Tag.list(repo)
            })
            .then((tags) => {
                let vers = [];
                for (let tag of tags) {
                    if (tag.match(/^v([0-9]+)\.([0-9]+)\.([0-9]+)$/))
                        vers.push(tag.substring(1));
                }

                if (vers.length === 0)
                    return null;

                vers.sort((verA, verB) => {
                    let regExp = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/;
                    let matchA = regExp.exec(verA);
                    let matchB = regExp.exec(verB);

                    for (let i = 0; i < 3; i++) {
                        let r = parseInt(matchA[1 + i]) - parseInt(matchB[1 + i]);
                        if (r !== 0)
                            return r;
                    }

                    return 0;
                });

                return vers[vers.length - 1];
            })
    }

    getVerAsync_NPM() {
        let pkgFSPath = path.join(this._path, `package.json`);

        return abFS.existsFilePromise(pkgFSPath)
            .then((pkgFSPath_Exists) => {
                if (!pkgFSPath_Exists)
                    reject(`'package.json' does not exists for '${this._path}'.`);

                return jsonHelper.readFilePromise(pkgFSPath);
            })
            .then((json) => {
                if (!(`version` in json))
                    return null;

                return json.version;
            });
    }

    async getVerAsync_NPMPublished() {
        let packageJSON = await this.getPackageJSONAsync_Published();
        if (packageJSON === null)
            return null;

        if (!(`version` in packageJSON))
            return null;

        return packageJSON.version;
    }

}
module.exports = Package;