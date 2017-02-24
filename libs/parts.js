
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

const fs = require('fs');
const crypto = require('crypto');
const glob = require('glob');

exports.devServer = function (options) {
  return {
    // Override filename (our index.html points to '../dist/app.js',
    // not 'localhost:8080/dist/app.js'). Better to change here because
    // this export is conditional (based on dev server running or not)
    output: {
      filename: `./${options.paths.dist}/${options.paths.src}`,
    },

    devServer: {
      // Want to look at the content in this folder
      contentBase: './src',

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      // hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port, // Defaults to 8080
    },
    // plugins: [
    //   // Enable multi-pass compilation for enhanced performance
    //   // in larger projects. Good default.
    //   new webpack.HotModuleReplacementPlugin({
    //     multiStep: true,
    //   }),
    // ],
  };
};

exports.setupCSS = function () {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/i,
          loaders: [
            'style-loader',
            'css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader?sourceMap',
          ],
          // include: paths.src
        },
        {
          test: /\.css$/i,
          loaders: [
            'style-loader',
            'css-loader',
          ],
          // include: paths.src
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url-loader?limit=25000',
          // include: paths.src
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'url-loader?limit=50000',
          // include: paths.src
        },
        {
          test: /\.svg$/,
          loader: 'file-loader',
          // include: paths
        },
      ],
    },
  };
};

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({

        sourceMap: true,

        // Eliminate comments
        comments: false,

        // Compression specific options
        compress: {
          warnings: false,

          // Drop 'console' statements
          // drop_console: true
        },

        // Mangling specific options
        mangle: {

          // Avoid mangling the Webpack runtime (dunno why, suggested here: 
          // http://survivejs.com/webpack/building-with-webpack/minifying-build/)
          except: ['webpackJsonp'],

          // Don't care about IE8
          screw_ie8: true,
        },
      }),
    ],
  };
};

exports.setFreeVariable = function (key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.extractBundle = function (options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],
      }),
    ],
  };
};

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without 'root' CleanWebpackPlugin won't point to our
        // project and will fail to works
        root: process.cwd(),
      }),
    ],
  };
};

exports.extractCSS = function (src, vendorFiles, dist) {
  // Calc hash for style bundle name
  const localFiles = glob.sync(`${src}/**/*.scss`);

  const localContents = localFiles.map(path => fs.readFileSync(path)).join();
  const vendorContents = vendorFiles.map(path => fs.readFileSync(path)).join();

  const localHash = crypto
                    .createHash('sha256')
                    .update(localContents)
                    .digest('hex')
                    .substring(0, 20);

  const vendorHash = crypto
                     .createHash('sha256')
                     .update(vendorContents)
                     .digest('hex')
                     .substring(0, 20);

  const extractLocal = new ExtractTextPlugin(`style.${localHash}.css`);
  const extractVendor = new ExtractTextPlugin(`vendor.${vendorHash}.css`);

  // The module
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.scss$/i,
          loader: extractLocal.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
          }),
          // include: src
        },
        {
          test: /\.css$/i,
          loader: extractVendor.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader',
          }),
          // include: vendorFiles
        },
        {
          test: /\.(png|jpg)$/,
          loaders: [
            'url-loader?limit=25000',
            // 'image-webpack-loader'
          ],
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'url-loader?limit=50000',
        },
        {
          test: /\.svg$/,
          loaders: [
            'file-loader',
            // 'image-webpack-loader'
          ],
        },
      ],
    },
    plugins: [
      // Output extracted CSS to a file
      extractLocal,
      extractVendor,
      // new webpack.LoaderOptionsPlugin({
      //     options: {
      //         postcss: [
      //             require('uncss')({
      //                 html: ['dist/*.html']
      //             })
      //         ]
      //     }
      // })
      new PurifyCSSPlugin({
        basePath: dist,
        paths: ['index.html'],
        purifyOptions: {
          whitelist: ['*___*'], // leave locally scoped css (css module spec)
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  };
};

exports.purifyCSS = function (paths) {
  console.log(`${process.cwd()}/dist`);
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),

        // 'paths' is used to point purifyCSS to files not
        // visible to Webpack. You can pass glob patterns to it
        paths,

        options: {
          output: `${process.cwd}distcss`,
        },
      }),
    ],
  };
};
