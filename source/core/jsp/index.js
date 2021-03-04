/**
 * JSP服务端脚本模板
 * 作者：yzddMr6
 */
'use strict';


const Base = require('../base');

class JSP extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base',
      'command',
      'filemanager',
      'other',
      'database/sqlserver',
      'database/mysql',
      'database/oracle'
    ].map((_) => {
      try {
        this.parseJspTemplate(`./template/${_}`); 
      } catch (error) {
        console.error(error);
      }
    });
    // 解析编码器
    this
      .encoders
      .map((_) => {
        this.parseEncoder(`./jsp/encoder/${_}`);
      });
    this
      .decoders
      .map((_) => {
        this.parseDecoder(`./jsp/decoder/${_}`);
      });
  }

  /**
   * 获取编码器列表
   * @return {array} 编码器列表
   */
  get encoders() {
    return [];
  }

  get decoders() {
    return ['default','base64','aes'];
  }

  /**
   * HTTP请求数据组合函数
   * @param  {Object} data 通过模板解析后的代码对象
   * @return {Promise}     返回一个Promise操作对象
   */
  complete(data, force_default = false) {
    // aes 加密key
    let aeskey = this.__opts__['pwd'];
    let buff = Buffer.alloc(16, 'a');
    buff.write(aeskey,0);
    aeskey = buff.toString();
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
    data['_'] = this.replaceClassStringVar(data['_'], '->|', tag_s);
    data['_'] = this.replaceClassStringVar(data['_'], '|<-', tag_e);
    //获取解码名字放入变量中
    data['_'] = this.replaceClassStringVar(data['_'], 'antswordDefault', this.__opts__["decoder"]);
    //获取定义好的加密key放在变量中
    data['_'] = this.replaceClassStringVar(data['_'], 'antswordAESKey', aeskey);
    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }

  /**
   * JSP 脚本解析模版
   * @param   {String} tpl  模版文件
   * @returns {Object}      解析完毕的模板对象（参数`_`为主代码入口
   */
  parseJspTemplate(tpl) {
    // 把模板路径的`/`转换为`_`
    let templateName = (tpl.split('template/')[1]).replace(/\//g, '_');
    this[templateName] = {};
    // 加载模板
    let _argv = this.argv();
    let templateObj = require(`${tpl}`)(_argv[0], _argv[1], _argv[2], _argv[3], _argv[4], _argv[5]);
    let formatter = Base
      .prototype
      .format(this.__opts__);
    // 解析模板
    for (let funcName in templateObj) {
      this[templateName][funcName] = ((args) => {
        if (typeof (args) === 'object') {
          // 如果脚本函数需要参数，则进行解析
          return (argv) => {
            let data = {};
            // 克隆源数据到返回数据中
            for (let _ in args) {
              data[_] = args[_];
            }
            // 循环替换脚本中的标签
            for (let arg in args) {
              (args[arg].match(/#{([\w\:]+)}/g) || []).map(
                // example: #{hex::str} = hex(str), #{arg1} = arg1
                (tag) => {
                  let tagStr = tag.substr(2, tag.length - 3);
                  let tagArr = tagStr.split('::');
                  let func, retStr;
                  if ((tagArr.length > 0) && (func = formatter[tagArr[0]])) {
                    // 如果包含有分割标签且该格式化函数存在，则调用该函数进行处理
                    retStr = func(argv[tagArr[1] || '']);
                    data['_'] = this.replaceClassStringVar(data['_'], `antswordarg${tagArr[1]}`, arg);
                  } else {
                    // 否则替换直接返回字符串
                    retStr = argv[tagStr] || '';
                    data['_'] = this.replaceClassStringVar(data['_'], `antswordarg${tagStr}`, arg);
                  }
                  // 组合最终生成模板代码
                  data[arg] = data[arg].replace(tag, retStr);
                });
            }
            // 发送HTTP请求
            data['_'] = this.replaceClassStringVar(data['_'], 'antswordCharset', this.__opts__["encode"]);
            data['_'] = this.replaceClassStringVar(data['_'], 'antswordrandomPrefix', this.__opts__.otherConf["random-Prefix"]);
            return data;
          }
        } else {
          // 否则直接返回
          return () => ({
            _: args
          });
        }
      })(templateObj[funcName]);
    }
  }

  /**
   * 字节码String类型内容替换
   * 
   */
  replaceClassStringVar(b64code, oldvar, newvar) {
    let code = Buffer.from(b64code, 'base64');
    let hexcode = code.toString('hex');
    let hexoldvar = Buffer.from(oldvar).toString('hex');
    let oldpos = hexcode.indexOf(hexoldvar);
    if (oldpos > -1) {
      let newlength = this.decimalToHex(newvar.length, 4);
      let retcode = `${hexcode.slice(0, oldpos - 4)}${newlength}${Buffer.from(newvar).toString('hex')}${hexcode.slice(oldpos + hexoldvar.length)}`;
      return Buffer.from(retcode, 'hex').toString('base64');
    }
    return b64code;
  }

  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  }
}

module.exports = JSP;