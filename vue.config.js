module.exports = {
  devServer: {
    host: process.env.VUE_APP_CLIENT_HOST,
    port: process.env.VUE_APP_CLIENT_PORT,
    https: false,
    proxy: process.env.VUE_APP_SERVER_HOST,
  },
};
