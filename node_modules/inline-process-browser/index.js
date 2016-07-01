'use strict';
var through = require('through2');
var falafel = require('falafel');

module.exports = apply;
function apply() {
  var buffers = [];

  return through(function(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }, function(next) {
    var resp = falafel(Buffer.concat(buffers).toString(), {
      ecmaVersion: 6,
      allowReturnOutsideFunction: true
    }, function (node) {
      if (
        node.type === 'MemberExpression' &&
        node.object && node.property &&
        node.object.name === 'process'
        && node.property.name === 'browser'
        ) {
        node.update('true');
      }
    });
    this.push(resp.toString());
    next();
  });
}
