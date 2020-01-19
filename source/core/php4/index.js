/**
 * PHP4 服务端脚本模板
 */
'use strict';

//const Base = require('../base');
const PHP = require('../php/index');

class PHP4 extends PHP {
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
    let asencCode;
    if (!force_default) {
      asencCode = this.__decoder__[this.__opts__['decoder'] || 'default'].asoutput();
    } else {
      asencCode = this
        .__decoder__['default']
        .asoutput();
    }
    // 组合完整的代码
    let tmpCode = data['_'];
    data['_'] = `@ini_set("display_errors", "0");@set_time_limit(0);${asencCode};function asoutput(){$output=ob_get_contents();ob_end_clean();echo "${tag_s}";echo @asenc($output);echo "${tag_e}";}ob_start();${tmpCode};asoutput();die();`;

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = PHP4;