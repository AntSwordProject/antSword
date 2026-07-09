/**
 * HTTP后端数据发送处理函数
 * 更新: 2016/05/07
 */

'use strict';

const fs = require('fs'),
  iconv = require('iconv-lite'),
  jschardet = require('jschardet'),
  through = require('through'),
  CONF = require('./config'),
  superagent = require('superagent'),
  superagentProxy = require('superagent-proxy'),
  ws = require('ws');
const { Readable } = require("stream");
const ProxyAgent = require('proxy-agent');
let wsclients = {};
let logger;
// 请求UA
const USER_AGENT = require('random-fake-useragent');
const { unescape } = require('querystring');

// 请求超时
const REQ_TIMEOUT = 10000;

// 代理配置
const APROXY_CONF = {
  mode: 'noproxy',
  uri: ''
}

/**
 * 忽略 HTTPS 证书校验 SuperAgent patch
 * @param {bool} ignore 
 * @api public 
 */
superagent.Request.prototype.ignoreHTTPS = function(ignore) {
  this._ignoreHttps = !ignore;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = ignore ? '0' : undefined;
  return this;
};

class Request {

  constructor(electron) {
    logger = new electron.Logger('Request');
    const ipcMain = electron.ipcMain;

    ipcMain.on('aproxy', this.onAproxy.bind(this));
    ipcMain.on('aproxytest', this.onAproxyTest.bind(this));
    ipcMain.on('request', this.onRequest.bind(this));
    ipcMain.on('download', this.onDownlaod.bind(this));
    superagentProxy(superagent);
  }

  /**
   * 设置全局代理配置
   * @param  {Object} event ipcMain事件
   * @param  {Object} opts  代理配置
   * @return {[type]}       [description]
   */
  onAproxy(event, opts) {
    logger.debug('aProxy::Set Global Proxy Mode -', APROXY_CONF['mode'] === 'manualproxy' ?
      APROXY_CONF['uri'] :
      'noproxy');

    APROXY_CONF['mode'] = opts['aproxymode'];
    APROXY_CONF['uri'] = opts['aproxyuri'];

    if (APROXY_CONF['mode'] === 'noproxy') {
      APROXY_CONF['uri'] = ''
        //   return superagent.Request.prototype.proxy = function() {
        //     return this
        //   };
    }
    // superagentProxy(superagent);
    event.sender.send('aproxy-update', opts);
  }

  /**
   * 监听代理连接测试
   * @param  {Object} event ipcMain事件
   * @param  {Object} opts  测试配置
   * @return {[type]}       [description]
   */
  onAproxyTest(event, opts) {
    logger.debug('aProxy::Test Proxy -', opts['aproxyuri'], '- Connect to ', opts['url']);
    if (opts['url'].match(CONF.urlblacklist)) {
      return event
        .sender
        .send('request-error-' + opts['hash'], "Blacklist URL");
    }
    // superagentProxy(superagent);
    superagent
      .get(opts['url'])
      .set('User-Agent', USER_AGENT.getRandom())
      .proxy(opts['aproxyuri'])
      .timeout(REQ_TIMEOUT)
      .end((err, ret) => {
        if (err) {
          logger.fatal("aProxy::Test Error", err);
          return event
            .sender
            .send('aproxytest-error-' + opts['hash'], err);
        } else {
          logger.info("aProxy::Test Success");
          return event
            .sender
            .send('aproxytest-success-' + opts['hash'], ret);
        }
      });
  }

  // 设置headers
  buildHeaders(request, opts) {
    let self = this;
    request.set('User-Agent', USER_AGENT.getRandom());
    // 自定义headers
    for (let _ in opts.headers) {
      if (_.toLocaleLowerCase() == 'content-type') {
        self.reqContentType = opts.headers[_];
      }
      request.set(_, opts.headers[_]);
    }
  }

