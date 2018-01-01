const fs = require('fs');
const _ = require('lodash');

/**
 * Class to maintain a log of postman
 * entities - collection, monitor, mocks
 *
 * @param {Object} path - path of log file
 */
function Log(path) {
  this.path = path;

  fs.openSync(path, 'a+');

  try {
    const data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));

    this.collection = data.collection;
    this.environment = data.environment;
    this.monitor = data.monitor;
    this.mock = data.mock;
  } catch (e) {
    // corrupted log file
    this.collection = null;
    this.monitor = null;
    this.environment = null;
    this.mock = null;
  }
}

Log.prototype.setCollection = function(id) {
  this.collection = id;
};

Log.prototype.setEnvironment = function(id) {
  this.environment = id;
};

Log.prototype.setMock = function(id) {
  this.mock = id;
};

Log.prototype.setMonitor = function(id) {
  this.monitor = id;
};

Log.prototype.commit = function() {
  const dump = JSON.stringify(_.pick(this, [
    'collection',
    'mock',
    'monitor',
    'environment',
  ]));

  fs.writeFileSync(this.path, dump);
};

module.exports = Log;
