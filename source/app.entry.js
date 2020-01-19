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
const Decodes = require('./base/decodes');

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
      .replace(/'/g, "&apos;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
    if (wrap) {
      _html = _html.replace(/\n/g, '<br/>');
    }
    return _html;
  },
  /**
   * unxss
   * @param  {String}  html 转义的字符串
   * @param  {Boolean} wrap 是否反转义换行
   * @return {String}       反转义后的字符串
   */
  unxss: (html = '', wrap = true) => {
    let _html = String(html)
      .replace(/&apos;/g, "'")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
    if (wrap) {
      _html = _html.replace(/<br\/>/g, '\n'); // 只替换 noxss 转义过的
    }
    return _html;
  },
  /**
   * 终端日志数据
   * @type {Array}
   */
  logs: [],
  /**
   * 自定义编码器
   * @type {Object}
   */
  encoders: {},
  /**
   * 自定义解码器
   * @type {Object}
   */
  decoders: {},
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
   * 模块
   */
  module: {},
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
    if (typeof (value) === "object")
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
    fs
      .readdirSync(pluginHome)
      .map((_) => {
        let pluginPath = path.join(pluginHome, _);
        // 如果不是目录，则跳过
        if (!fs.lstatSync(pluginPath).isDirectory()) {
          return
        }
        // 存储路径&&package信息到全局变量antSword['plugins']
        antSword['plugins'][_] = {
          _id: _,
          path: pluginPath,
          info: JSON.parse(fs.readFileSync(path.join(pluginPath, 'package.json')))
        }
      });
    // 加载插件：：开发
    let devPlugPath = antSword.storage('dev-plugPath');
    if (antSword.storage('isDev') === '1' && fs.existsSync(devPlugPath) && fs.lstatSync(devPlugPath).isDirectory()) {
      fs
        .readdirSync(devPlugPath)
        .map((_) => {
          let _path = path.join(devPlugPath, _);
          // 如果不是目录，则跳过
          if (!fs.lstatSync(_path).isDirectory()) {
            return
          }
          antSword['plugins'][_] = {
            _id: _,
            path: _path,
            info: JSON.parse(fs.readFileSync(path.join(_path, 'package.json')))
          }
        });
    }
    // 加载工具栏
    antSword.modules.shellmanager.toolbar.reloadToolbar()
  }
};

// 加载核心模板
antSword['core'] = require('./core/');

// 加载语言模板
antSword['language'] = require('./language/');

// 加载编码
antSword['encoders'] = (function () {
  var encoders = {
    asp: [],
    aspx: [],
    php: [],
    custom: []
  };
  var encoders_path = {
    asp: [],
    aspx: [],
    php: [],
    custom: []
  };
  let userencoder_path = path.join(remote.process.env.AS_WORKDIR, 'antData/encoders');
  // 初始化
  !fs.existsSync(userencoder_path) ?
    fs.mkdirSync(userencoder_path) :
    null;
  ['asp', 'aspx', 'php', 'custom'].map((t) => {
    !fs.existsSync(path.join(userencoder_path, `${t}`)) ?
      fs.mkdirSync(path.join(userencoder_path, `${t}`)) :
      null;
    let t_path = path.join(userencoder_path, `${t}/encoder/`);
    !fs.existsSync(t_path) ?
      fs.mkdirSync(t_path) :
      null;

    let es = fs.readdirSync(t_path);
    if (es) {
      es.map((_) => {
        if (!_.endsWith(".js")) {
          return
        }
        encoders[t].push(_.slice(0, -3));
        encoders_path[t].push(path.join(t_path, _.slice(0, -3)));
      });
    }
    antSword["core"][t].prototype.user_encoders = encoders_path[t];
  });

  // // custom let es = fs.readdirSync(userencoder_path); if(es){   es.map((_)=>{
  //    console.log(_);     let farr = _.split("#");
  // encoders[farr[0]].push(farr[1].slice(0,-3));   }); } default
  // ['asp','aspx','php','custom'].map((t)=>{
  // antSword["core"][t].prototype.encoders.map((e)=>{     encoders[t].push(e);
  // });   encoders[t] = encoders[t].unique(); });
  // fs.readdirSync(path.join(process.env.AS_WORKDIR,'encoder'),(err,f) => {
  // if(err || !f) return ;   console.debug(f);   let farr = f.split("#");
  // encoders[farr[0]].push(farr[1]); });
  return encoders;
})();

