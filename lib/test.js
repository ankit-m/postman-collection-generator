const _ = require('lodash');

/**
 * Class for test related functions
 *
 * @param {Object} config - test config
 */
function Test(config) {
  let exec = '';

  _.keys(config).forEach((key) => {
    let value = config[key];
    let assertion = '';
    let test = '';

    if (key === 'response') {
      if (typeof value === 'number') {
        assertion = `
          pm.response.to.have.status(${value});
        `;
        test = `
          pm.test(
            'status code is ${value}',
            function () {${assertion}}
          );
        `;
      } else if (typeof value === 'string') {
        assertion = `
          pm.response.to.be.${value};
        `;
        test = `
          pm.test(
            'response should be ${value}',
            function () {${assertion}}
          );
        `;
      } else if (Array.isArray(value)) {
        assertion = `
          pm.expect(pm.response.code).to.be.oneOf([${value.toString()}]);
        `;
        test = `
          pm.test(
            'status code is one of ${value.toString()}',
            function () {${assertion}}
          );
        `;
      }
    } else if (key === 'latency') {
      if (typeof value === 'string' || typeof value === 'number') {
        assertion = `
          pm.expect(pm.response.responseTime).to.be.below(${value});
        `;
        test = `
          pm.test(
            'response time is less than ${value}ms',
            function () {${assertion}}
          );
        `;
      } else if (Array.isArray(value)) {
        assertion = `
          pm.expect(pm.response.responseTime).to.be.below(${value[1]});
          pm.expect(pm.response.responseTime).to.be.above(${value[0]});
        `;
        test = `
          pm.test(
            'response time should be between ${value[0]}ms and ${value[1]}ms',
            function () {${assertion}}
          );
        `;
      }
    } else if (key === 'type') {
      assertion = `
        pm.response.to.have.header('Content-Type', '${value}');
        console.log(pm.response.headers);
        console.log(pm.response.body);
      `;
      test = `
        pm.test(
          'response should have Content-Type: ${value}',
          function () {${assertion}}
        );
      `;
    } else if (key === 'exec') {
      test = value;
    }

    exec += test;
  });

  this.exec = exec;
}

Test.prototype.toJSON = function() {
  return {
    listen: 'test',
    script: {
      type: 'text/javascript',
      exec: this.exec,
    },
  };
};

module.exports = Test;
