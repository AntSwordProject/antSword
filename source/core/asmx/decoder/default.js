/**
 * aspx::default解码器
 */

'use strict';

module.exports = {
  asoutput: () => {
    return ``.replace(/\n\s+/g, '');
  },
  decode_buff: (buff) => {
    return buff;
  }
}