  /**
   * 
   * @param {object} opts 
   * @returns object
   * 
   * 根据 opts 中的配置组装 http body
   */
  buildBody(opts = {}) {
    let _postData = Object.assign({}, opts.body, opts.data);
    if (opts['useRaw'] == 1) {
      // raw 模式 data 部分仅发送 pwd 键下的数据
      let _tmp = encodeURIComponent(opts.data[opts['pwd']]).replace(/asunescape\((.+?)\)/g, function($, $1) {
        return unescape($1);
      });
      // return string
      return _tmp;
    } else {
      let _postarr = [];
      if (opts['addMassData'] == 1) {
        for (let i = 0; i < randomInt(num_min, num_max); i++) { //将混淆流量放入到payload数组中
          _postData[randomString(randomInt(varname_min, varname_max))] = randomString(randomInt(data_min, data_max));
        }
        _postData = randomDict(_postData);
      }
      for (var key in _postData) {
        if (_postData.hasOwnProperty(key)) {
          let _tmp = encodeURIComponent(_postData[key]).replace(/asunescape\((.+?)\)/g, function($, $1) {
            return unescape($1);
          }); // 后续可能需要二次处理的在这里追加
          _postarr.push(`${key}=${_tmp}`);
        }
      }
      if (opts['useMultipart'] == 1) {
        // return object {k: v}
        return _postData;
      }
      // return array ["k1=v1","k2=v2"]
      return _postarr;
    }
  }

