/**
 * 数据表格模块
 */


const FileManager = require('../../filemanager/');
const LANG = antSword['language']['shellmanager']['list']['grid'];
const ContextMenu = require('./contextmenu');

class Grid {
  /**
   * 初始化函数
   * @param  {object} cell dhtmlx.cell对象
   * @param  {object} top  父层list对象
   * @return {[type]}      [description]
   */
  constructor(cell, top) {
    // 初始化grid
    const grid = cell.attachGrid();
    // 设置grid头
    grid.setHeader(`
      ${LANG['url']},
      ${LANG['ip']},
      ${LANG['addr']},
      ${LANG['ctime']},
      ${LANG['utime']}
    `);
    grid.setColTypes("ro,ro,ro,ro,ro");
    grid.setColSorting('str,str,str,str,str');
    grid.setInitWidths("200,120,*,140,140");
    grid.setColAlign("left,left,left,center,center");
    grid.enableMultiselect(true);

    // 隐藏右键菜单
    grid.attachEvent('onRowSelect', bmenu.hide);
    $('.objbox')
      .on('click', bmenu.hide)
      .on('contextmenu', (e) => {
        if (e.target.nodeName === 'DIV' && grid.callEvent instanceof Function) {
          grid.callEvent('onRightClick', [grid.getSelectedRowId(), '', e]);
        }
      });

    // 监听事件
    grid.attachEvent('onRightClick', this._onRightClick);
    grid.attachEvent('onRowDblClicked', this._onRowDblClicked);

    grid.init();
    return grid;
  }

  /**
   * 右键事件
   * @param  {number} id    选择ID
   * @param  {number} lid   上一ID
   * @param  {object} event [description]
   * @return {[type]}       [description]
   */
  _onRightClick(id, lid, event) {
    // 解析出选中的数据信息
    let ids = (this.getSelectedId() || '').split(',');
    // 如果没有选中？则选中右键对应选项
    if (ids.length === 1) {
      this.selectRowById(id);
      ids = [id];
    }
    // 获取选择数据信息
    let infos = [];
    if (ids.length >= 1) {
      infos = antSword['ipcRenderer'].sendSync(
        'shell-find',
        { _id: { $in: ids } }
      )
    }
    // 获取选中的单条数据
    let info = infos[0];
    // 弹出右键菜单
    new ContextMenu(
      infos, event,
      id, ids
    );
    return true;
  }

  /**
   * 双击事件
   * @param  {[type]} id    [description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  _onRowDblClicked(id, event) {
    const info = antSword['ipcRenderer'].sendSync('shell-findOne', id);
    new FileManager(info);
  }
}
module.exports = Grid;
