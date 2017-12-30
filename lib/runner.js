/**
 * Read the postmanrc file, parse and run the
 * proper command
 */

const rc = require('rc');
const Parser = require('./parser');
const Collection = require('./collection');

module.exports = function() {
  const config = new Parser(rc('postman'));
  const collection = new Collection(config);

  collection.run();
}();

