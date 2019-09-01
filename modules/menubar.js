/**
 * 菜单栏模块
 */

'use strict';

class Menubar {

  constructor(electron, app, mainWindow) {

    const Menu = electron.Menu;
    const Tray = electron.Tray;
    const nativeImage = electron.nativeImage;
    const path = require('path');

    // 清空菜单栏
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    // 监听重载菜单事件
    electron
      .ipcMain
      .on('quit', app.quit.bind(app))
      .on('menubar', this.reload.bind(this));

    this.electron = electron;
    this.app = app;
    this.Menu = Menu;
    this.Tray = Tray;
    this.nativeImage = nativeImage;
    this.path = path;
    this.trayIcon = null;
    this.mainWindow = mainWindow;
  }

  /**
   * 重新载入菜单
   * @param  {Object} event ipcMain对象
   * @param  {Object} LANG  语言模板
   * @return {[type]}       [description]
   */
  reload(event, LANG) {
    // 菜单模板
    const template = [{
      // 主菜单
      label: LANG['main']['title'],
      submenu: [{
        label: LANG['main']['about'],
        accelerator: 'Shift+CmdOrCtrl+I',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings-about')
      }, {
        label: LANG['main']['language'],
        accelerator: 'Shift+CmdOrCtrl+L',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings-language')
      }, {
        label: LANG['main']['aproxy'],
        accelerator: 'Shift+CmdOrCtrl+A',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings-aproxy')
      }, {
        label: LANG['main']['display'],
        accelerator: 'Shift+CmdOrCtrl+D',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings-display')
      }, {
        type: 'separator'
      }, {
        label: LANG['main']['encoders'],
        accelerator: 'Shift+CmdOrCtrl+E',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings-encoders')
      }, {
        type: 'separator'
      }, {
        label: LANG['main']['settings'],
        accelerator: 'Shift+CmdOrCtrl+S',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'settings')
      }, {
        type: 'separator'
      }, {
        label: LANG['main']['pluginStore'],
        accelerator: 'Shift+CmdOrCtrl+P',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'plugin-store')
      }, {
        type: 'separator'
      }, {
        label: LANG['main']['update'],
        accelerator: 'Shift+CmdOrCtrl+U',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'check-update')
      }, {
        type: 'separator'
      }, {
        label: LANG['main']['quit'],
        accelerator: 'Command+Q',
        click: this
          .app
          .quit
          .bind(this.app)
      }]
    }, {
      // 编辑
      label: LANG['edit']['title'],
      submenu: [{
        label: LANG['edit']['undo'],
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: LANG['edit']['redo'],
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: LANG['edit']['cut'],
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: LANG['edit']['copy'],
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: LANG['edit']['paste'],
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        type: 'separator'
      }, {
        label: LANG['edit']['search'],
        accelerator: 'Shift+CmdOrCtrl+F',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'shellmanager-search')
      }, {
        type: 'separator'
      }, {
        label: LANG['edit']['selectall'],
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }]
    }, {
      // 窗口
      label: LANG['window']['title'],
      submenu: [{
        label: LANG['window']['next'],
        accelerator: 'Shift+CmdOrCtrl+Right',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'tabbar-next')
      }, {
        label: LANG['window']['prev'],
        accelerator: 'Shift+CmdOrCtrl+Left',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'tabbar-prev')
      }, {
        type: 'separator'
      }, {
        label: LANG['window']['close'],
        accelerator: 'Shift+CmdOrCtrl+W',
        click: event
          .sender
          .send
          .bind(event.sender, 'menubar', 'tabbar-close')
      }]
    }, {
      // 调试
      label: LANG['debug']['title'],
      submenu: [{
        label: LANG['debug']['restart'],
        accelerator: 'Shift+CmdOrCtrl+R',
        click: () => {
          // 在有多个窗口的时候，不刷新
          if (this.electron.BrowserWindow.getAllWindows().length > 1) {
            return;
          }
          this
            .mainWindow
            .webContents
            .loadURL('ant-views://front/index.html'); //.bind(this.mainWindow.webContents)
        }
      }, {
        label: LANG['debug']['devtools'],
        accelerator: 'Alt+CmdOrCtrl+J',
        click: this
          .mainWindow
          .webContents
          .toggleDevTools
          .bind(this.mainWindow.webContents)
      }]
    }];
    // 更新菜单栏
    this
      .Menu
      .setApplicationMenu(this.Menu.buildFromTemplate(template));
    if (this.trayIcon) {
      this
        .trayIcon
        .setContextMenu(this.Menu.buildFromTemplate([]));
    } else {
      let image;
      if (process.platform === 'darwin' || process.platform === 'linux') {
        image = this
          .nativeImage
          .createFromPath(this.path.join(__dirname, '../static/imgs/tray-icon-mac-2.png'));
      } else {
        // windows下的Tray图标
        image = this
          .nativeImage
          .createFromPath(this.path.join(__dirname, '../static/imgs/tray-icon-win-colorful.ico'));
      }
      image.setTemplateImage(true);
      this.trayIcon = new this.Tray(image);
    }
    var trayMenuTemplate = [{
      label: LANG['tray']['show'],
      click: () => {
        this
          .mainWindow
          .show();
      }
    }, {
      label: LANG['tray']['hide'],
      click: () => {
        if (process.platform == 'darwin') {
          this
            .app
            .hide();
        } else {
          this
            .mainWindow
            .hide();
        }
      }
    }, {
      label: LANG['tray']['settings'],
      click: event
        .sender
        .send
        .bind(event.sender, 'menubar', 'settings')
    }, {
      label: LANG['debug']['restart'],
      click: () => {
        // 在有多个窗口的时候，不刷新
        if (this.electron.BrowserWindow.getAllWindows().length > 1) {
          return;
        }
        this
          .mainWindow
          .webContents
          .loadURL('ant-views://front/index.html');
      }
    }, {
      label: LANG['tray']['about'],
      click: event
        .sender
        .send
        .bind(event.sender, 'menubar', 'settings-about')
    }, {
      type: 'separator'
    }, {
      label: LANG['tray']['quit'],
      click: this
        .app
        .quit
        .bind(this.app)
    }];

    this
      .trayIcon
      .on('double-click', () => {
        if (process.platform == 'darwin' || process.platform == 'linux')
          return;
        if (this.mainWindow.isVisible()) {
          this
            .mainWindow
            .hide();
        } else {
          this
            .mainWindow
            .show();
        }
      });

    this
      .trayIcon
      .setToolTip(LANG['tray']['tip']);

    this
      .trayIcon
      .setContextMenu(this.Menu.buildFromTemplate(trayMenuTemplate));

  }

}

module.exports = Menubar;