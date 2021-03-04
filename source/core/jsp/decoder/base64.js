/**
 * jsp::base64解码器
 */

'use strict';

module.exports = {
  /**
   * @returns {string} 自定义脚本中此处留空, asenc 函数已经内置
   */
  asoutput: () => {
    return ``;
  },
  /**
   * 解码 Buffer
   * @param {Buffer} buff 要被解码的 Buffer
   * @returns {Buffer} 解码后的 Buffer
   */
  decode_buff: (buff) => {
    return Buffer.from(buff.toString(), 'base64');
  }
}