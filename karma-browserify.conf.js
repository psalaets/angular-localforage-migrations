// Karma configuration
// Generated on Sat Mar 07 2015 18:52:40 GMT-0500 (EST)

var baseConfig = require('./karma-base-config')()

console.log(Object.keys(baseConfig))

baseConfig.frameworks = [
    'browserify',
    'jasmine'
]

baseConfig.files = [
    'test/*.js'
]

baseConfig.preprocessors = {
    'test/*.js': 'browserify'
}

baseConfig.browserify = {
    debug: true
}

module.exports = function(config) {
  baseConfig.logLevel = config.LOG_INFO

  config.set(baseConfig);
};
