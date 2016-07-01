/**
 * Shell数据管理模块
 * 重构：2016/06/20
 */

const Data = require('./data');
const List = require('./list/');
const Category = require('./category/');

class ShellManager {
  constructor() {
    const tabbar = antSword['tabbar'];
    tabbar.addTab(
      'tab_shellmanager',
      '<i class="fa fa-th-large"></i>',
      null, null, true, false
    );
    const cell = tabbar.cells('tab_shellmanager');
    const layout = cell.attachLayout('2U');
    // 初始化左侧栏：数据
    this.list = new List(layout.cells('a'), this);
    // 初始化右侧栏：目录
    this.category = new Category(layout.cells('b'), this);

    this.reloadData();
  }

  /**
   * 重新加载shell数据
   * @param  {object} arg = {} 查询参数
   * @return {[type]}     [description]
   */
  reloadData(arg = {}) {
    const _data = Data.get(arg);
    // 刷新UI::数据
    this.list.grid.clearAll();
    this.list.grid.parse({
      'rows': _data['data']
    }, 'json');
    // 刷新UI::分类
    for (let _ in _data['category']) {
      // 目录存在，则更新bubble
      if (!!this.category['sidebar'].items(_)) {
        this.category['sidebar'].items(_).setBubble(_data['category'][_]);
        continue;
      }
      // 目录不存在，则添加
      this.category['sidebar'].addItem({
        id: _,
        bubble: _data['category'][_],
        text: `<i class="fa fa-folder-o"></i> ${_}`
      });
    }
    // 加载分类数据
    this.category.sidebar.items(
      arg['category'] || 'default'
    ).setActive(true);
    // 更新标题
    this.category.updateHeader();
    this.list.updateHeader(_data['data'].length);
  }
}

module.exports = ShellManager;
