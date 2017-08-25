const path              = require( 'path' );
const webpack           = require( 'webpack' );
const merge             = require( 'webpack-merge' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const PurifyCSSPlugin   = require( 'purifycss-webpack-plugin' );
const OptimizeCSSPlugin = require( 'optimize-css-assets-webpack-plugin' );
const CleanDistPlugin   = require( 'clean-webpack-plugin' );
const { CheckerPlugin } = require( 'awesome-typescript-loader' );
const entryPath         = path.join( __dirname, 'src/static/index.ts' );
const outputPath        = path.join( __dirname, 'dist' );

console.log( 'WEBPACK GO!');

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';
const outputFilename = TARGET_ENV === 'production' ? '[name].[hash].js' : '[name].js';
const vendorCSSName = TARGET_ENV === 'production' ? 'vendor.[contenthash].css' : 'vendor.css';

// common webpack config
const commonConfig = {

  output: {
    path:       outputPath,
    filename:   outputFilename,
    publicPath: TARGET_ENV === 'development' ? 'http://localhost:8080/' : '/worksheet-generator/'
  },

  resolve: {
    extensions: ['.js', '.ts', '.elm'],
    alias: {
      libs: path.resolve(__dirname, 'libs')
    }
  },

  node: {
    fs: "empty"
  },

  module: {
    noParse: /\.elm$/,
    loaders: [
        {
        test:   /\.(png|jpg)$/,
        loader: 'url-loader?limit=25000',
      },
      {
        test:   /\.svg$/,
        loader: 'file-loader',
      },
      {
        test:   /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/static/index.template.ejs',
      inject:   'body',
      title:    'Worksheet Generator'
    }),
    new CheckerPlugin()
  ],

}

// additional webpack settings for local env (when invoked by 'npm start')
if ( TARGET_ENV === 'development' ) {
  console.log( 'Serving locally...');

  module.exports = merge( commonConfig, {

    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      entryPath
    ],

    devtool: 'eval-source-map',

    // suppress perf hints in browser devtools
    performance: { hints: false },
    
    devServer: {
      // serve index.html in place of 404 responses
      historyApiFallback: true,

      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: false,
        publicPath: false
      }
    },

    module: {
      loaders: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader:  'elm-hot-loader!elm-webpack-loader?verbose=true&warn=true&debug=true',
        },
        {
          test:   /\.css$/i,
          loader: 'style-loader!css-loader?sourceMap',
        },
        {
          test:   /\.(eot|ttf|woff|woff2|svg)(\?\S*)?$/,
          loader: 'file-loader'
        },
      ]
    }
  });
}

// additional webpack settings for prod env (when invoked via 'npm run build')
if ( TARGET_ENV === 'production' ) {
  console.log( 'Building for prod...');

  module.exports = merge( commonConfig, {

    entry: entryPath,

    module: {
      loaders: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader:  'elm-webpack-loader'
        },
        {
          test:   /\.css$/i,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader'
          }),    
        },
        {
          test:   /\.(woff|woff2|ttf|eot)$/,
          loader: 'url-loader?limit=50000',
        },
      ]
    },

    plugins: [
      new CleanDistPlugin('dist', {
        root: __dirname
      }),

      new ExtractTextPlugin(vendorCSSName),

      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
          minimize:   true,
          compressor: { warnings: false }
          // mangle:  true
      }),

      new PurifyCSSPlugin({
        basePath: outputPath,
        paths: ['index.html']
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true }},
      }),
    ],
  });
}
