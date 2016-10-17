module.exports = function() {

  function Base(newDoc, oldDoc, userCtx, secObj) {
    this.newDoc = newDoc;
    this.oldDoc = oldDoc;
    this.userCtx = userCtx;
    this.secObj = secObj;
    this.deleted = newDoc._deleted === true;
    this.saved = !this.deleted;
    if(this.deleted) {
      if(this.oldDoc) {
        this.doc = this.oldDoc;
      } else {
        // Might also happen while replicating databases. Save doc in db_a, delete that doc, replicate to db_b.
        // db_b receives _deleted:true doc without local oldDoc. As on db_b there is no history of this document,
        // we can safely ignore it.
        this.forbidden("Do not insert deleted documents");
      }
    } else {
      this.doc = this.newDoc;
    }
    this.type = this.doc.type;
    this.object = this.doc;
  }

  Base.prototype.log = function() {
    var value = Array.prototype.slice.call(arguments);
    if(value.length == 1) {
      value = value[0];
    }
    log(toJSON(value));
  };

  Base.prototype.forbidden = function(message) {
    message = message || "forbidden";
    this.log("fail: " + message);
    throw({forbidden: message});
  };

  Base.prototype._type = function(value) {
    return Object.prototype.toString.call(value);
  }

  Base.prototype._is = function(value, type) {
    return this._type(value) === '[object ' + type + ']';
  }

  Base.prototype._role = function(name) {
    return this.userCtx.roles.indexOf(name) !== -1;
  }

  Base.prototype.role = function(name) {
    if(this.admin()) {
      return true;
    }
    return this._role(name);
  }

  Base.prototype.authenticated = function() {
    return !!this.userCtx.name;
  }

  Base.prototype._sec = function(sec) {
    var user = this.userCtx;

    sec = sec || {};
    sec.names = sec.names || [];
    sec.roles = sec.roles || [];

    if(sec.names.indexOf(user.name) !== -1) {
      return true;
    }

    for(var i = 0; i < user.roles.length; i++) {
      var role = user.roles[i];
      if(sec.roles.indexOf(role) !== -1) {
        return true;
      }
    }

    return false;
  }

  Base.prototype.admin = function() {
    if(!this.authenticated()) {
      return false;
    }

    if(this._role('_admin')) {
      return true;
    }

    return this._sec(this.secObj.admins);
  }

  Base.prototype.member = function() {
    if(!this.authenticated()) {
      return false;
    }

    if(this.admin()) {
      return true;
    }

    return this._sec(this.secObj.members);
  }

  Base.prototype._prop = function(name, value, cb) {
    var parent = this.assert.key;
    if(parent) {
      name = parent + '.' + name;
    }
    var Property = require('sofa/lib/property');
    var property = new Property(name, value, this.newDoc, this.oldDoc, this.userCtx, this.secObj);
    if(cb) {
      cb.call(property, property);
    }
    return property;
  }

  Base.prototype.prop = function(name, cb) {
    var value = this.object[name];
    return this._prop(name, value, cb);;
  }

  Base.prototype.keys = function(cb) {
    var value = Object.keys(this.object);
    return this._prop('_keys', value, cb);
  }

  return Base;
}();