module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-cssnext'),
    require('stylelint'),
    require('postcss-reporter')({ clearReportedMessages: true })
  ],
};