  parseWebSocket(tag_s, tag_e, chunkCallBack, sock, callback) {
    const tagHexS = Buffer.from(tag_s).toString('hex');
    const tagHexE = Buffer.from(tag_e).toString('hex');
    let foundTagS = false;
    let foundTagE = false;
    sock.data = '';
    sock.on("message", function(chunk) {
      let chunkHex = Buffer.from(chunk).toString('hex');
      let temp = '';
      if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        let index_s = chunkHex.indexOf(tagHexS);
        let index_e = chunkHex.lastIndexOf(tagHexE);
        temp = chunkHex.substr(index_s + tagHexS.length, index_e - index_s - tagHexS.length);
        foundTagS = foundTagE = // 如果只包含前截断，则截取后边
          true;
      } else if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) === -1) {
        temp = chunkHex.split(tagHexS)[1];
        foundTagS = // 如果只包含后截断，则截取前边
          true;
      } else if (chunkHex.indexOf(tagHexS) === -1 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        temp = chunkHex.split(tagHexE)[0];
        foundTagE = // 如果有没有，那就是中途迷路的数据啦 ^.^
          true;
      } else if (foundTagS && !foundTagE) {
        temp = chunkHex;
      }
      let finalData = Buffer.from(temp, 'hex');
      chunkCallBack(finalData);
      sock.data += finalData;
    });
    sock.on("close", function() {
      logger.info(`ws onclose data.size=${sock.data.length}`, sock.data);
      callback(null, Buffer.from(sock.data, 'binary'));
    });
  }

  /**
   * 监听HTTP请求
   * @param  {Object} event ipcMain事件对象
   * @param  {Object} opts  请求配置
   * @return {[type]}       [description]
   */
  onRequest(event, opts) {
    logger.debug('onRequest::opts', opts);
    let self = this;
    if (opts['url'].match(CONF.urlblacklist)) {
      return event.sender.send('request-error-' + opts['hash'], "Blacklist URL");
    }
    // ws
    if (opts['useWebSocket'] == 1) {
      let wsopts = {
        agent: new ProxyAgent(APROXY_CONF['uri']),
      }
      let sock = new ws(opts['url'], wsopts);
      sock.on("open", function() {
        let _tmp = encodeURIComponent(opts.data[opts['pwd']]).replace(/asunescape\((.+?)\)/g, function($, $1) {
          return unescape($1);
        });
        _tmp = unescape(_tmp);
        logger.debug('onRequest::wsopen-send', _tmp);
        sock.send(_tmp);
      });
      sock.on("error", function(err) {
        event.sender.send('request-error-' + opts['hash'], err);
      });
      self.parseWebSocket(opts['tag_s'], opts['tag_e'], (chunk) => {
        event.sender.send('request-chunk-' + opts['hash'], chunk);
        sock.close();
      }, sock, (err, ret) => {
        if (!ret) {
          return event.sender.send('request-error-' + opts['hash'], err);
        }
        let buff = Buffer.from(ret);
        let text = '';
        let encoding = detectEncoding(buff, {
          defaultEncoding: "unknown"
        });
        logger.debug("detect encoding:", encoding);
        encoding = encoding != "unknown" ? encoding : opts['encode'];
        text = iconv.decode(buff, encoding);
        if (err && text == "") {
          return event.sender.send('request-error-' + opts['hash'], err);
        };
        event.sender.send('request-' + opts['hash'], {
          text: text,
          buff: buff,
          encoding: encoding
        });
      });
      return;
    };
    // http
    self.reqContentType = "form";
    let _request = superagent.post(opts['url']);
    self.buildHeaders(_request, opts);
    let _datasuccess = false; // 表示是否是 404 类shell
    _request = _request
      .proxy(APROXY_CONF['uri'])
      .type(self.reqContentType)
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      .timeout(opts.timeout || REQ_TIMEOUT)
      .ignoreHTTPS(opts['ignoreHTTPS']);
    if (opts['useChunk'] == 1) {
      logger.debug("request with Chunked");
      let antstream;
      if (opts['useRaw'] == 1) {
        // raw 模式 data 部分仅发送 pwd 键下的数据
        let _tmp = unescape(self.buildBody(opts));
        antstream = new AntRead(_tmp, {
          'step': parseInt(opts['chunkStepMin']),
          'stepmax': parseInt(opts['chunkStepMax'])
        });
      } else {
        let _postarr = self.buildBody(opts);
        antstream = new AntRead(_postarr.join("&"), {
          'step': parseInt(opts['chunkStepMin']),
          'stepmax': parseInt(opts['chunkStepMax'])
        });
      }
      _request.parse((res, callback) => {
          self.parse(opts['tag_s'], opts['tag_e'], (chunk) => {
            event.sender.send('request-chunk-' + opts['hash'], chunk);
          }, res, (err, ret) => {
            let buff = ret ? ret : Buffer.from();
            // 自动猜测编码
            let encoding = detectEncoding(buff, {
              defaultEncoding: "unknown"
            });
            logger.debug("detect encoding:", encoding);
            encoding = encoding != "unknown" ? encoding : opts['encode'];
            let text = iconv.decode(buff, encoding);
            if (err && text == "") {
              return event.sender.send('request-error-' + opts['hash'], err);
            };
            // 回调数据
            event.sender.send('request-' + opts['hash'], {
              text: text,
              buff: buff,
              encoding: encoding
            });
            _datasuccess = true;
            callback(null, ret);
          });
        })
        .on('error', (err) => {
          if (_datasuccess == false) {
            return event.sender.send('request-error-' + opts['hash'], err);
          }
        });
      antstream.pipe(_request);
    } else {
      // 通过替换函数方式来实现发包方式切换, 后续可改成别的
      const formdata_send = _request.send;
      let _postarr = self.buildBody(opts);

      if (opts['useRaw'] == 1) {
        _postarr = unescape(_postarr);
      } else {
        if (opts['useMultipart'] == 1) {
          _request.send = _request.field; // multipart 下发送的是 Object
        } else {
          _request.send = formdata_send;
          _postarr = _postarr.join('&'); // form-data 发送的是 key=value 字符串
        }
      }
      _request
        .send(_postarr)
        .buffer(true)
        .parse((res, callback) => {
          self.parse(opts['tag_s'], opts['tag_e'], (chunk) => {
            event.sender.send('request-chunk-' + opts['hash'], chunk);
          }, res, callback);
        })
        .end((err, ret) => {
          if (!ret) {
            // 请求失败 TIMEOUT
            return event.sender.send('request-error-' + opts['hash'], err);
          }
          let buff = ret.hasOwnProperty('body') ? ret.body : Buffer.from();
          // 解码
          let text = "";
          // 自动猜测编码
          let encoding = detectEncoding(buff, {
            defaultEncoding: "unknown"
          });
          logger.debug("detect encoding:", encoding);
          encoding = encoding != "unknown" ? encoding : opts['encode'];
          text = iconv.decode(buff, encoding);
          if (err && text == "") {
            return event.sender.send('request-error-' + opts['hash'], err);
          };
          // 回调数据
          event.sender.send('request-' + opts['hash'], {
            text: text,
            buff: buff,
            encoding: encoding
          });
        });
    }
  }

  /**
   * 监听下载请求
   * @param  {Object} event ipcMain事件对象
   * @param  {Object} opts  下载配置
   * @return {[type]}       [description]
   */
  onDownlaod(event, opts) {
    let self = this;
    logger.debug('onDownlaod', opts);
    if (opts['url'].match(CONF.urlblacklist)) {
      return event.sender.send('request-error-' + opts['hash'], "Blacklist URL");
    }
    // 加载解码器
    let decoder = null;
    if (opts['decoderPath']) {
      try {
        delete require.cache[require.resolve(opts['decoderPath'])];
        decoder = require(opts['decoderPath']);
      } catch (e) {
        logger.error('Failed to load decoder:', e);
      }
    }
    // 创建文件流
    const rs = fs.createWriteStream(opts['path']);

    let indexStart = -1;
    let indexEnd = -1;
    let tempData = [];

    // ws
    if (opts['useWebSocket'] == 1) {
      let wsopts = {
        agent: new ProxyAgent(APROXY_CONF['uri']),
      }
      let sock = new ws(opts['url'], wsopts);
      sock.on("open", function() {
        let _tmp = encodeURIComponent(opts.data[opts['pwd']]).replace(/asunescape\((.+?)\)/g, function($, $1) {
          return unescape($1);
        });
        _tmp = unescape(_tmp);
        logger.debug('onDownlaod::wsopen-send', _tmp);
        sock.send(_tmp);
      });
      sock.on("error", function(err) {
        event.sender.send('download-error-' + opts['hash'], err);
      });
      self.parseWebSocket(opts['tag_s'], opts['tag_e'], (chunk) => {
        event.sender.send('download-progress-' + opts['hash'], chunk.length);
        sock.close();
      }, sock, (err, ret) => {
        if (!ret) {
          return event.sender.send('download-error-' + opts['hash'], err);
        }
        // 应用解码器
        let finalData = ret;
        if (decoder && typeof decoder.decode_buff === 'function') {
          try {
            finalData = decoder.decode_buff(ret);
          } catch (e) {
            logger.error('Decoder error:', e);
          }
        }
        rs.write(finalData);
        rs.close();
        event.sender.send('download-' + opts['hash'], finalData.length);
      });
      return;
    };

    self.reqContentType = "form";
    let _request = superagent.post(opts['url']);
    // 设置headers
    self.buildHeaders(_request, opts);
    let _datasuccess = false; // 表示是否是 404 类shell
    _request = _request
      .proxy(APROXY_CONF['uri'])
      .type(self.reqContentType)
      .ignoreHTTPS(opts['ignoreHTTPS'])
      // 自定义body
    let _postData = Object.assign({}, opts.body, opts.data);
    if (opts['useChunk'] == 1) {
      logger.debug("request with Chunked");
      let antstream;
      if (opts['useRaw'] == 1) {
        // raw 模式 data 部分仅发送 pwd 键下的数据
        let _tmp = unescape(self.buildBody(opts));
        antstream = new AntRead(_tmp, {
          'step': parseInt(opts['chunkStepMin']),
          'stepmax': parseInt(opts['chunkStepMax'])
        });
      } else {
        let _postarr = self.buildBody(opts);
        antstream = new AntRead(_postarr.join("&"), {
          'step': parseInt(opts['chunkStepMin']),
          'stepmax': parseInt(opts['chunkStepMax'])
        });
      }
      _request
        .parse((res, callback) => {
          res.pipe(through((chunk) => {
            // 判断数据流中是否包含后截断符？长度++
            let temp = chunk.indexOf(opts['tag_e']);
            if (temp !== -1) {
              indexEnd = Buffer.concat(tempData).length + temp;
            };
            tempData.push(chunk);
            event.sender.send('download-progress-' + opts['hash'], chunk.length);
          }, () => {
            let tempDataBuffer = Buffer.concat(tempData);

            indexStart = tempDataBuffer.indexOf(opts['tag_s']) || 0;
            // 截取最后的数据
            let finalData = Buffer.from(tempDataBuffer.slice(indexStart + opts['tag_s'].length, indexEnd), 'binary');
            // 应用解码器
            if (decoder && typeof decoder.decode_buff === 'function') {
              try {
                finalData = decoder.decode_buff(finalData);
              } catch (e) {
                logger.error('Decoder error:', e);
              }
            }
            // 写入文件流&&关闭
            rs.write(finalData);
            rs.close();
            event.sender.send('download-' + opts['hash'], finalData.length);
            _datasuccess = true;
            // 删除内存数据
            finalData = tempDataBuffer = tempData = null;
          }))
        })
        .on('error', (err) => {
          if (_datasuccess == false) {
            return event.sender.send('download-error-' + opts['hash'], err);
          }
        });
      antstream.pipe(_request);
    } else {
      // 通过替换函数方式来实现发包方式切换, 后续可改成别的
      const formdata_send = _request.send;
      let _postarr = self.buildBody(opts);
      if (opts['useRaw'] == 1) {
        _postarr = unescape(_postarr);
      } else {
        if (opts['useMultipart'] == 1) {
          _request.send = _request.field;
        } else {
          _request.send = formdata_send;
          _postarr = _postarr.join('&');
        }
      }
      _request
        .send(_postarr)
        .pipe(through((chunk) => {
          // 判断数据流中是否包含后截断符？长度++
          let temp = chunk.indexOf(opts['tag_e']);
          if (temp !== -1) {
            indexEnd = Buffer.concat(tempData).length + temp;
          };
          tempData.push(chunk);
          event.sender.send('download-progress-' + opts['hash'], chunk.length);
        }, () => {
          let tempDataBuffer = Buffer.concat(tempData);

          indexStart = tempDataBuffer.indexOf(opts['tag_s']) || 0;
          // 截取最后的数据
          let finalData = Buffer.from(tempDataBuffer.slice(indexStart + opts['tag_s'].length, indexEnd), 'binary');
          // 应用解码器
          if (decoder && typeof decoder.decode_buff === 'function') {
            try {
              finalData = decoder.decode_buff(finalData);
            } catch (e) {
              logger.error('Decoder error:', e);
            }
          }
          // 写入文件流&&关闭
          rs.write(finalData);
          rs.close();
          event.sender.send('download-' + opts['hash'], finalData.length);
          // 删除内存数据
          finalData = tempDataBuffer = tempData = null;
        }))
        .on('error', (err) => {
          return event.sender.send('download-error-' + opts['hash'], err);
        });;
    }
  }

  /**
   * 二进制数据流解析
   * @param  {String}   tag_s         数据截断符号(前)
   * @param  {String}   tag_e         数据截断符号(后)
   * @param  {Function}   chunkCallBack 数据流回调函数
   * @param  {Object}   res           Superagent::res对象
   * @param  {Function} callback      数据获取完毕回调事件
   * @return {[type]}                 [description]
   */
  parse(tag_s, tag_e, chunkCallBack, res, callback) {
    // 数据转换二进制处理
    res.setEncoding('binary');
    res.data = '';
    // 2. 把分隔符转换为16进制
    const tagHexS = Buffer
      .from(tag_s)
      .toString('hex');
    const tagHexE = Buffer
      .from(tag_e)
      .toString('hex');

    let foundTagS = false;
    let foundTagE = false;
    res.on('data', (chunk) => {
      // 这样吧，我们尝试一种新的数据截取算法：
      // 1. 把数据流转换为16进制
      let chunkHex = Buffer
        .from(chunk)
        .toString('hex');
      // 3. 根据分隔符进行判断截断数据流
      let temp = '';
      // 如果包含前后截断，则截取中间
      if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        let index_s = chunkHex.indexOf(tagHexS);
        let index_e = chunkHex.lastIndexOf(tagHexE);
        temp = chunkHex.substr(index_s + tagHexS.length, index_e - index_s - tagHexS.length);
        foundTagS = foundTagE = // 如果只包含前截断，则截取后边
          true;
      } else if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) === -1) {
        temp = chunkHex.split(tagHexS)[1];
        foundTagS = // 如果只包含后截断，则截取前边
          true;
      } else if (chunkHex.indexOf(tagHexS) === -1 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        temp = chunkHex.split(tagHexE)[0];
        foundTagE = // 如果有没有，那就是中途迷路的数据啦 ^.^
          true;
      } else if (foundTagS && !foundTagE) {
        temp = chunkHex;
      }
      // 4. 十六进制还原为二进制
      let finalData = Buffer.from(temp, 'hex');
      // 5. 返回还原好的数据
      chunkCallBack(finalData);

      res.data += finalData;
    });
    res.on('end', () => {
      logger.info(`end.size=${res.data.length}`, res.data);
      callback(null, Buffer.from(res.data, 'binary'));
    });
  }

}

