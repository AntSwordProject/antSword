/**
 * 分类侧边栏
 */

const LANG = antSword['language']['shellmanager']['category'];

class Sidebar {
  /**
   * 初始化函数
   * @param  {object} cell dhtmlx.cell对象
   * @param  {object} top  父层category对象
   * @return {[type]}      [description]
   */
  constructor(cell, top) {
    this.top = top;
    const sidebar = cell.attachSidebar({
      template: 'text',
      width: 222
    });
    // 默认分类
    sidebar.addItem({
      id: 'default',
      bubble: 0,
      // selected: true,
      text: `<i class="fa fa-folder-o"></i> ${LANG['default']}</i>`
    });
    // sidebar点击事件
    sidebar.attachEvent('onSelect', this._onSelect.bind(this));

    return sidebar;
  }

  /**
   * 点击事件
   * @param  {number} id [description]
   * @return {[type]}    [description]
   */
  _onSelect(id) {
    // 更新工具栏按钮状态
    ['del', 'rename'].map((_) => {
      this.top.toolbar[
        id === 'default' ? 'disableItem' : 'enableItem'
      ](_)
    });
    // 重新加载数据
    this.top.top.reloadData({
      category: id
    });
  }
}

module.exports = Sidebar;
