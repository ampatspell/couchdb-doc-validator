module.exports = function(newDoc, oldDoc, userCtx, secObj) {
  
  var Document = require('sofa/lib/document');
  var inherits = require('sofa/lib/inherits');

  function Root() {
    Document.apply(this, arguments);
  }

  inherits(Root, Document);

  Root.prototype.forType = function(type, cb) {
    if(this.type === type) {
      this.log('Validate ' + type + ' \'' + this.doc._id + '\' ' + (this.deleted ? '(delete)' : '(save)'));
      if(cb) {
        cb.call(this, this);
      }
      return this;
    }
  }

  Root.prototype.types = function(types) {
    this.prop('type', function() {
      this.assert.notBlank();
      this.assert.choices(types);
    });
  }

  return new Root(newDoc, oldDoc, userCtx, secObj);
}