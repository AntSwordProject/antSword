//
// Superagent发包模块
//

'use strict';

const log4js = require('log4js');
const iconv = require('iconv-lite');
const superagent = require('superagent');

const logger = log4js.getLogger('Request');

var aproxymode = "noproxy";
var aproxyuri = "";

class Request {

  constructor(electron) {
    // 监听请求
    const ipcMain = electron.ipcMain;

    // 代理测试
    ipcMain.on('aproxytest', (event, opts) => {
      var _superagent = require('superagent');
      var _aproxyuri = opts['aproxyuri'];
      logger.debug("[aProxy] Test Proxy - " + _aproxyuri + " - Connect to " + opts['url']);
      require('superagent-proxy')(superagent);
      _superagent
      .get(opts['url'])
      .proxy(_aproxyuri)
      .timeout(5000)
      .end((err, ret) => {
        if (err) {
          logger.debug("[aProxy] Test Error");
          return event.sender.send('aproxytest-error', err);
        }else{
          logger.debug("[aProxy] Test Success");
          return event.sender.send('aproxytest-success', ret);
        }
      });

    });
    // 加载代理设置
    ipcMain.on('aproxy', (event, opts) => {
      aproxymode = opts['aproxymode'];
      aproxyuri = opts['aproxyuri'];
      logger.debug("[aProxy] Set Proxy Mode - " + (aproxymode == "manualproxy" ? aproxyuri : " noproxy"));
      if (aproxymode == "noproxy") {
        superagent.Request.prototype.proxy=function(arg) {
          return this;
        };
      }else{
        require('superagent-proxy')(superagent);
      };
    });
    // 监听请求
    ipcMain.on('request', (event, opts) => {
      logger.debug("[aProxy] Connect mode - " + (aproxymode == "manualproxy" ? aproxyuri : " noproxy"));
      logger.debug(opts['url'] + '\n', opts['data']);
      superagent
        .post(opts['url'])
        .set('User-Agent', 'antSword/1.0')
        .proxy(aproxyuri)
        .type('form')
        .timeout(5000)
        .send(opts['data'])
        .parse((res, callback) => {
          this.parse(opts['tag_s'], opts['tag_e'], (chunk) => {
            event.sender.send('request-chunk-' + opts['hash'], chunk);
          }, res, callback);
        })
        .end((err, ret) => {
          if (err) {
            return event.sender.send('request-error-' + opts['hash'], err);
          };
          const buff = ret.body;
          // 解码
          const text = iconv.decode(buff, opts['encode']);
          // 回调数据
          event.sender.send('request-' + opts['hash'], {
            text: text,
            buff: buff
          });
        });
    });
  }

  // 二进制数据流解析
  parse(tag_s, tag_e, hook, res, callback) {
    // 数据转换二进制处理
    res.setEncoding('binary');
    res.data = '';
    let foundTagS = false;
    let foundTagE = false;
    res.on('data', (chunk) => {
      let temp = '';

      // 如果包含前后截断，则截取中间
      if (chunk.indexOf(tag_s) >= 0 && chunk.lastIndexOf(tag_e) >= 0) {
        const index_s = chunk.indexOf(tag_s);
        const index_e = chunk.lastIndexOf(tag_e);
        temp = chunk.substr(index_s + tag_s.length, index_e - index_s - tag_e.length);
        foundTagS = foundTagE = true;
      }
      // 如果只包含前截断，则截取后边
      else if (chunk.indexOf(tag_s) >= 0 && chunk.lastIndexOf(tag_e) === -1) {
        temp = chunk.split(tag_s)[1];
        foundTagS = true;
      }
      // 如果只包含后截断，则截取前边
      else if (chunk.indexOf(tag_s) === -1 && chunk.lastIndexOf(tag_e) >= 0) {
        temp = chunk.split(tag_e)[0];
        foundTagE = true;
      }
      // 如果有没有，那就是中途迷路的数据啦 ^.^
      else if (foundTagS && !foundTagE) {
        temp = chunk;
      }

      // 回调实时获取数据hook
      hook(new Buffer(temp, 'binary'));

      res.data += temp;
    });
    res.on('end', () => {
      logger.info('end::size=' + res.data.length, res.data.length < 10 ? res.data : '');
      callback(null, new Buffer(res.data, 'binary'));
    });
  }

}

module.exports = Request;
