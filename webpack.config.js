const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    //точка входа
    entry: path.join(__dirname, 'src', 'index.js'),
    //точка выхода
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.[contenthash:8].js',
        assetModuleFilename: path.join('images', '[name].[contenthash:8][ext]'),
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.(scss|css)$/,
                //используем в обратном порядке (справа налево)
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                //переопределим каталог для svg-иконок
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                    filename: path.join('icons', '[name].[contenthash:8][ext]'),
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        //сборка из шаблона
        new HtmlWebpackPlugin({
            //template - путь к входному файлу
            //template: path.join(__dirname, 'src', 'template.html'),
            template: path.join(__dirname, 'src', 'template.pug'),
            //filename - имя выходного файла
            filename: 'index.html',
        }),
        //очистка dist перед обновлением генерацией файлов
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['dist']
                },
                onEnd: {
                    copy: [{
                        source: path.join('src', 'static'),
                        destination: 'dist',
                    }]
                }
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css'
        })
    ],
    //devServer - автоматическое отслеживание изменений и сборка
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 9000,
    },
};