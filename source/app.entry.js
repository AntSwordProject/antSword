/**
 * 中国蚁剑::程序入口
 * 创建：2015/12/20
 * 更新：2016/05/02
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

const fs = require('fs'),
  path = require('path'),
  electron = require('electron'),
  shell = electron.shell,
  remote = electron.remote,
  ipcRenderer = electron.ipcRenderer;

const Menubar = require('./base/menubar');
const CacheManager = require('./base/cachemanager');

const antSword = window.antSword = {
  /**
   * XSS过滤函数
   * @param  {String}  html 过滤前字符串
   * @param  {Boolean} wrap 是否过滤换行
   * @return {String}       过滤后的字符串
   */
  noxss: (html = '', wrap = true) => {
    let _html = String(html)
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
    if (wrap) {
      _html = _html.replace(/\n/g, '<br/>');
    }
    return _html;
  },
  /**
   * 终端日志数据
   * @type {Array}
   */
  logs: [],
  /**
   * 核心模块
   * @type {Object}
   */
  encoders: {},
  /**
   * 核心模块
   * @type {Object}
   */
  core: {},
  /**
   * 插件列表
   * @type {Object}
   */
  plugins: {},
  /**
   * 操作模块
   * @type {Object}
   */
  modules: {},
  /**
   * localStorage存储API
   * ? 如果只有一个key参数，则返回内容，否则进行设置
   * @param  {String} key   存储键值，必选
   * @param  {String} value 存储内容，可选
   * @param  {String} def   默认内容，可选
   * @return {None}       [description]
   */
  storage: (key, value, def) => {
    // 读取
    if (!value) {
      return localStorage.getItem(key) || def;
    };
    if (typeof(x) === "object")
      value = JSON.stringify(value);
    // 设置
    localStorage.setItem(key, value);
  },
  /**
   * 重新加载插件（包含开发者&&本地插件库
   * @return {[type]} [description]
   */
  reloadPlug() {
    antSword['plugins'] = {};
    // 加载插件：：本地
    let pluginHome = ipcRenderer.sendSync('store-config-plugPath');
    fs.readdirSync(pluginHome).map((_) => {
      let pluginPath = path.join(pluginHome, _);
      // 如果不是目录，则跳过
      if (!fs.lstatSync(pluginPath).isDirectory()) { return }
      // 存储路径&&package信息到全局变量antSword['plugins']
      antSword['plugins'][_] = {
        _id: _,
        path: pluginPath,
        info: JSON.parse(fs.readFileSync(path.join(pluginPath, 'package.json')))
      }
    });
    // 加载插件：：开发
    let devPlugPath = antSword.storage('dev-plugPath');
    if (
      antSword.storage('isDev') === '1' &&
      fs.existsSync(devPlugPath) &&
      fs.lstatSync(devPlugPath).isDirectory()
    ) {
      fs.readdirSync(devPlugPath).map((_) => {
        let _path = path.join(devPlugPath, _);
        // 如果不是目录，则跳过
        if (!fs.lstatSync(_path).isDirectory()) { return }
        antSword['plugins'][_] = {
          _id: _,
          path: _path,
          info: JSON.parse(fs.readFileSync(path.join(_path, 'package.json')))
        }
      });
    }
  }
};

// 加载核心模板
antSword['core'] = require('./core/');

// 加载语言模板
antSword['language'] = require('./language/');

// 加载编码
antSword['encoders'] = (function(){
  var encoders = {asp:[],aspx:[],php:[],custom:[]};
  // custom
  let es = fs.readdirSync(path.join(process.env.AS_WORKDIR,'antData/encoder'));
  if(es){
    es.map((_)=>{
      let farr = _.split("#");
      encoders[farr[0]].push(farr[1].slice(0,-3));
    });
  }
  // default
  ['asp','aspx','php','custom'].map((t)=>{
    antSword["core"][t].prototype.encoders.map((e)=>{
      encoders[t].push(e);
    });
    encoders[t] = encoders[t].unique();
  });
  // fs.readdirSync(path.join(process.env.AS_WORKDIR,'encoder'),(err,f) => {
  //   if(err || !f) return ;
  //   console.debug(f);
  //   let farr = f.split("#");
  //   encoders[farr[0]].push(farr[1]);
  // });
  return encoders;
})();

