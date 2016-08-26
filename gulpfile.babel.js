import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';
import webpack from 'webpack';
import eslint from 'gulp-eslint';
import { spawn } from 'child_process';

const platforms = ['electron', 'android', 'ios'];
const webpackConfigs = {
  electron: './webpack.config.js',
  android: './android.webpack.js',
  ios: './ios.webpack.js'
};

const registerForAllPlatforms = (nameGen, funGen) => {
  for (const platform of platforms) {
    gulp.task(nameGen(platform), funGen(platform));
  }

  gulp.task(nameGen('all'), platforms.map(e => nameGen(e)));
};

// development
const developOnPlatform = platform => () => {
  spawn('./node_modules/.bin/hjs-dev-server', [webpackConfigs[platform]],
    {env: {...process.env, NODE_ENV: 'development'}, shell: true, stdio: 'inherit'}
  );
  return new Promise(() => null);
};
registerForAllPlatforms(p => `${p}:dev`, developOnPlatform);

// building
const buildForPlatform = platform => cb => {
  process.env.NODE_ENV = 'production';
  webpack(require(webpackConfigs[platform]), cb);
};
registerForAllPlatforms(p => `${p}:build`, buildForPlatform);

// cleaning
const cleanForPlatform = platform => () => del(`dist/${platform}`);
registerForAllPlatforms(p => `${p}:clean`, cleanForPlatform);

// linting
gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
      .pipe(eslint({
        rulePaths: [__dirname + '/eslint_rules']
      }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

// testing
// TODO

// help
gulp.task('default', ['help']);
gulp.task('help', () => {
  const msg = `
Tasks: [platform]:[action]

Platforms:
 - electron
 - android
 - ios

Actions:
 - dev
 - build
 - clean
`;
  for (const line of msg.split('\n')) gutil.log(line);
});