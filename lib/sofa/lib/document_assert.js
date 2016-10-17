module.exports = function() {

  var inherits = require('sofa/lib/inherits');
  var Base = require('sofa/lib/base_assert');

  function Assert(key, parent) {
    Base.apply(this, arguments);
  }

  inherits(Assert, Base);

  return Assert;
}();