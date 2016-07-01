/**
 * 左侧数据列表模块
 */

const Grid = require('./grid');
// const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['shellmanager']['list'];

class List {
  /**
   * 初始化函数
   * @param  {Object} cell dhtmlx cell-object
   * @param  {Object} top  shell-manager obj
   * @return {[type]}      [description]
   */
  constructor(cell, top) {
    // 删除折叠按钮
    document.getElementsByClassName('dhxlayout_arrow dhxlayout_arrow_va')[0].remove();
    this.cell = cell;
    this.grid = new Grid(cell, this);

    this.updateHeader();
  }

  /**
   * 更新标题
   * @param  {number} num 数据总数
   * @return {[type]}     [description]
   */
  updateHeader(num = 0) {
    this.cell.setText(`<i class="fa fa-list-ul"></i> ${LANG['title']} (${num})`);
  }
}

module.exports = List;