/**
 * 判断指定buffer对象的字符编码
 * ref: https://github.com/LeoYuan/leoyuan.github.io/issues/25
 * @param buffer
 * @param options
 *  - defaultEncoding 指定默认编码集
 *  - minConfidence   指定可接受的最小confidence，如果判断结果小于此值，则用defaultEncoding
 *  - verbose         返回更加详细的字符编码数据
 * @returns {*}
 */
function detectEncoding(buffer, options) {

  options = options || {};
  buffer = buffer || Buffer('');

  var DEFAULT_ENCODING = 'GBK',
    MIN_CONFIDENCE = 0.96;
  var verbose = options.verbose;
  var defaultEncoding = options.defaultEncoding || DEFAULT_ENCODING;
  var minConfidence = options.minConfidence || MIN_CONFIDENCE;
  var ret = jschardet.detect(buffer),
    encoding = ret.encoding === 'ascii' ?
    'utf-8' :
    ret.encoding,
    confidence = ret.confidence;
  // var VALID_ENCODINGS = ['gb2312', 'gbk', 'utf-8', 'big5', 'euc-kr','euc-jp'];

  if (encoding === null || !iconv.encodingExists(encoding) || confidence < minConfidence) {
    return verbose ? {
        encoding: defaultEncoding,
        oriEncoding: encoding,
        confidence: confidence
      } :
      defaultEncoding;
  } else {
    encoding = encoding.toUpperCase();
    return verbose ? {
        encoding: encoding,
        oriEncoding: encoding,
        confidence: confidence
      } :
      encoding;
  }
};

