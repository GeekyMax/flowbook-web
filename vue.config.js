module.exports = {
  baseUrl: './',

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: false,
      theme: false
    }
  }
};
