module.exports = {
  devServer: {
    host: process.env.VUE_APP_CLIENT_HOST,
    port: process.env.VUE_APP_CLIENT_PORT,
    https: false,
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_BASE_URL,
  transpileDependencies: [
    'vuetify',
  ],
};