// 加载代理
const aproxy = {
  mode: antSword['storage']('aproxymode', false, 'noproxy'),
  port: antSword['storage']('aproxyport'),
  server: antSword['storage']('aproxyserver'),
  password: antSword['storage']('aproxypassword'),
  username: antSword['storage']('aproxyusername'),
  protocol: antSword['storage']('aproxyprotocol')
}
antSword['aproxymode'] = aproxy['mode'];

antSword['aproxyauth'] = (
  !aproxy['username'] || !aproxy['password']
) ? '' : `${aproxy['username']}:${aproxy['password']}`;

antSword['aproxyuri'] = `${aproxy['protocol']}:\/\/${antSword['aproxyauth']}@${aproxy['server']}:${aproxy['port']}`;

// 通知后端设置代理
ipcRenderer.send('aproxy', {
  aproxymode: antSword['aproxymode'],
  aproxyuri: antSword['aproxyuri']
});

antSword['shell'] = shell;
antSword['remote'] = remote;
antSword['ipcRenderer'] = ipcRenderer;
antSword['CacheManager'] = CacheManager;
antSword['menubar'] = new Menubar();
antSword['package'] = require('../package');

// 加载模块列表
antSword['tabbar'] = new dhtmlXTabBar(document.body);
[
  'shellmanager',
  'settings',
  'plugin'
].map((_) => {
  let _module = require(`./modules/${_}/`);
  antSword['modules'][_] = new _module();
});
// 移除加载界面&&设置标题
$('#loading').remove();
document.title = antSword['language']['title'] || 'AntSword';


/**
 * 日志组输出
 * - 日志只会输出最多100个字符，如果想查看全部数据，则可以通过antSword.logs[id]进行查看
 * @param  {Object} opt   日志对象[0=日志，1=对象]
 * @param  {String} color 输出颜色
 * @return {[type]}       [description]
 */
const groupLog = (opt, color) => {
  if (antSword.logs.length % 10 === 0) {
    console.group(`LOGS: ${antSword.logs.length}+`);
  }
  let lineNum = antSword['logs'].push(opt[1]) - 1;
  console.log(
    `%c0x${lineNum < 10 ? '0' + lineNum : lineNum}\t${opt[0].substr(0, 100) + (opt[0].length > 100 ? '..' : '')}`,
    `color:${color}`
  );
  if (antSword.logs.length % 10 === 0) {
    console.groupEnd();
  }
}

// 监听后端消息
ipcRenderer
  /**
   * 刷新UI（shellmanager侧边栏
   * @param  {[type]} 'reloadui' [description]
   * @param  {[type]} (          [description]
   * @return {[type]}            [description]
   */
  .on('reloadui', () => {
    setTimeout(() => {
      antSword.modules.shellmanager.category.cell.setWidth(222);
    }, 555);
  })
  /**
   * 通知提示更新
   * @param  {[type]} 'notification-update' [description]
   * @param  {[type]} (e,                   opt           [description]
   * @return {[type]}                       [description]
   */
  .on('notification-update', (e, opt) => {
    let n = new Notification(antSword['language']['update']['title'], {
      body: antSword['language']['update']['body'](opt['ver'])
    });
    n.addEventListener('click', () => {
      antSword.shell.openExternal(opt['url']);
    });
  })
  /**
   * 重新加载本地插件
   * @param  {[type]} 'reloadPlug' [description]
   * @param  {[type]} (            [description]
   * @return {[type]}              [description]
   */
  .on('reloadPlug', antSword.reloadPlug.bind(antSword))
  /**
   * 后端日志输出
   * + 用于在前端控制台输出后端的日志
   * - 可使用`antSword.logs[id]`来获取详细日志
   */
  .on('logger-debug', (e, opt) => {
    groupLog(opt, '#607D8B');
  })
  .on('logger-info', (e, opt) => {
    groupLog(opt, '#4CAF50');
  })
  .on('logger-warn', (e, opt) => {
    groupLog(opt, '#FF9800');
  })
  .on('logger-fatal', (e, opt) => {
    groupLog(opt, '#E91E63');
  });

antSword.reloadPlug();
// 检查更新
setTimeout(
  antSword.ipcRenderer.send.bind(antSword.ipcRenderer, 'check-update'),
  1000 * 60
);
