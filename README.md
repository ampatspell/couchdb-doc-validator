# CouchDB validate_doc_update validator

Usage:

``` javascript
let sofa = window.couchdb_doc_validator;

// _design/thing
const thing = {
  sofa,
  validate_doc_update(newDoc, oldDoc, userCtx, secObj) {
    var Validator = require('sofa/validator')(newDoc, oldDoc, userCtx, secObj);
    Validator.forType('thing', function() {
      if(this.saved) {
        this.assert.authenticated();

        this.prop('name', function() {
          this.assert.string();
          this.assert.username();
          this.assert.unchanged();
        });

        this.prop('thingie', function() {
          this.assert.string();
          this.assert.unchanged();
          this.assert.equal('good day');
        });

      } else {
        this.assert.admin();
      }
    });
  }
};

db.get('design').save('thing', thing);
```
