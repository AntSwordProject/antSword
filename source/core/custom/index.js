/**
 * CUSTOM服务端脚本模板
 * 开写：2016/04/12
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class CUSTOM extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base', 'command', 'filemanager',
      'database/sqlserver', 'database/mysql', 'database/oracle'
    ].map((_) => {
      this.parseTemplate(`./custom/template/${_}`);
    });
    // 解析编码器
    this.encoders.map((_) => {
      this.parseEncoder(`./custom/encoder/${_}`);
    });
  }

  /**
   * 获取编码器列表
   * @return {array} 编码器列表
   */
  get encoders() {
    return localStorage.getItem('encoders_custom').split(',') || ['base64', 'hex'];
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

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = CUSTOM;
