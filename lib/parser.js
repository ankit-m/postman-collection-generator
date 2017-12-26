const _ = require('lodash');

/**
 * Parser to read the the .postmanrc file and
 * wrap it with helper functions
 *
 * @param {Object} config - rc file json
 */
function Parser(config) {
  _.assign(this, _.omit(config, ['_', 'configs']));

  this.validate();
}

Parser.prototype.validate = function() {
  const MANDATORY_PROPERTIES = [
    'name',
    'description',
    'routes',
  ];

  MANDATORY_PROPERTIES.forEach((prop) => {
    if (!_.has(this, prop)) {
      throw new Error(`Config file must have a ${prop} key`);
    }
  });
};

module.exports = Parser;
