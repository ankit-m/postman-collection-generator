/**
 * Class for environment related functions
 * 1. Create env
 * 2. Update env
 *
 * @param {Object} config - parsed config
 */
function Environment(config) {
  this.environment = config.environment;
}

module.exports = Environment;
