module.exports = function() {

  function Assert(key, parent) {
    this.key = key;
    this.parent = parent;
  }

  Assert.prototype._format = function(error) {
    var parent = this.parent.key;
    var key = this.key;
    if(key) {
      return key + ' ' + error
    }
    return error;
  }

  Assert.prototype.fail = function(error) {
    this.parent.forbidden(this._format(error));
  }

  Assert.prototype.succeed = function(error) {
    this.parent.log('ok: ' + this._format(error));
  }

  Assert.prototype.ok = function(condition, error) {
    if(!condition) {
      this.fail(error);
    } else {
      this.succeed(error);
    }
  }

  Assert.prototype.authenticated = function() {
    this.ok(this.parent.authenticated(), 'must be logged in');
  }

  Assert.prototype.admin = function() {
    this.ok(this.parent.admin(), 'must be admin');
  }

  Assert.prototype.member = function() {
    this.ok(this.parent.member(), 'must be admin or member');
  }

  Assert.prototype.role = function(role) {
    this.ok(this.parent.role(role), 'must be admin or have "' + role + '" role');
  }

  return Assert;
}();