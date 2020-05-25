//
// jsp::base64 编码模块
//
// :把除了密码跟api的其他参数都base64编码一次
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
      .toString('base64');
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