/**
 * HTTP后端数据发送处理函数
 * 更新: 2016/05/07
 */

'use strict';

const fs = require('fs'),
  iconv = require('iconv-lite'),
  through = require('through'),
  superagent = require('superagent'),
  superagentProxy = require('superagent-proxy');

let logger;
// 请求UA
const USER_AGENT = 'antSword/v2.0';

// 请求超时
const REQ_TIMEOUT = 10000;

// 代理配置
const APROXY_CONF = {
  mode: 'noproxy',
  uri: ''
}

class Request {

  constructor(electron) {
    logger = new electron.Logger('Request');
    const ipcMain = electron.ipcMain;

    ipcMain.on('aproxy', this.onAproxy.bind(this));
    ipcMain.on('aproxytest', this.onAproxyTest.bind(this));
    ipcMain.on('request', this.onRequest.bind(this));
    ipcMain.on('download', this.onDownlaod.bind(this));
  }


  /**
   * 加载代理配置
   * @param  {Object} event ipcMain事件
   * @param  {Object} opts  代理配置
   * @return {[type]}       [description]
   */
  onAproxy(event, opts) {
    logger.debug(
      'aProxy::Set Proxy Mode -',
      APROXY_CONF['mode'] === 'manualproxy' ? APROXY_CONF['uri'] : 'noproxy'
    );

    APROXY_CONF['mode'] = opts['aproxymode'];
    APROXY_CONF['uri'] = opts['aproxyuri'];

    if (APROXY_CONF['mode'] === 'noproxy') {
      return superagent.Request.prototype.proxy = function() { return this };
    }
    superagentProxy(superagent);
  }

  /**
   * 监听代理连接测试
   * @param  {Object} event ipcMain事件
   * @param  {Object} opts  测试配置
   * @return {[type]}       [description]
   */
  onAproxyTest(event, opts) {
    logger.debug('aProxy::Test Proxy -', opts['aproxyuri'], '- Connect to ', opts['url']);
    superagentProxy(superagent);
    superagent
      .get(opts['url'])
      .set('User-Agent', USER_AGENT)
      .proxy(opts['aproxyuri'])
      .timeout(REQ_TIMEOUT)
      .end((err, ret) => {
        if (err) {
          logger.fatal("aProxy::Test Error", err);
          return event.sender.send('aproxytest-error-' + opts['hash'], err);
        }else{
          logger.info("aProxy::Test Success");
          return event.sender.send('aproxytest-success-' + opts['hash'], ret);
        }
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

    const _request = superagent.post(opts['url']);
    // 设置headers
    _request.set('User-Agent', USER_AGENT);
    // 自定义headers
    for (let _ in opts.headers) {
      _request.set(_, opts.headers[_]);
    }
    // 自定义body
    const _postData = Object.assign({}, opts.body, opts.data);
    _request
      .proxy(APROXY_CONF['uri'])
      .type('form')
      // 超时
      .timeout(opts.timeout || REQ_TIMEOUT)
      // 忽略HTTPS
      .ignoreHTTPS(opts['ignoreHTTPS'])
      .send(_postData)
      .parse((res, callback) => {
        this.parse(opts['tag_s'], opts['tag_e'], (chunk) => {
          event.sender.send('request-chunk-' + opts['hash'], chunk);
        }, res, callback);
      })
      .end((err, ret) => {
        if (err) {
          return event.sender.send('request-error-' + opts['hash'], err);
        };
        let buff = ret.body;
        // 解码
        let text = iconv.decode(buff, opts['encode']);
        // 回调数据
        event.sender.send('request-' + opts['hash'], {
          text: text,
          buff: buff
        });
      });
  }

  /**
   * 监听下载请求
   * @param  {Object} event ipcMain事件对象
   * @param  {Object} opts  下载配置
   * @return {[type]}       [description]
   */
  onDownlaod(event, opts) {
    logger.debug('onDownlaod', opts);

    // 创建文件流
    const rs = fs.createWriteStream(opts['path']);

    let indexStart = -1;
    let indexEnd = -1;
    let tempData = [];

    const _request = superagent.post(opts['url']);
    // 设置headers
    _request.set('User-Agent', USER_AGENT);
    // 自定义headers
    for (let _ in opts.headers) {
      _request.set(_, opts.headers[_]);
    }
    // 自定义body
    const _postData = Object.assign({}, opts.body, opts.data);
    _request
      .proxy(APROXY_CONF['uri'])
      .type('form')
      // 设置超时会导致文件过大时写入出错
      // .timeout(timeout)
      // 忽略HTTPS
      .ignoreHTTPS(opts['ignoreHTTPS'])
      .send(_postData)
      .pipe(through(
        (chunk) => {
          // 判断数据流中是否包含后截断符？长度++
          let temp = chunk.indexOf(opts['tag_e']);
          if (temp !== -1) {
            indexEnd = Buffer.concat(tempData).length + temp;
          };
          tempData.push(chunk);
          event.sender.send('download-progress-' + opts['hash'], chunk.length);
        },
        () => {
          let tempDataBuffer = Buffer.concat(tempData);

          indexStart = tempDataBuffer.indexOf(opts['tag_s']) || 0;
          // 截取最后的数据
          let finalData = new Buffer(tempDataBuffer.slice(
            indexStart + opts['tag_s'].length,
            indexEnd
          ), 'binary');
          // 写入文件流&&关闭
          rs.write(finalData);
          rs.close();
          event.sender.send('download-' + opts['hash'], finalData.length);
          // 删除内存数据
          finalData = tempDataBuffer = tempData = null;
        }
      ));
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
    const tagHexS = new Buffer(tag_s).toString('hex');
    const tagHexE = new Buffer(tag_e).toString('hex');

    let foundTagS = false;
    let foundTagE = false;
    res.on('data', (chunk) => {

      // 这样吧，我们尝试一种新的数据截取算法：
      // 1. 把数据流转换为16进制
      let chunkHex = new Buffer(chunk).toString('hex');
      // 3. 根据分隔符进行判断截断数据流
      let temp = '';
      // 如果包含前后截断，则截取中间
      if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        let index_s = chunkHex.indexOf(tagHexS);
        let index_e = chunkHex.lastIndexOf(tagHexE);
        temp = chunkHex.substr(index_s + tagHexS.length, index_e - index_s - tagHexE.length);
        foundTagS = foundTagE = true;
      }
      // 如果只包含前截断，则截取后边
      else if (chunkHex.indexOf(tagHexS) >= 0 && chunkHex.lastIndexOf(tagHexE) === -1) {
        temp = chunkHex.split(tagHexS)[1];
        foundTagS = true;
      }
      // 如果只包含后截断，则截取前边
      else if (chunkHex.indexOf(tagHexS) === -1 && chunkHex.lastIndexOf(tagHexE) >= 0) {
        temp = chunkHex.split(tagHexE)[0];
        foundTagE = true;
      }
      // 如果有没有，那就是中途迷路的数据啦 ^.^
      else if (foundTagS && !foundTagE) {
        temp = chunkHex;
      }
      // 4. 十六进制还原为二进制
      let finalData = new Buffer(temp, 'hex');
      // 5. 返回还原好的数据
      chunkCallBack(finalData);

      res.data += finalData;
    });
    res.on('end', () => {
      logger.info(`end.size=${res.data.length}`, res.data);
      callback(null, new Buffer(res.data, 'binary'));
    });
  }

}

module.exports = Request;
