import { name as versionName } from 'release.json';

const getCurrentVersion = () => {
    if (__DEV__) {
        return `${versionName}-dev`;
    }
    return versionName;
};

export default getCurrentVersion;
