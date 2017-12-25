const PostmanCollection = require('postman-collection');

/**
 * Collection class to handle collection
 * related functions:
 * 1. Create collection JSON
 * 2. Add requests
 * 3. Add tests
 * 4. Add pre-request scripts
 *
 * @param {Object} config - parsed config
 */
function Collection(config) {
  this.config = config;
  this.collection = new PostmanCollection.Collection({
    info: {
      name: config.name,
    },
  });

  this.populate();
}

/**
 * Calls functions to populate the postman
 * collection with config data
 */
Collection.prototype.populate = function() {
  // set the md description
  this.collection.describe(this.config.description, 'text/markdown');

  // set requests
  this.populateRequests();
};

/**
 * Add requests to postman collection
 */
Collection.prototype.populateRequests = function() {
  this.config.routes.forEach((route) => {
    const url = route.url[0] === '/' ?
      `${this.config.baseUrl}${route.url}` :
      route.url;

    this.collection.items.add(new PostmanCollection.Item({
      name: route.name,
      request: {
        url: url,
        method: route.method.toUpperCase(),
      },
    }));
  });
};

module.exports = Collection;
