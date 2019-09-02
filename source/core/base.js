/**
 * 中国蚁剑::核心模块::基础函数库
 * 开写：2016/04/12
 * 更新：2019/09/02 (@Ch1ngg)
 * 作者：蚁逅 <https://github.com/antoor>
 */
'use strict';

const iconv = require('iconv-lite');
const NodeRSA = require('node-rsa');
const fs = require('fs');
const words = require('../../modules/words');


class Base {

  /**
   * 初始化
   * @param  {Object} opts 配置对象
   * @return {Object}      this
   */
  constructor(opts) {
    // 默认配置
    opts['encode'] = opts['encode'] || 'utf8';
    opts['encoder'] = opts['encoder'] || 'default';
    this.__opts__ = opts;
    
    this['__encoder__'] = {
      /**
       * 默认编码器
       * @param  {String} pwd  连接密码
       * @param  {Object} data 请求数据
       * @return {Object}      生成数据
       */
      default (pwd, data) {
        data[pwd] = data['_'];
        delete data['_'];
        return data;
      },
      /**
       * 随机编码器
       * @param  {String} pwd  连接密码
       * @param  {Object} data 请求数据
       * @return {Object}      生成数据
       */
      random(pwd, data) {
        let _encoders = [];
        for (let _ in this) {
          if (_ === 'random') {
            continue
          }
          _encoders.push(_);
        }
        let _index = parseInt(Math.random() * _encoders.length);
        return this[_encoders[_index]](pwd, data);
      }
    }
    this['__decoder__'] = {}
    // 解析自定义编码器
    this
      .user_encoders
      .map((_) => {
        this.parseEncoder(`${_}`);
      });
    this
      .user_decoders
      .map((_) => {
        this.parseDecoder(`${_}`);
      });
  }

  /**
   * 返回 RSA 对象
   * @return {Object}
   */
  rsaEncrypt() {
    let key = new NodeRSA();
    try {
      let priKey = fs.readFileSync(path.join(remote.process.env.AS_WORKDIR, `antData/key_rsa`));
      if (priKey.length > 0) {
        key.importKey(priKey.toString(), 'private');
      }
    } catch (e) {}
    return key;
  }
  
  getRandomVariable(array) {
    var tmp = [];
    while (tmp.length < 6) {
        let v = array[Math.ceil(Math.random() * array.length - 1)];
        tmp.indexOf(v) === -1 && tmp.push(v);
    }
    return tmp;
  }


  /**
   * 返回参数列表
   * @return {array} [arg1, arg2, arg3..]
   */
  argv() {
    // 生成一个随机的变量名
    let random;
    
    if(this.__opts__.otherConf["use-random-variable"] == 1){
      //random = () => `${words.randomWords[parseInt(Math.random() * words.randomWords.length)]}`;//从word.js随机返回单词
      return this.getRandomVariable(words.randomWords);
    }else{
      random = () => `${(Math.random() + Math.random()).toString(16).substr(2)}`; // 返回六个随机变量名数组
      return [
        random(),
        random(),
        random(),
        random(),
        random(),
        random()
      ];
    }
  }

  /**
   * 字符串格式化处理
   * 使用方法：const format = new format()
   * @param  {String} encode [字符串编码，默认utf8]
   * @return {Object}        [返回字符串处理函数对象]
   */
  format(encode) {
    return {
      /**
       * base64编码
       * @param  {String} str 字符串
       * @return {String}     编码后的字符串
       */
      base64(str) {
        return Buffer.from(iconv.encode(Buffer.from(str), encode)).toString('base64');
      },
      /**
       * 字符串转16进制（不进行编码转换
       * @param  {String} str 转换的字符串
       * @return {Buffer}     转换完成的buffer
       */
      buffer(str) {
        return Buffer
          .from(str)
          .toString('hex')
          .toUpperCase();
      },
      /**
       * 字符串转16进制（进行编码转换
       * @param  {String} str 转换的字符串
       * @return {Buffer}     转换完成的buffer
       */
      hex(str) {
        return Buffer.from(iconv.encode(Buffer.from(str), encode))
          .toString('hex')
          .toUpperCase();
      }
    }
  }

