var through = require('through2');
var recast = require('recast');

var transformer = require('./unreachableBranchTransformer');

module.exports = function (file, opts) {
  if (typeof file === 'string') {
    opts = opts || [];
    var ignore = ['.json'].concat(opts.ignore || []).some(function(ext) {
      return file.indexOf(ext, file.length - ext.length) !== -1;
    });

    if (ignore) {
      return through();
    }
  }

  var buffers = [];
  return through(function(chunk, enc, cb) {
    buffers.push(chunk);
    cb();
  }, function(cb) {
    var source = Buffer.concat(buffers).toString();
    this.push(transform(source));
    cb();
  });
};

function transform(code/*, opts*/) {
  return recast.print( transformer( recast.parse(code) ) ).code;
}

module.exports.transform = transform;
