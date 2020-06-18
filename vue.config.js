module.exports = {
  devServer: {
    https: false,
  },
  publicPath: process.env.VUE_APP_BASE_URL,
  transpileDependencies: [
    'vuetify',
  ],
};
