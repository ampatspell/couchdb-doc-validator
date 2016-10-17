let gulp = require('gulp');
let fs = require('fs');
let sofa = require('./lib');
let pkg = require('./package.json');

gulp.task('default', function() {
  let content = [`exports.version = '${pkg.version}';`];
  for(let key in sofa) {
    let value = sofa[key];
    content.push(`exports.${key} = ${JSON.stringify(value, null, 2)};`);
  }
  let template = `(function(exports){\n${content.join('\n')}\n})(typeof exports === 'undefined' ? this['couchdb_doc_validator'] = {}: exports);`
  fs.writeFileSync('dist.js', template);
});
