/**
 * JSP::default解码器
 */

'use strict';

module.exports = {
  asoutput: () => {
    return ``.replace(/\n\s+/g, '');
  },
  decode_buff: (data) => {
    return data;
  }
}