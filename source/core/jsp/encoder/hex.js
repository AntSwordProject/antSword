//
// 16进制编码模块
//

'use strict';

module.exports = (pwd, data, ext = null) => {
  let ret = {};
  for (let _ in data) {
    if (_ === '_') {
      continue
    };
    ret[_] = Buffer
      .from(data[_])
      .toString('hex');
  }
  if (ext.opts['encode'] != "UTF8") {
    ret['charset'] = ext.opts['encode'];
  }
  if (ext.opts['encoder'] != "default") {
    ret['encoder'] = ext.opts['encoder'];
  }
  if (ext.opts['decoder'] != "default") {
    ret['decoder'] = ext.opts['decoder'];
  }
  ret[pwd] = data['_'];
  return ret;
}