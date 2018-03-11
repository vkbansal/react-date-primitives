const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTSCheckerPlugin = require('fork-ts-checker-webpack-plugin');
// const MinifyPlugin = require('babel-minify-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';
const DEV = !PROD;

const config = {
    entry: path.resolve(__dirname, './index.tsx'),
    output: {
        filename: DEV ? 'bundle.js' : 'bundle.[hash].js',
        path: path.resolve(__dirname, '../public'),
        publicPath: DEV ? '/' : '',
        hashDigestLength: 6,
        sourceMapFilename: 'bundle.js.map'
    },
    mode: DEV ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                declaration: false
                            },
                            transpileOnly: true,
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                include: [path.resolve(__dirname, '../')]
            },
            {
                test: /\.css$/,
                use: 'glamor-loader'
            }
        ]
    },
    target: 'web',
    plugins: [
        new ForkTSCheckerPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template.html'),
            inject: true,
            title: 'pathname',
            filename: 'index.html',
            PROD
        })
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    }
};

module.exports = config;
