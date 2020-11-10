module.exports = function (api) {
  api.cache(true)
  return {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: false }],
    ],
    presets: ["babel-preset-expo"],
  }
}
