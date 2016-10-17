module.exports = function() {

  var inherits = require('sofa/lib/inherits');
  var DocumentAssert = require('sofa/lib/document_assert');

  function Assert() {
    DocumentAssert.apply(this, arguments);
  }

  inherits(Assert, DocumentAssert);

  Assert.prototype.has = function() {
    this.ok(this.parent.has(), 'must exist');
  }

  Assert.prototype.string = function() {
    this.ok(this.parent.string(), 'must be string');
  }

  Assert.prototype.number = function() {
    this.ok(this.parent.number(), 'must be number');
  }

  Assert.prototype.array = function() {
    this.ok(this.parent.array(), 'must be array');
  }

  Assert.prototype.unchanged = function() {
    this.ok(this.parent.unchanged(), 'cannot be changed');
  }

  Assert.prototype.date = function() {
    this.ok(this.parent.date(), 'must be date');
  }

  Assert.prototype.prefix = function(prefix) {
    this.string();
    this.ok(this.parent.prefix(prefix), 'must have "' + prefix + '" prefix');
  }

  Assert.prototype.equal = function(value, strict, error) {
    if(this.parent._is(strict, 'String')) {
      error = strict;
      strict = false;
    }
    this.ok(this.parent.equal(value, strict), error || ('must equal to "' + value + '"'));
  }

  Assert.prototype.notBlank = function() {
    this.has();
    this.string();
    this.ok(this.parent.notBlank(), 'must not be blank');
  }

  Assert.prototype.identifier = function() {
    this.notBlank();
    this.ok(this.parent.identifier(), 'must be lowercase and not contain whitespaces');
  }

  Assert.prototype.username = function(prefix, error) {
    this.authenticated();
    this.ok(this.parent.username(prefix), error || 'must equal your username');
  }

  Assert.prototype.choices = function(choices, error) {
    this.ok(this.parent.choices(choices), error || 'must be one of "' + choices.join('", "') + '"');
  }

  return Assert;
}();