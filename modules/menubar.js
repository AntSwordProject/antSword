/**
 * 菜单栏模块
 */

'use strict';

class Menubar {

  constructor(electron, app, mainWindow) {

    const Menu = electron.Menu;

    // 清空菜单栏
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    // 监听重载菜单事件
    electron.ipcMain
      .on('quit', app.quit.bind(app))
      .on('menubar', this.reload.bind(this));

    this.electron = electron;
    this.app = app;
    this.Menu = Menu;
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
    const template = [
      {
        // 主菜单
        label: LANG['main']['title'],
        submenu: [
          {
            label: LANG['main']['about'],
            accelerator: 'Shift+CmdOrCtrl+I',
            click: event.sender.send.bind(event.sender, 'menubar', 'settings-about')
          }, {
            label: LANG['main']['language'],
            accelerator: 'Shift+CmdOrCtrl+L',
            click: event.sender.send.bind(event.sender, 'menubar', 'settings-language')
          }, {
            label: LANG['main']['aproxy'],
            accelerator: 'Shift+CmdOrCtrl+A',
            click: event.sender.send.bind(event.sender, 'menubar', 'settings-aproxy')
          }, {
            type: 'separator'
          }, {
            label: LANG['main']['settings'],
            accelerator: 'Shift+CmdOrCtrl+S',
            click: event.sender.send.bind(event.sender, 'menubar', 'settings')
          }, {
            type: 'separator'
          }, {
            label: LANG['main']['pluginStore'],
            accelerator: 'Shift+CmdOrCtrl+P',
            click: event.sender.send.bind(event.sender, 'menubar', 'plugin-store')
          }, {
            type: 'separator'
          }, {
            label: LANG['main']['quit'],
            accelerator: 'Command+Q',
            click: this.app.quit.bind(this.app)
          },
        ]
      }, {
        // 编辑
        label: LANG['edit']['title'],
        submenu: [
          {
            label: LANG['edit']['undo'], accelerator: 'CmdOrCtrl+Z', role: 'undo'
          }, {
            label: LANG['edit']['redo'], accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'
          }, {
            type: 'separator'
          }, {
            label: LANG['edit']['cut'], accelerator: 'CmdOrCtrl+X', role: 'cut'
          }, {
            label: LANG['edit']['copy'], accelerator: 'CmdOrCtrl+C', role: 'copy'
          }, {
            label: LANG['edit']['paste'], accelerator: 'CmdOrCtrl+V', role: 'paste'
          }, {
            type: 'separator'
          }, {
            label: LANG['edit']['selectall'], accelerator: 'CmdOrCtrl+A', role: 'selectall'
          }
        ]
      }, {
        // 窗口
        label: LANG['window']['title'],
        submenu: [
          {
            label: LANG['window']['next'], accelerator: 'Shift+CmdOrCtrl+Right',
            click: event.sender.send.bind(event.sender, 'menubar', 'tabbar-next')
          }, {
            label: LANG['window']['prev'], accelerator: 'Shift+CmdOrCtrl+Left',
            click: event.sender.send.bind(event.sender, 'menubar', 'tabbar-prev')
          }, {
            type: 'separator'
          }, {
            label: LANG['window']['close'], accelerator: 'Shift+CmdOrCtrl+W',
            click: event.sender.send.bind(event.sender, 'menubar', 'tabbar-close')
          }
        ]
      }, {
        // 调试
        label: LANG['debug']['title'],
        submenu: [
          {
            label: LANG['debug']['restart'],
            accelerator: 'Shift+CmdOrCtrl+R',
            click: () => {
              // 在有多个窗口的时候，不刷新
              if (this.electron.BrowserWindow.getAllWindows().length > 1) {
                return;
              }
              this.mainWindow.webContents.reload();//.bind(this.mainWindow.webContents)
            }
          }, {
            label: LANG['debug']['devtools'],
            accelerator: 'Alt+CmdOrCtrl+J',
            click: this.mainWindow.webContents.toggleDevTools.bind(this.mainWindow.webContents)
          }
        ]
      }
    ];
    // 更新菜单栏
    this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(template));
  }

}

module.exports = Menubar;
