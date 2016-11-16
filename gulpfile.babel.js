import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';

const platforms = ['electron', 'android', 'ios'];

const registerForAllPlatforms = (nameGen, funGen) => {
    for (const platform of platforms) {
        gulp.task(nameGen(platform), funGen(platform));
    }

    gulp.task(nameGen('all'), platforms.map(e => nameGen(e)));
};

// development
const developOnPlatform = platform => () => {
    gutil.log(
        gutil.colors.yellow('WARNING: This command is deprecated.'),
        `Use npm run start${platform !== 'electron' ? `-${platform}` : ''}`,
    );
};
registerForAllPlatforms(p => `${p}:dev`, developOnPlatform);

// building
const buildForPlatform = () => () => {
    gutil.log(
        gutil.colors.yellow('WARNING: This command is deprecated.'),
        'Use npm run build',
    );
};
registerForAllPlatforms(p => `${p}:build`, buildForPlatform);

// cleaning
const cleanForPlatform = platform => () => del(`dist/${platform}`);
registerForAllPlatforms(p => `${p}:clean`, cleanForPlatform);

// linting
gulp.task('lint', () =>
   gutil.log(
        gutil.colors.yellow('WARNING: This command is deprecated.'),
        'Use npm run lint',
    ),
);

// testing
// TODO

// help
gulp.task('default', ['help']);
gulp.task('help', () => {
    const msg = 'Deprecated. Please use npm scripts.';
    for (const line of msg.split('\n')) gutil.log(line);
});
