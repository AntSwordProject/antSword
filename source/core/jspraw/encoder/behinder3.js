/**
 * jspraw:: behinder AES 编码器
 * Create at: 2024/09/08 22:45:53
 * 
 */

'use strict';
var CryptoJS = require('crypto-js');

function encryptText(keyStr, textBytes) {
  let textWordArray = CryptoJS.lib.WordArray.create(textBytes);
  let encodetext = CryptoJS.AES.encrypt(textWordArray, CryptoJS.enc.Utf8.parse(keyStr), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encodetext;
}

/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data, ext={}) => {

  let key = CryptoJS.MD5(pwd).toString().substr(0,16);
  data[pwd] = encryptText(key, Buffer.from(data['_'],'base64'));
  delete data['_'];
  return data;
}
