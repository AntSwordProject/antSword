/**
 * UI::Window
 * - 弹窗窗口
 * 开写：2016/05/03
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

class Window {
  /**
   * 初始化一个窗口对象
   * @param  {Object} opts 窗口设置（title,width,height
   * @return {[type]}      [description]
   */
  constructor(opts) {
    // 生成一个随机ID，用于指定唯一的窗口
    let id = 'win_' + (Math.random() * +new Date).toString(16).replace('.', '').substr(0,11);
    // 默认配置
    let opt = $.extend({
      title: id,
      width: 500,
      height: 400,
      // 在那个dom内显示
      view: document.body
    }, opts);

    // 创建窗口
    let winObj = new dhtmlXWindows();
    winObj.attachViewportTo(opt['view']);

    let win = winObj.createWindow(
      id, 0, 0,
      opt['width'], opt['height']
    );
    win.setText(opt['title']);
    win.centerOnScreen();
    win.button('minmax').show();
    win.button('minmax').enable();

    this.win = win;
  }

  /**
   * 关闭窗口
   * @return {[type]} [description]
   */
  close() {
    this.win.close();
  }

  /**
   * 设置标题
   * @param {String} title = 'New Title' 新标题
   */
  setTitle(title = 'New Title') {
    this.win.setText(title);
  }
}

module.exports = Window;
