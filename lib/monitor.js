/**
 * Monitor class to handle monitor related
 * functions
 * 1. Create monitor
 * 2. Update monitor
 *
 * @param {Object} config - parsed config
 * @param {Object} log - parsed log
 */
function Monitor(config, log) {
  this.monitor = config.monitor;
  this.apiKey = config.apiKey;
}

module.exports = Monitor;
