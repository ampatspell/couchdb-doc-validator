module.exports = function() {

  var dir = require('./dir');
  var path = require('path');

  return dir(path.join(__dirname, 'sofa'));
}();
