/**
 * 工具栏
 */

const LANG = antSword['language']['shellmanager']['category'];
const LANG_T = antSword['language']['toastr'];

class Toolbar {
  /**
   * 初始化函数
   * @param  {Object} cell dhtmlx.cell对象
   * @param  {Object} top  顶层父对象
   * @return {[type]}      [description]
   */
  constructor(cell, top) {
    this.top = top;
    const toolbar = cell.attachToolbar();
    this.parseToolbar(toolbar);
    toolbar.attachEvent('onClick', this._onClick.bind(this));
    return toolbar;
  }

  /**
   * 解析工具栏按钮
   * @param  {object} toolbar
   * @return {[type]} [description]
   */
  parseToolbar(toolbar) {
    let _tbObj = [];
    [
      // id&&lang, icon, disabled
      ['add', 'plus-circle'],
      false,
      ['rename', 'font', true],
      false,
      ['del', 'trash', true]
    ].map((_) => {
      // 分隔符
      if (!_) {
        return _tbObj.push({
          type: 'separator'
        })
      }
      let _tb = {
        id: _[0],
        type: 'button',
        text: `<i class="fa fa-${_[1]}"></i> ${LANG['toolbar'][_[0]]}`
      }
      // 禁用
      if (_[2]) {
        _tb['disabled'] = true;
      }
      _tbObj.push(_tb);
    });
    toolbar.loadStruct(_tbObj);
  }

  /**
   * 工具栏点击事件
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  _onClick(id) {
    switch (id) {
      case 'add':
        this._addCategory();
        break;
      case 'del':
        this._delCategory();
        break;
      case 'rename':
        this._renameCategory();
        break;
    }
  }

  /**
   * 删除分类（会同时删除该分类下的所有数据
   * @return {[type]} [description]
   */
  _delCategory() {
    // 获取当前选择的分类
    const category = this.top.sidebar.getActiveItem();
    // 删除提示框
    layer.confirm(
      LANG['del']['confirm'], {
        icon: 2, shift: 6,
        title: `<i class="fa fa-trash"></i> ${LANG['del']['title']}`
      }, (_) => {
        layer.close(_);
        // 1. 删除分类数据
        const ret = antSword['ipcRenderer'].sendSync('shell-clear', category);
        if (typeof(ret) === 'number') {
          toastr.success(LANG['del']['success'](category), LANG_T['success']);
          // 2. 跳转到默认分类
          this.top.sidebar.callEvent('onSelect', ['default']);
          // 3. 删除侧边栏
          this.top.sidebar.items(category).remove();
          // 4. 更新侧边栏标题
          setTimeout(this.top.updateHeader.bind(this.top), 200);
        }else{
          return toastr.error(LANG['del']['error'](category, ret.toString()), LANG_T['error']);
        }
      }
    );
  }

  /**
   * 添加分类
   * @return {[type]} [description]
   */
  _addCategory() {
    this.categoryForm(
      `<i class="fa fa-plus-circle"></i> ${LANG['add']['title']}`
    ).then((v) => {
      this.top.sidebar.callEvent('onSelect', [v]);
    })
  }

  /**
   * 重命名分类
   * @return {[type]} [description]
   */
  _renameCategory() {
    const _category = this.top.sidebar.getActiveItem();
    this.categoryForm(
      `<i class="fa fa-font"></i> ${LANG['rename']['title']}`,
      _category
    ).then((v) => {
      // 禁止的分类名
      if (v === 'default') {
        return toastr.warning(LANG['rename']['disable'], LANG_T['warning']);
      };
      // 判断分类是否存在
      if (this.top.sidebar.items(v)) {
        return toastr.warning(LANG['rename']['exists'], LANG_T['warning']);
      };
      // 更新数据库
      const ret = antSword['ipcRenderer'].sendSync('shell-renameCategory', {
        oldName: _category,
        newName: v
      });
      if (typeof ret === 'number') {
        // 更新成功
        toastr.success(LANG['rename']['success'], LANG_T['success']);
        // 删除旧分类
        this.top.sidebar.items(_category).remove();
        // 添加新分类
        this.top.sidebar.addItem({
          id: v,
          bubble: ret,
          text: `<i class="fa fa-folder-o"></i> ${v}`
        });
        // 跳转分类
        setTimeout(() => {
          this.top.sidebar.items(v).setActive();
        }, 233);
      }else{
        toastr.error(LANG['rename']['error'], LANG_T['error']);
      }
    })
  }

  /**
   * 分类表单
   * @param  {string} title 标题
   * @param  {string} value 默认值
   * @return {[type]}       [description]
   */
  categoryForm(title, value = new Date().format('yyyyMMdd')) {
    return new Promise((res, rej) => {
      layer.prompt({
        title: title,
        value: value
      }, (val, idx, ele) => {
        layer.close(idx);
        return res(val);
      });
    })
  }
}

module.exports = Toolbar;
