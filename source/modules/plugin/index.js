/**
 * 插件中心
 * 开写：2016/05/09
 * 更新：－
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

const path = global.require('path');

class Plugin {
  constructor() {
    // 注册菜单事件
    antSword['menubar'].reg(
      'plugin-store',
      this.initWin.bind(this, 'ant-views://plugin.html')
    );
    this.win = null;
  }

  /**
   * 初始化新窗口
   * @param  {String} url 要加载的URL
   * @return {Object}     BrowserWindow窗口对象
   */
  initWin(url) {
    if (this.win) {
      return this.win.focus();
    }
    let win = new antSword['remote'].BrowserWindow({
      width: 930,
      height: 666,
      minWidth: 888,
      minHeight: 555,
      show: false,
      title: 'AntSword.Store'
    });
    win.on('close', () => {
      this.win = win = null;
    });
    win.loadURL(url);
    win.show();
    // win.openDevTools();
    this.win = win;
  }


}

module.exports = Plugin;
