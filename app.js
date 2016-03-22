'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// 导入模块
const Menubar = require('./modules/menubar');
const Request = require('./modules/request');
const Database = require('./modules/database');
const Cache = require('./modules/cache');

// electron.crashReporter.start();

app
  .on('window-all-closed', app.quit)
  .on('ready', () => {
    let mainWindow = new BrowserWindow({
      width: 1040,
      height: 699,
      minWidth: 1040,
      minHeight: 699,
      webgl: false,
      title: 'AntSword',
      // autoHideMenuBar: true,
      // transparent: false,
      // frame: false
      // resizable: false
    });
    mainWindow.loadURL(`file:\/\/${__dirname}/views/index.html`);

    // 调整部分UI
    const reloadUI = () => {
      mainWindow.webContents.executeJavaScript(`
        setTimeout(() => {
          antSword.modules.shellmanager.category.cell.setWidth(222);
        }, 500);
      `);
    }
    mainWindow
      .on('closed', () => { mainWindow = null })
      .on('resize', reloadUI)
      .on('maximize', reloadUI)
      .on('unmaximize', reloadUI)
      .on('enter-full-screen', reloadUI)
      .on('leave-full-screen', reloadUI);

    // 打开调试控制台
    // mainWindow.webContents.openDevTools();

    new Menubar(electron, app, mainWindow);

    // 监听Request请求
    new Request(electron);

    // 初始化数据库
    new Database(electron);

    // 初始化缓存模块
    new Cache(electron);

  });