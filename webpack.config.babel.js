import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const makeBaseConfig = () => {
    const config = {
        context: __dirname,
        entry: 'app/entrypoint',
        output: {
            filename: 'bundle.js',
        },
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    loader: 'eslint',
                    include: 'app',
                },
            ],
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                    loader: 'file-loader',
                    include: [
                        path.resolve(__dirname, 'app'),
                        path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
                    ],
                },
            ],
        },
        resolve: {
            root: __dirname,
            extensions: ['', '.js'],
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.DefinePlugin({
                __DEV__: process.env.NODE_ENV !== 'production',
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            new webpack.optimize.CommonsChunkPlugin({
                children: true,
            }),
            new HtmlWebpackPlugin({
                title: 'Planet Manager',
            }),
        ],
        eslint: {
            cache: true,
        },
        devServer: {
            host: '0.0.0.0',
            inline: true,
        },
    };

    if (process.env.NODE_ENV !== 'production') {
        config.devtool = 'eval';
    } else {
        config.devtool = 'sourcemap';
        config.plugins = config.plugins.concat([
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({ comments: false }),
        ]);
    }

    return config;
};

const makeElectronConfig = () => {
    const config = makeBaseConfig();
    const staticFilesPath = path.resolve(__dirname, 'electron');

    config.output.path = path.resolve(__dirname, 'dist', 'electron');
    config.plugins.push(new CopyWebpackPlugin([
        { from: path.join(staticFilesPath, 'index.js'), to: '' },
        { from: path.join(staticFilesPath, 'package.json'), to: '' },
    ]));
    config.resolve.extensions.push('.desktop.js');
    config.devServer.port = 3000;

    return config;
};

const makeAndroidConfig = () => {
    const config = makeBaseConfig();

    config.output.path = path.resolve(__dirname, 'dist', 'android');
    config.resolve.extensions.push('.android.js');
    config.devServer.port = 3001;

    return config;
};

const makeiOSConfig = () => {
    const config = makeBaseConfig();

    config.output.path = path.resolve(__dirname, 'dist', 'ios');
    config.resolve.extensions.push('.ios.js');
    config.devServer.port = 3002;

    return config;
};

/**
 * All of this is needed because of this bug
 * https://github.com/webpack/webpack/issues/1849
 */
const exports = () => {
    const configs = [
        makeElectronConfig(),
        makeAndroidConfig(),
        makeiOSConfig(),
    ];
    const map = ['electron', 'android', 'ios'];
    if (process.env.WP_TARGET) {
        return configs[map.indexOf(process.env.WP_TARGET)];
    }
    return configs;
};

module.exports = exports();
