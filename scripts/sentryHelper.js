/* eslint-disable */
const path = require('path');
const releaseId = require(path.join(__dirname, '..', 'release.json')).name;

const ORG = 'zaninime';
const PROJECT_PREFIX = 'planet-manager-';

const createRelease = (platform) => (`releases -o '${ORG}' -p '${PROJECT_PREFIX}${platform}' new '${releaseId}'`);

const uploadFiles = (platform, sourcePath) => (`releases -o '${ORG}' -p '${PROJECT_PREFIX}${platform}' files '${releaseId}' upload-sourcemaps '${sourcePath}'`);

const main = (action, ...args) => {
	switch (action) {
	case 'create':
		console.log(createRelease(...args));
		break;
	case 'upload':
		console.log(uploadFiles(...args));
		break;
	default:
		console.error('Invalid command');
	}
};

main(...process.argv.slice(2));
