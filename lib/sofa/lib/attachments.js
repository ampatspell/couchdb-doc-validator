module.exports = function() {

  var inherits = require('sofa/lib/inherits');
  var Base = require('sofa/lib/base');
  var AttachmentsAssert = require('sofa/lib/attachments_assert');

  function Attachments(newDoc, oldDoc, userCtx, secObj) {
    Base.apply(this, arguments);
    this.object = this.doc._attachments || {};
    this.assert = new AttachmentsAssert('_attachments', this);
  }

  inherits(Attachments, Base);

  return Attachments;
}();