
const Git = require('nodegit');


Git.Repository.open("../../.")
    .then((repo) => {
        console.log(repo);

        return Git.Tag.list(repo)
    })
    .then((tags) => {
        console.log('Tags:', tags);
    })
    .catch((err) => {
        console.log(err);
    });
