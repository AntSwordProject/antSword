/**
 * shellmanager::category
 */

const LANG = antSword['language']['shellmanager']['category'];
const Toolbar = require('./toolbar');
const Sidebar = require('./sidebar');

class Category {
  /**
   * 初始化函数
   * @param  {Object} cell dhtmlx.cell对象
   * @param  {Object} top  顶层对象
   * @return {[type]}      [description]
   */
  constructor(cell, top) {
    this.top = top;
    // 设置cell样式
    cell.setWidth(222);
    cell.fixSize(1, 0);

    this.cell = cell;
    this.toolbar = new Toolbar(cell, this);
    this.sidebar = new Sidebar(cell, this);

    this.updateHeader();
  }

  /**
   * 更新标题
   * @return {[type]}     [description]
   */
  updateHeader() {
    const num = this.sidebar.getAllItems().length;
    this.cell.setText(`<i class="fa fa-folder"></i> ${LANG['title']} (${num})`);
  }
}

module.exports = Category;
