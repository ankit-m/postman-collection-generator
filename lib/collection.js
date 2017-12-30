const PostmanCollection = require('postman-collection');
const newman = require('newman');
const _ = require('lodash');
const Test = require('./test');

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
  const Item = PostmanCollection.Item;
  // @todo better way to add body
  const RequestBody = PostmanCollection.RequestBody;

  this.collection = new PostmanCollection.Collection({
    info: {
      name: config.name,
      description: config.description,
    },
  });

  config.routes.forEach((route) => {
    const url = route.url[0] === '/' ?
          `${config.baseUrl}${route.url}` :
          route.url;
    const test = new Test(route.test);
    const item = new Item({
            name: route.name,
            description: route.description,
            request: {
              url: url,
              method: route.method.toUpperCase(),
              body: new RequestBody(route.body),
            },
          });

    // add headers
    _.keys(route.headers).forEach((key) => {
      item.request.addHeader({
        key: key,
        value: route.headers[key],
      });
    });

    // add query params
    _.keys(route.params).forEach((key) => {
      item.request.addQueryParams({
        key: key,
        value: route.params[key],
      });
    });

    // add tests
    item.events.add(test.toJSON());

    this.collection.items.add(item);
  });
}

/**
 * Create a postman collection using pro api
 */
Collection.prototype.create = function() {
};

/**
 * Run a collection using newman
 */
Collection.prototype.run = function() {
  newman.run(
    {
      collection: this.collection.toJSON(),
      reporters: 'cli',
    },
    function(err) {
      if (err) {
        throw err;
      }

      console.log('collection run complete!');
    }
  );
};

/**
 * Connect collection to an env
 *
 * @param {Object} env - environment variables
 */
Collection.prototype.connect = function(env) {
  this.collection.syncVariablesFrom(env);
};

/**
 * Export pm collection as a JSON
 *
 * @return {Object} collection JSON
 */
Collection.prototype.export = function() {
  return this.collection.toJSON();
};

module.exports = Collection;
