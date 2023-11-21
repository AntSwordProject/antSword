/**
 * aspx::url_unicode 编码器
 * 把字符转成 %uXXXX 形式
 * eg: Re => %u0052%u0065
 * Create at: 2023/09/07
 */

'use strict';

function char2unicode(c) {
  if (c.length != 1) {
    return '';
  }
  let buff = Buffer.alloc(4, '0');
  let hexstr = c
    .charCodeAt()
    .toString(16);
  buff.write(hexstr, buff.length - hexstr.length, hexstr.length);
  return "\\u" + buff.toString();
}

function string2unicode(str) {
  var ret = "";
  for (var i = 0; i < str.length; i++) {
    ret += char2unicode(str[i]);
  }
  return ret;
}

/*
 * @param  {String} pwd   连接密码
 * @param  {Array}  data  编码器处理前的 payload 数组
 * @return {Array}  data  编码器处理后的 payload 数组
 */
module.exports = (pwd, data, ext = {}) => {
  data[pwd] = string2unicode(data['_']).replace(/\\u/g, 'asunescape(%)u');
  // 删除 _ 原有的payload
  delete data['_'];
  // 返回编码器处理后的 payload 数组
  return data;
}
