/**
 * UI::tabbar
 * - 创建一个面板
 * 开写：2016/05/03
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

class Tabbar {
  constructor(opts) {
    // 生成一个随机ID，用于指定唯一的面板
    let id = 'tabbar_' + (Math.random() * +new Date).toString(16).replace('.', '').substr(0,11);
    let tabbar = antSword['tabbar'];
    // 添加面板对象
    tabbar.addTab(
      id,
      '<i class="fa fa-puzzle-piece"></i>',
      null, null, true, true
    );
    this.cell = tabbar.tabs(id);
  }

  /**
   * 面板获取焦点
   * @return {[type]} [description]
   * @return {Object}           this
   */
  active() {
    this.cell.setActive();
    return this;
  }

  /**
   * 关闭面板
   * @return {Object} this
   */
  close() {
    this.cell.close();
    return this;
  }

  /**
   * 设置面板标题
   * @param {String} title = 'New Title' [description]
   * @return {Object}           this
   */
  setTitle(title = 'New Title') {
    this.cell.setText(`<i class="fa fa-puzzle-piece"></i> ${title}`);
    return this;
  }

  /**
   * 安全输出HTML
   * - 采用`iframe`框架进行HTML输出，避免变量污染&&一些安全问题
   * @param  {String} html = "" [description]
   * @return {Object}           this
   */
  safeHTML(html = "") {
    let _html = new Buffer(html).toString('base64');
    let _iframe = `
      <iframe
        src="data:text/html;base64,${_html}"
        style="width:100%;height:100%;border:0;padding:0;margin:0;">
      </iframe>
    `;
    this.cell.attachHTMLString(_iframe);
    return this;
  }

  /**
   * 显示加载中
   * @param  {Boolean} loading = true 是否显示/false=隐藏
   * @return {Object}           this
   */
  showLoading(loading = true) {
    this.cell[loading ? 'progressOn' : 'progressOff']();
    return this;
  }
}

module.exports = Tabbar;
