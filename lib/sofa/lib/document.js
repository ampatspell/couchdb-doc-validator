module.exports = function() {

  var inherits = require('sofa/lib/inherits');
  var Base = require('sofa/lib/base');
  var DocumentAssert = require('sofa/lib/document_assert');
  var Attachments = require('sofa/lib/attachments');

  function Document(newDoc, oldDoc, userCtx, secObj) {
    Base.apply(this, arguments);
    this.assert = new DocumentAssert(null, this);
    this.attachments = new Attachments(newDoc, oldDoc, userCtx, secObj);
  }

  inherits(Document, Base);

  return Document;
}();