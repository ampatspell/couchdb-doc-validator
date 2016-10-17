module.exports = function() {

  var inherits = require('sofa/lib/inherits');
  var Document = require('sofa/lib/document');
  var PropertyAssert = require('sofa/lib/property_assert');

  function Property(key, value, newDoc, oldDoc, userCtx, secObj) {
    Document.call(this, newDoc, oldDoc, userCtx, secObj);
    this.key = key;
    this.value = value;
    this.assert = new PropertyAssert(key, this);
  }

  inherits(Property, Document);

  Property.prototype.has = function() {
    return this.object.hasOwnProperty(this.key);
  }

  Property.prototype.is = function(type) {
    return this._is(this.value, type);
  }

  Property.prototype.string = function() {
    return this.is('String');
  }

  Property.prototype.number = function() {
    return this.is('Number');
  }

  Property.prototype.array = function() {
    return this.is('Array');
  }

  Property.prototype.date = function() {
    if(!this.string()) {
      return false;
    }
    var value = this.value;
    var date = new Date(value);
    if(!date) {
      return false;
    }
    return date.toJSON() === value;
  }

  Property.prototype.prefix = function(prefix) {
    if(!this.string()) {
      return false;
    }
    return this.value.indexOf(prefix) === 0;
  }


  Property.prototype._equalArray = function(a, b, strict) {
    if(!this._is(b, 'Array')) {
      return false;
    }

    if(a.length !== b.length) {
      return false;
    }

    for(var i = 0; i < b.length; i++) {
      if(strict) {
        // order important, can _equalObject be added
        return this._equal(a[i], b[i], strict);
      } else {
        // order not important
        var bv = b[i];
        if(a.indexOf(bv) === -1) {
          return false;
        }        
      }
    }

    return true;
  }

  Property.prototype._equal = function(a, b, strict) {
    if(a !== b) {
      if(this._is(a, 'Array')) {
        return this._equalArray(a, b, strict);
      }
      return false;
    }
    return true;
  }

  Property.prototype.equal = function(value, strict) {
    return this._equal(this.value, value, strict);
  }

  Property.prototype.unchanged = function() {
    var old = this.oldDoc;
    var key = this.key;
    if(!old || !old.hasOwnProperty(key)) {
      return true;
    }
    return this.value === old[key];
  }

  Property.prototype.notBlank = function() {
    if(!this.string()) {
      return false;
    }
    return this.value.trim().length > 0;
  }

  Property.prototype.identifier = function() {
    if(!this.notBlank()) {
      return false;
    }
    var value = this.value;
    if(value.indexOf(' ') !== -1) {
      return false;
    }
    if(value.toLowerCase() !== value) {
      return false;
    }
    return true;
  }

  Property.prototype.username = function(prefix) {
    if(!this.authenticated()) {
      return false;
    }
    if(!this.notBlank()) {
      return false;
    }

    var value = this.value;
    if(prefix) {
      value = prefix + value;
    }
    return value === this.userCtx.name;
  }

  Property.prototype.choices = function(choices) {
    return choices.indexOf(this.value) !== -1;
  };

  return Property;
}();