  /**
   * 解析脚本模板
   * @param  {String} tpl 模板文件
   * @return {Object}     解析完毕的模板对象（参数`_`为主代码入口
   */
  parseTemplate(tpl) {
    // 把模板路径的`/`转换为`_`
    let templateName = (tpl.split('template/')[1]).replace(/\//g, '_');
    this[templateName] = {};
    // 加载模板
    let _argv = this.argv();
    let templateObj = require(`${tpl}`)(_argv[0], _argv[1], _argv[2], _argv[3], _argv[4], _argv[5]);
    // let formatter = new this.format(this.__opts__['encode']);
    let formatter = Base
      .prototype
      .format(this.__opts__['encode']);
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
                  let func,
                    retStr;
                  if ((tagArr.length > 0) && (func = formatter[tagArr[0]])) {
                    // 如果包含有分割标签且该格式化函数存在，则调用该函数进行处理
                    retStr = func(argv[tagArr[1] || '']);
                  } else {
                    // 否则替换直接返回字符串
                    retStr = argv[tagStr] || '';
                  }
                  // 组合最终生成模板代码
                  data[arg] = data[arg].replace(tag, retStr);
                })
            }
            // 发送HTTP请求
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
   * 解析编码器
   * ? 编码器其实模板返回的脚本对象进行编码处理，主要就是把脚本模板中的`_`主变量改为用户传递的密码
   * @param  {String} enc 编码器文件
   * @return {Object}     编码器处理函数对象
   */
  parseEncoder(enc) {
    // 加载编码器
    // https://github.com/AntSwordProject/antSword/issues/135#issuecomment-475842870
    delete require.cache[require.resolve(`${enc}`)];
    // QAQ！我也不知道为什么，如果直接require变量名，babel编译就会warning，so我只好加个`咯～
    this['__encoder__'][enc.indexOf(`encoder/`) > -1 ?
      enc.split(`encoder/`)[1] :
      enc.split(`encoder\\`)[1]
    ] = require(`${enc}`);
  }

  parseDecoder(dec) {
    delete require.cache[require.resolve(`${dec}`)];
    this['__decoder__'][dec.indexOf(`decoder/`) > -1 ?
      dec.split(`decoder/`)[1] :
      dec.split(`decoder\\`)[1]
    ] = require(`${dec}`);
  }

  /**
   * 编码处理并返回操作
   * @param  {String} tag_s 前截断符
   * @param  {String} tag_e 后截断符
   * @param  {Object} data  源POST数据
   * @return {Object}       最终生成数据// 将返回三个参数对象：tag_s,tag_e,data
   */
  encodeComplete(tag_s, tag_e, data) {
    let ext = {
      opts: this.__opts__,
      rsa: this.rsaEncrypt()
    }
    // 编码器处理
    let finalData = this.__encoder__[this.__opts__['encoder']](this.__opts__['pwd'], data, ext);
    return {
      'tag_s': tag_s,
      'tag_e': tag_e,
      'data': finalData
    };
  }

  /**
   * HTTP请求函数
   * ? 用法：core.request(core.base.info()).then((ret) => {}).catch((e) => {})..
   * @param  {Object} code          请求源数据
   * @param  {Function} chunkCallBack 二进制流回调函数，可选
   * @return {Promise}               Promise操作对象
   */
  request(code, chunkCallBack) {
    const opt = this.complete(code);
    let ext = {
      opts: this.__opts__,
      rsa: this.rsaEncrypt()
    }
    return new Promise((res, rej) => {
      // 随机ID(用于监听数据来源)
      const hash = (String(+new Date) + String(Math.random()))
        .substr(10, 10)
        .replace('.', '_');
      // 监听数据返回
      antSword['ipcRenderer']
        // 请求完毕返回数据{text,buff}
        .once(`request-${hash}`, (event, ret) => {
          let buff = this.__decoder__[this.__opts__['decoder'] || 'default'].decode_buff(ret['buff'], ext);
          let encoding = antSword
            .Decodes
            .detectEncoding(buff, {
              defaultEncoding: "unknown"
            });
          encoding = encoding != "unknown" ?
            encoding :
            this.__opts__['encode'];
          let text = antSword.Decodes.decode(buff, encoding);
          return res({
            'encoding': encoding || "",
            'text': text,
            'buff': buff
          });
        })
        // HTTP请求返回字节流
        .on(`request-chunk-${hash}`, (event, ret) => {
          return chunkCallBack ?
            chunkCallBack(this.__decoder__[this.__opts__['decoder'] || 'default'].decode_buff(ret)) :
            null;
        })
        // 数据请求错误
        .once(`request-error-${hash}`, (event, ret) => {
          return rej(ret);
        })
        // 发送请求数据
        .send('request', {
          url: this.__opts__['url'],
          hash: hash,
          data: opt['data'],
          tag_s: opt['tag_s'],
          tag_e: opt['tag_e'],
          encode: this.__opts__['encode'],
          ignoreHTTPS: (this.__opts__['otherConf'] || {})['ignore-https'] === 1,
          useChunk: (this.__opts__['otherConf'] || {})['use-chunk'] === 1,
          chunkStepMin: (this.__opts__['otherConf'] || {})['chunk-step-byte-min'] || 2,
          chunkStepMax: (this.__opts__['otherConf'] || {})['chunk-step-byte-max'] || 3,
          useMultipart: (this.__opts__['otherConf'] || {})['use-multipart'] === 1,
          useRandomVariable: (this.__opts__['otherConf'] || {})['use-random-variable'] === 1,
          timeout: parseInt((this.__opts__['otherConf'] || {})['request-timeout']),
          headers: (this.__opts__['httpConf'] || {})['headers'] || {},
          body: (this.__opts__['httpConf'] || {})['body'] || {}
        });
    })
  }

  /**
   * 文件下载专用函数（因有些文件过大，导致Electron出错
   * @param  {String} savePath         保存文件路径
   * @param  {Object} postCode         提交数据
   * @param  {Function} progressCallback 进度回调
   * @return {Promise}                  Promise操作对象
   */
  download(savePath, postCode, progressCallback) {
    const opt = this.complete(postCode, true);
    return new Promise((ret, rej) => {
      // 随机ID(用于监听数据来源)
      const hash = (String(+new Date) + String(Math.random()))
        .substr(10, 10)
        .replace('.', '_');
      // 监听数据返回
      antSword['ipcRenderer']
        // 请求完毕返回数据(size)
        .once(`download-${hash}`, (event, size) => {
          return ret(size);
        })
        // HTTP请求返回字节流大小
        .on(`download-progress-${hash}`, (event, size) => {
          return progressCallback ?
            progressCallback(size) :
            null;
        })
        // 数据请求错误
        .once(`download-error-${hash}`, (event, ret) => {
          throw new Error(ret);
        })
        // 发送请求数据
        .send('download', {
          url: this.__opts__['url'],
          hash: hash,
          path: savePath,
          data: opt['data'],
          tag_s: opt['tag_s'],
          tag_e: opt['tag_e'],
          encode: this.__opts__['encode'],
          ignoreHTTPS: (this.__opts__['otherConf'] || {})['ignore-https'] === 1,
          useChunk: (this.__opts__['otherConf'] || {})['use-chunk'] === 1,
          chunkStepMin: (this.__opts__['otherConf'] || {})['chunk-step-byte-min'] || 2,
          chunkStepMax: (this.__opts__['otherConf'] || {})['chunk-step-byte-max'] || 3,
          useMultipart: (this.__opts__['otherConf'] || {})['use-multipart'] === 1,
          useRandomVariable: (this.__opts__['otherConf'] || {})['use-random-variable'] === 1,
          timeout: parseInt((this.__opts__['otherConf'] || {})['request-timeout']),
          headers: (this.__opts__['httpConf'] || {})['headers'] || {},
          body: (this.__opts__['httpConf'] || {})['body'] || {}
        });
    })
  }
}

// export default Base;
module.exports = Base;
