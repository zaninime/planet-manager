const fs = require('fs');
const path = require('path');
const git = require('simple-git')();

const RELEASE_FILE = path.join(__dirname, '..', 'release.json');

const releaseData = require(RELEASE_FILE);

git.revparse(['HEAD'], function(ctx, rev) {
    releaseData.id = rev.trim();
    fs.writeFileSync(RELEASE_FILE, JSON.stringify(releaseData, null, 4));
});
