'use strict';

import abLog from 'ab-log';

import Package from './lib/Package.js';


let p = new Package('../../dev_node_ab-package');

(async (resolve, reject) => {
    let ver_Git = await p.getVerPromise_Git();
    let ver_NPM = await p.getVerPromise_NPM();

    let commit_Master = await p.getCommitPromise_Branch(`master`);
    let commit_Current = await p.getCommitPromise_Tag(`v${ver_Git}`);

    console.log('Ver Git:', ver_Git);
    console.log('Ver NPM:', ver_NPM);

    console.log('Commit Master:', commit_Master);
    console.log('Commit Current:', commit_Current);
})();


// console.log('Master:', await p.getVerPromise_Git());
// console.log('Master:', await p.getVerPromise_NPM());

// p.getVerPromise_Git()
//     .then((commit_Master) => {
//         console.log('Master:', commit_Master);
//     })
//     .then((ver_Git) => {
//         console.log('Git:', ver_Git);

//         return p.getVerPromise_NPM();
//     })
//     .then((ver_NPM) => {
//         console.log('NPM:', ver_NPM);
//     })
//     .catch((err) => {
//         abLog.error(err);
//     });