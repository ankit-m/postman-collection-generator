const PostmanCollection = require('postman-collection');
const newman = require('newman');
const _ = require('lodash');

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
  const Request = PostmanCollection.Request;
  const Header = PostmanCollection.Header;
  const QueryParam = PostmanCollection.QueryParam;
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
    const request = new Request({
            url: url,
            method: route.method.toUpperCase(),
            body: new RequestBody(route.body),
          });

    // add headers
    _.keys(route.headers).forEach((key) => {
      const header = new Header({
        key: key,
        value: route.headers[key],
      });

      request.addHeader(header);
    });

    // add query params
    _.keys(route.params).forEach((key) => {
      const param = new QueryParam({
        key: key,
        value: route.params[key],
      });

      request.addQueryParams(param);
    });

    this.collection.items.add(new Item({
      name: route.name,
      description: route.description,
      request: request.toJSON(),
    }));
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
 */
Collection.prototype.connect = function() {
};

/**
 * Export pm collection as a JSON
 */
Collection.prototype.export = function() {
};

module.exports = Collection;
