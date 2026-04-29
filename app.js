/**
 * 中国蚁剑::主程序入口
 * 更新：2016/05/02
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

const path = require('path');
const electron = require('electron');
const {
  app,
  shell,
  protocol,
  BrowserWindow
} = require('electron');

// 注册为标准 scheme, 默认情况下web storage apis (localStorage, sessionStorage, webSQL,
// indexedDB, cookies) 被禁止访问非标准schemes
protocol.registerStandardSchemes(['ant-views', 'ant-static', 'ant-src']);

app.once('ready', () => {
  /**
   * 注册静态资源protocol
   * - 可通过注册的协议访问资源文件，如ant-static://libs/jquery.jquery.js
   */
  [
    [
      'static', '/static/', 13
    ],
    [
      'views', '/views/', 12
    ], //- 通过访问访问ant-views来访问views 文件
    ['src', '/source/', 10] //- 通过访问访问ant-src来访问source 文件
  ].map((_) => {
    protocol.registerFileProtocol(`ant-${_[0]}`, (req, cb) => {
      if (req.url.endsWith('/')) {
        req.url = req
          .url
          .substr(0, req.url.length - 1);
      }
      cb({
        path: path.normalize(path.join(__dirname, _[1], req.url.substr(_[2])))
      });
    });
  });

  // 初始化窗口
  let mainWindow = new BrowserWindow({
    width: 1040,
    height: 699,
    minWidth: 888,
    minHeight: 555,
    title: 'AntSword',
    webPreferences: {
      webgl: false,
      javascript: true,
      nodeIntegration: true, // 开启 nodejs 支持
      // contextIsolation: false, // 关闭上下文隔离 webSecurity: false,
      // allowRunningInsecureContent: true, sandbox: false,
    }
  });

  // 加载views
  mainWindow.loadURL('ant-views://front/index.html');
  // 调整部分UI
  const reloadUI = mainWindow
    .webContents
    .send
    .bind(mainWindow.webContents, 'reloadui', true);

  // 窗口事件监听
  mainWindow.on('close', (event) => {
      event.preventDefault();
      // app.exit(0);
      if (process.platform == 'darwin') {
        // app.hide();
        app.exit(0);
      } else if (process.platform == 'linux') { app.exit(0);
        return;
      } else {
        mainWindow.hide();
      }
    }).on('minimize', (event) => {
      event.preventDefault();
    })
    .on('resize', reloadUI)
    .on('maximize', reloadUI)
    .on('unmaximize', reloadUI)
    .on('enter-full-screen', reloadUI)
    .on('leave-full-screen', reloadUI);

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
  // 打开调试控制台 mainWindow.webContents.openDevTools();

  electron.Logger = require('./modules/logger')(mainWindow);
  // 初始化模块
  [
    'menubar',
    'request',
    'database',
    'cache',
    'update',
    'plugStore'
  ].map((_) => {
    new(require(`./modules/${_}`))(electron, app, mainWindow);
  });
});