/**
 * 控步长的可读流
 * @param data  [string|buffer] 输入源
 * @param options {} 配置
 *    step     步长
 *    stepmax  最大步长,默认与步长相等,如果大于步长，则每次读取时后随机返回 [step, stepmax] 长度的数据
 */
class AntRead extends Readable {
  constructor(data, options = {}) {
    super();
    this.index = 0;
    let o = {};
    o.step = options.hasOwnProperty('step') ?
      parseInt(options['step']) :
      2;
    o.step = o.step < 1 ?
      2 :
      o.step;
    o.stepmax = options.hasOwnProperty('stepmax') ?
      options['stepmax'] :
      o.step;
    if (o.stepmax < o.step) {
      o.stepmax = o.step;
    }
    let chunk;
    if ('string' === typeof data) {
      chunk = data;
    } else if ('object' === typeof data && Buffer.isBuffer(data)) { // buffer
      chunk = Buffer
        .from(data)
        .toString();
    } else {
      throw Error("data must be string, buffer.");
    }
    this.chunk = chunk;
    this.o = o;
  }

  // 重写自定义的可读流的 _read 方法
  _read() {
    let blakwords = /eval|assert|base64_decode|preg_replace|call_user_func|create_function|str_replace|array_map|system|popen|exec|function_exists|passthru|shell_exec|frombase64string|unsafe|response|execute/i;
    let step = this.randomNum(this.o.step, this.o.stepmax);
    if (this.index >= this.chunk.length) {
      this.push(null);
    } else {
      let _subcode = this
        .chunk
        .substring(this.index, this.index + step) + "";
      let m = _subcode.match(blakwords);
      if (m) {
        let sub_step = this.randomNum(1, m[0].length - 1);
        _subcode = _subcode.substring(0, m.index + sub_step);
        step = m.index + sub_step;
      }
      this.push(_subcode);
    }
    this.index += step;
  }

  // random [n, m]
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      default:
        return 0;
    }
  }
}
let varname_min = 5; //变量名最小长度
let varname_max = 15; // 变量名最大长度
let data_min = 200; // 变量值最小长度
let data_max = 250; // 变量值最大长度
let num_min = 150; // 变量最小个数
let num_max = 250; // 变量最大个数

function randomString(length) { // 生成随机字符串
  //let chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function randomInt(min, max) { //生成指定范围内的随机数
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}

function randomDict(dic) {
  let tmparray = []
  for (let i in dic) {
    tmparray.push(i)
  }
  tmparray = tmparray.sort((a, b) => { return Math.random() > 0.5 ? -1 : 1; })
  let finaldata = {}
  tmparray.forEach(i => {
    finaldata[i] = dic[i]
  });
  return finaldata
}


module.exports = Request;