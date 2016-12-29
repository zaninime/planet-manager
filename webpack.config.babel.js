import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const makeBaseConfig = ({ port }) => {
    const config = {
        context: __dirname,
        entry: ['app/entrypoint'],
        output: {
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                },
                {
                    test: new RegExp(),
                    loader: 'raw-loader',
                    include: [
                        path.resolve(__dirname, 'app/components/layout/AboutPage/license-disclaimer.txt'),
                    ],
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
            modules: [
                __dirname,
                'node_modules',
            ],
            extensions: ['.js'],
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: process.env.NODE_ENV !== 'production',
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            new HtmlWebpackPlugin({
                title: 'Planet Manager',
            }),
        ],
        devServer: {
            host: '0.0.0.0',
            hot: true,
            inline: true,
            port,
        },
        performance: {
            hints: false,
        },
    };

    if (process.env.NODE_ENV !== 'production') {
        config.devtool = 'cheap-module-eval-source-map';

        config.plugins = config.plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
        ]);

        config.entry = [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://localhost:${port}`,
            'webpack/hot/only-dev-server',
        ].concat(config.entry);
    } else if (!process.env.WP_FASTBUILD) {
        config.devtool = 'sourcemap';
        config.plugins = config.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({ sourceMap: true, comments: false }),
        ]);
    }

    return config;
};

const makeElectronConfig = () => {
    const config = makeBaseConfig({ port: 3000 });
    const staticFilesPath = path.resolve(__dirname, 'electron');

    config.output.path = path.resolve(__dirname, 'dist', 'electron');
    config.plugins.push(new CopyWebpackPlugin([
        { from: path.join(staticFilesPath, 'index.js'), to: '' },
        { from: path.join(staticFilesPath, 'package.json'), to: '' },
    ]));
    config.resolve.extensions.push('.desktop.js');

    return config;
};

const makeAndroidConfig = () => {
    const config = makeBaseConfig({ port: 3001 });

    config.output.path = path.resolve(__dirname, 'dist', 'android');
    config.resolve.extensions.push('.android.js');

    return config;
};

const makeiOSConfig = () => {
    const config = makeBaseConfig({ port: 3002 });

    config.output.path = path.resolve(__dirname, 'dist', 'ios');
    config.resolve.extensions.push('.ios.js');

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
