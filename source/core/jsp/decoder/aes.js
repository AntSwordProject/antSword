/**
 * jsp:: aes 解码器
 * Create at: 2021/02/24 17:22:16
 */

'use strict';
const path = require('path');
var CryptoJS = require(path.join(window.antSword.remote.process.env.AS_WORKDIR, 'node_modules/crypto-js'));

function decryptText(keyStr, text) {
  let buff = Buffer.alloc(16, 'a');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  text = text.replace(/[\r\n]/g,"");
  let decodetext = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(keyStr),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString(CryptoJS.enc.Utf8)
  return decodetext;
}

module.exports = {
  /**
   * @returns {string} asenc 将返回数据base64编码
   * 自定义输出函数名称必须为 asenc
   * 该函数使用的语法需要和shell保持一致
   */
  asoutput: () => {
    return ''; // 自定义脚本中此处留空, asenc 函数已经内置
  },

  /**
   * 解码 Buffer
   * @param {string} data 要被解码的 Buffer
   * @returns {string} 解码后的 Buffer
   */
  decode_buff: (data, ext={}) => {
    let keyStr = ext.opts.pwd;
    let ret = decryptText(keyStr, Buffer.from(data).toString());
    return Buffer.from(ret, 'base64');
  }
}