// 加载解码器
antSword['decoders'] = (function () {
  var decoders = {
    asp: [],
    aspx: [],
    php: [],
    custom: []
  };
  var decoders_path = {
    asp: [],
    aspx: [],
    php: [],
    custom: []
  };
  let userdecoder_path = path.join(remote.process.env.AS_WORKDIR, 'antData/encoders');
  // 初始化
  !fs.existsSync(userdecoder_path) ?
    fs.mkdirSync(userdecoder_path) :
    null;
  ['asp', 'aspx', 'php', 'custom'].map((t) => {
    !fs.existsSync(path.join(userdecoder_path, `${t}`)) ?
      fs.mkdirSync(path.join(userdecoder_path, `${t}`)) :
      null;
    let t_path = path.join(userdecoder_path, `${t}/decoder/`);
    !fs.existsSync(t_path) ?
      fs.mkdirSync(t_path) :
      null;

    let es = fs.readdirSync(t_path);
    if (es) {
      es.map((_) => {
        if (!_.endsWith(".js")) {
          return
        }
        decoders[t].push(_.slice(0, -3));
        decoders_path[t].push(path.join(t_path, _.slice(0, -3)));
      });
    }
    antSword["core"][t].prototype.user_decoders = decoders_path[t];
  });

  // // custom let es = fs.readdirSync(userdecoder_path); if(es){   es.map((_)=>{
  //    console.log(_);     let farr = _.split("#");
  // encoders[farr[0]].push(farr[1].slice(0,-3));   }); } default
  // ['asp','aspx','php','custom'].map((t)=>{
  // antSword["core"][t].prototype.encoders.map((e)=>{     encoders[t].push(e);
  // });   encoders[t] = encoders[t].unique(); });
  // fs.readdirSync(path.join(process.env.AS_WORKDIR,'encoder'),(err,f) => {
  // if(err || !f) return ;   console.debug(f);   let farr = f.split("#");
  // encoders[farr[0]].push(farr[1]); });
  return decoders;
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

antSword['aproxyauth'] = (!aproxy['username'] || !aproxy['password']) ?
  '' :
  `${aproxy['username']}:${aproxy['password']}`;

antSword['aproxyuri'] = `${aproxy['protocol']}:\/\/${antSword['aproxyauth']}${antSword['aproxyauth'] === ""
  ? ""
  : "@"}${aproxy['server']}:${aproxy['port']}`;

// 通知后端设置代理
ipcRenderer.send('aproxy', {
  aproxymode: antSword['aproxymode'],
  aproxyuri: antSword['aproxyuri']
});

antSword['shell'] = shell;
antSword['remote'] = remote;
antSword['ipcRenderer'] = ipcRenderer;
antSword['CacheManager'] = CacheManager;
antSword['Decodes'] = new Decodes();
antSword['menubar'] = new Menubar();
antSword['RANDOMWORDS'] = require('./base/words');
antSword['utils'] = require('./base/utils');
antSword['package'] = require('../package');

// 加载模块列表
antSword['tabbar'] = new dhtmlXTabBar(document.body);
['shellmanager', 'settings', 'plugin'].map((_) => {
  let _module = require(`./modules/${_}/`);
  antSword['modules'][_] = new _module();
});

['shellmanager', 'settings', 'plugin', 'database', 'terminal', 'viewsite', 'filemanager'].map((_) => {
  antSword['module'][_] = require(`./modules/${_}/`);
})

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
  console.log(`%c0x${lineNum < 10
    ? '0' + lineNum
    : lineNum}\t${opt[0].substr(0, 100) + (opt[0].length > 100
      ? '..'
      : '')}`, `color:${color}`);
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
      antSword
        .modules
        .shellmanager
        .category
        .cell
        .setWidth(222);
    }, 555);
  })
  /**
   * 通知提示 Loader 更新
   * @param  {[type]} 'notification-loader-update' [description]
   * @param  {[type]} (e,                   opt           [description]
   * @return {[type]}                       [description]
   */
  .on('notification-loader-update', (e, opt) => {
    const LANG = antSword["language"]["settings"]["update"];
    let n = new Notification(antSword['language']['update']['title'], {
      body: antSword['language']['update']['body'](opt['ver'])
    });
    n.addEventListener('click', () => {
      antSword
        .shell
        .openExternal(opt['url']);
    });
    layer.confirm(LANG['prompt']['loader_body'](opt['ver']), {
      icon: 3,
      shift: 6,
      title: LANG['prompt']['title']
    }, (_) => {
      antSword
        .shell
        .openExternal(opt['url']);
      antSword
        .remote
        .app
        .quit();
    });
  })
  /**
   * 通知提示更新
   * @param  {[type]} 'notification-update' [description]
   * @param  {[type]} (e,                   opt           [description]
   * @return {[type]}                       [description]
   */
  .on('notification-update', (e, opt) => {
    const LANG = antSword["language"]["settings"]["update"];
    let n = new Notification(antSword['language']['update']['title'], {
      body: antSword['language']['update']['body'](opt['ver'])
    });
    // 文件大小计算
    const getFileSize = (t) => {
      let i = false;
      let b = [
        "b",
        "Kb",
        "Mb",
        "Gb",
        "Tb",
        "Pb",
        "Eb"
      ];
      for (let q = 0; q < b.length; q++)
        if (t > 1024)
          t = t / 1024;
        else if (i === false)
        i = q;
      if (i === false)
        i = b.length - 1;
      return Math.round(t * 100) / 100 + " " + b[i];
    }
    n.addEventListener('click', () => {
      antSword
        .shell
        .openExternal(opt['url']);
    });
    const WIN = require('ui/window');
    let win = new WIN({
      title: antSword['language']['update']['title'],
      height: 430,
      width: 480
    });
    win
      .win
      .setIconCss("update-winicon");
    win
      .win
      .button("minmax")
      .hide();
    win
      .win
      .denyResize();
    let uplayout = win
      .win
      .attachLayout('1C');
    uplayout
      .cells('a')
      .hideHeader();

    let formdata = [{
      type: "label",
      name: "form_msg",
      label: LANG["prompt"]["body"](opt['ver']),
      offsetLeft: 5
    }, {
      type: "container",
      name: "form_body",
      label: "",
      inputWidth: 450,
      inputHeight: 300
    }, {
      type: "block",
      list: [{
        type: "newcolumn",
        offset: 20
      }, {
        type: "button",
        name: "updatebtn",
        value: `<i class="fa fa-cloud-download"></i> ${LANG["prompt"]["btns"]["ok"]}`,
        className: "background-color: #39c;"
      }, {
        type: "newcolumn",
        offset: 20
      }, {
        type: "button",
        name: "changelogbtn",
        value: `<i class="fa fa-chrome"></i> ${LANG["prompt"]["btns"]["changelog"]}`
      }, {
        type: "newcolumn",
        offset: 20
      }, {
        type: "button",
        name: "canclebtn",
        value: `<i class="fa fa-remove"></i> ${LANG["prompt"]["btns"]["no"]}`
      }]
    }];
    uplayout
      .cells('a')
      .attachForm(formdata, true);
    win
      .win
      .attachEvent('onParkUp', () => {
        if (win.win.isParked()) {
          win
            .win
            .wins
            ._winSetSize(win.win._idd, 240, (win.win.wins.w[win.win._idd].hdr.offsetHeight + win.win.wins.conf.ofs_h), false, true);
        }
        win
          .win
          .setPosition(document.body.clientWidth - 300, document.body.clientHeight - 150);
        return true;
      });
    win
      .win
      .attachEvent('onParkDown', () => {
        win
          .win
          .setDimension(478, 428);
        win
          .win
          .centerOnScreen();
        return true;
      });
    const form = uplayout
      .cells('a')
      .attachForm(formdata, true);
    let form_body = new dhtmlXLayoutObject(form.getContainer('form_body'), '1C');
    form_body
      .cells('a')
      .hideHeader();
    const marked = require('marked');
    let _html = `<html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
      zoom:80%;
    }
    img {
      width:100%;
    }
    </style>
    </head>
    <body>
      ${marked(opt['body']).replace(/<a.+?(href=".+?")/g, "<a")}
    </body>
    </html>`;
    form_body
      .cells('a')
      .attachHTMLString(`<iframe sandbox="" src="data:text/html;base64,${Buffer.from(_html).toString('base64')}" style="width:100%;height:100%;border:0;padding:0;margin:0;"></iframe>`);
    form.attachEvent("onButtonClick", (name) => {
      switch (name) {
        case "updatebtn":
          var workdir = antSword.remote.process.env.AS_WORKDIR;
          if (fs.existsSync(path.join(workdir, ".git/"))) {
            win.close();
            layer.alert(LANG["message"]["githint"](workdir));
            return
          }
          const hash = (String(+new Date) + String(Math.random()))
            .substr(10, 10)
            .replace('.', '_');
          //折叠
          win
            .win
            .park();
          antSword
            .ipcRenderer
            .send("update-download", {
              hash: hash
            });
          win
            .win
            .progressOn();
          win.setTitle(LANG["message"]["prepare"]);
          antSword['ipcRenderer'].on(`update-dlprogress-${hash}`, (event, progress, isprogress) => {
            if (isprogress == true) {
              win.setTitle(LANG["message"]["dling"](progress));
            } else {
              win.setTitle(LANG["message"]["dlingnp"](getFileSize(progress)));
            }
          }).once(`update-dlend-${hash}`, (event) => {
            win.setTitle(LANG["message"]["dlend"]);
            win
              .win
              .progressOff();
            toastr.success(antSword["language"]["success"], LANG["message"]["extract"]);
          }).once(`update-error-${hash}`, (event, err) => {
            win
              .win
              .progressOff();
            win.close();
            toastr.error(antSword["language"]['error'], LANG["message"]["fail"](err));
          });
          break;
        case "canclebtn":
          win.close();
          break;
        case "changelogbtn":
          antSword
            .shell
            .openExternal(opt['url']);
          break;
      }
    });
  }).on('update-success', (e, opt) => {
    const LANG = antSword['language']['settings']['update'];
    toastr.success(antSword["language"]["success"], LANG["message"]["success"]);
    layer.confirm(LANG['message']['success'], {
      icon: 1,
      shift: 6,
      title: LANG['prompt']['title']
    }, (_) => {
      // location.reload();
      antSword
        .remote
        .app
        .quit();
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
  }).on('logger-info', (e, opt) => {
    groupLog(opt, '#4CAF50');
  }).on('logger-warn', (e, opt) => {
    groupLog(opt, '#FF9800');
  }).on('logger-fatal', (e, opt) => {
    groupLog(opt, '#E91E63');
  });

antSword.reloadPlug();
antSword['menubar'].reg('check-update', () => {
  antSword
    .ipcRenderer
    .send('check-update');
  antSword
    .ipcRenderer
    .send('check-loader-update');
});

if (new Date() - new Date(parseInt(antSword['storage']('lastautocheck', false, "0"))) >= 86400000) {
  // 检查更新
  antSword['storage']('lastautocheck', new Date().getTime());
  setTimeout(() => {
    antSword.ipcRenderer.send.bind(antSword.ipcRenderer, 'check-update');
    antSword.ipcRenderer.send.bind(antSword.ipcRenderer, 'check-loader-update');
  }, 1000 * 60);
}