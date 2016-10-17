module.exports = function() {

  var _ = require('lodash');
  var glob = require('glob');
  var path = require('path');
  var fs = require('fs');

  function directory(root, omit) {
    console.assert(_.isString(root), 'path must be string not %s', root);
    omit = omit || [];
    root = path.resolve(root);

    var object = {};
    _.chain(glob.sync(root + '/**/*.js')).remove(function(fullName) {
      var name = path.basename(fullName);
      return omit.indexOf(name) === -1;
    }).map(function(fullName) {
      var content = fs.readFileSync(fullName, 'utf-8');
      var components = path.parse(fullName);
      var relative = path.relative(root, components.dir).split('/');
      var parent = object;
      while(relative.length > 0) {
        var key = relative.shift();
        if(key.length > 0) {
          parent[key] = parent[key] || {};
          parent = parent[key];
        }
      }
      parent[components.name] = content;
    }).value();
    return object;
  }

  return directory;
}();
