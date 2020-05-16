const path = require('path')
const rootDir = path.resolve(__dirname) + '/'
const srcDir = rootDir + 'src/'
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = {
  webpack:function(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
      config,
    )
    config = rewireLess.withLoaderOptions({
      modifyVars: { 
        "@primary-color": "#007ACC" ,
        "@link-color":"#1A94BC"
    },
      javascriptEnabled: true,
    })(config, env)

    config.entry.unshift(
      'whatwg-fetch',
      'babel-polyfill'
    );
    
    config.resolve.alias = {
      '@module': rootDir + 'node_modules',
      '@': srcDir,
      '@assets': srcDir + 'assets',
      '@img': srcDir + 'assets/img',
      '@fonts': srcDir + 'assets/fonts',
      '@css': srcDir + 'assets/css',
      '@redux': srcDir + 'redux',
      '@pages': srcDir + 'pages',
      '@components': srcDir + 'components',
      '@common': srcDir + 'common'
    }
    config.resolve.extensions.push('.scss', '.less', '.css')
    return config
  }
} 