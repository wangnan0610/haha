var path = require('path');
var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV,

  port: process.env.PORT || 3000,

  root: path.normalize(__dirname + '/../../'),

  ip: process.env.IP || '127.0.0.1',

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
};

// module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {})
module.exports = all 
