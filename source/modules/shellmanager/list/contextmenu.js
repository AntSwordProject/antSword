/**
 * 右键菜单
 */

const Data = require('../data');
const Form = require('./form');
const ViewSite = require('../../viewsite/');
const Terminal = require('../../terminal/');
const Database = require('../../database/');
const FileManager = require('../../filemanager/');
const LANG = antSword['language']['shellmanager'];
const LANG_T = antSword['language']['toastr'];

class ContextMenu {
  /**
   * 初始化函数
   * @param  {array} data  选中的数据
   * @param  {object} event 右键事件对象
   * @return {[type]}       [description]
   */
  constructor(data, event, id, ids) {
    let selectedData = !id || ids.length !== 1;
    let selectedMultiData = !id;

    // 解析菜单事件
    let menuItems = [];
    [
      // text, icon, disabled, action, submenu
      ['terminal', 'terminal', selectedData, () => {
        new Terminal(data[0])
      }],
      ['filemanager', 'folder-o', selectedData, () => {
        new FileManager(data[0]);
      }],
      ['database', 'database', selectedData, () => {
        new Database(data[0]);
      }],
      ['viewsite', 'chrome', selectedData, () => {
        new ViewSite(data[0]);
      }],
      false,
      ['plugin', 'folder-o', selectedMultiData, null, this.parsePlugContextMenu(data)],
      [
        'pluginStore', 'cart-arrow-down', false,
        antSword['menubar'].run.bind(antSword['menubar'], 'plugin-store')
      ],
      false,
      ['add', 'plus-circle', false, this.addData.bind(this)],
      ['edit', 'edit', selectedData, this.editData.bind(this, data[0])],
      ['delete', 'remove', selectedMultiData, this.delData.bind(this, ids)],
      false,
      ['move', 'share-square', selectedMultiData, null, this.parseMoveCategoryMenu(ids)],
      ['search', 'search', true],
      false,
      ['clearCache', 'trash-o', selectedData, this.clearCache.bind(this, id)],
      ['clearAllCache', 'trash', false, this.clearAllCache.bind(this)]
    ].map((menu) => {
      // 分隔符号
      if (!menu) {
        return menuItems.push({
          divider: true
        })
      }
      let menuObj = {
        text: LANG['contextmenu'][menu[0]],
        icon: `fa fa-${menu[1]}`,
        disabled: menu[2]
      }
      // 点击事件
      if (menu[3] instanceof Function) {
        menuObj['action'] = menu[3];
      }
      // 子菜单
      if (Array.isArray(menu[4])) {
        menuObj['subMenu'] = menu[4];
      }
      menuItems.push(menuObj);
    });
    // 弹出菜单
    bmenu(menuItems, event);
  }

  /**
   * 把插件列表解析成右键菜单所需要的数据
   * @return {array} [description]
   */
  parsePlugContextMenu(data) {
    let info = data[0];
    let infos = data;
    // 1. 遍历插件分类信息
    let plugins = {
      default: []
    };
    for (let _ in antSword['plugins']) {
      let p = antSword['plugins'][_];
      let c = p['info']['category'] || 'default';
      plugins[c] = plugins[c] || [];
      plugins[c].push(p);
    }
    // 2. 解析分类数据
    let pluginItems = [];
    for (let _ in plugins) {
      // 0x01 添加分类目录
      pluginItems.push({
        text: antSword.noxss(_ === 'default' ? LANG['contextmenu']['pluginDefault'] : _),
        icon: 'fa fa-folder-open-o',
        disabled: plugins[_].length === 0,
        subMenu: ((plugs) => {
          let plugItems = [];
          // 0x02 添加目录数据
          plugs.map((p) => {
            plugItems.push({
              text: antSword.noxss(p['info']['name']),
              icon: `fa fa-${p['info']['icon'] || 'puzzle-piece'}`,
              disabled: infos.length > 1 ? (() => {
                let ret = false;
                // 判断脚本是否支持，不支持则禁止
                if (p['info']['scripts'] && p['info']['scripts'].length > 0) {
                  infos.map((_info) => {
                    if (p['info']['scripts'].indexOf(_info['type']) === -1) {
                      // 如果检测到不支持的脚本，则禁止
                      ret = true;
                    }
                  });
                }
                // 判断是否支持多目标执行
                return ret || !p['info']['multiple'];
              })() : info && (p['info']['scripts'] || []).indexOf(info['type']) === -1,
              action: ((plug) => () => {
                // 如果没有加载到内存，则加载
                if (!antSword['plugins'][plug['_id']]['module']) {
                  antSword['plugins'][plug['_id']]['module'] = require(
                    path.join(plug['path'], plug['info']['main'] || 'index.js')
                  );
                }
                // 执行插件
                new antSword['plugins'][plug['_id']]['module'](
                  infos.length === 1 && !plug['info']['multiple'] ? info : infos
                );
              })(p)
            })
          });
          return plugItems;
        })(plugins[_])
      })
    }
    return pluginItems;
  }

  /**
   * 移动数据右键菜单
   * @return {array} [description]
   */
  parseMoveCategoryMenu(ids) {
    // 获取分类列表
    const items = antSword.modules.shellmanager.category.sidebar.getAllItems();
    // 当前选中分类
    const category = antSword.modules.shellmanager.category.sidebar.getActiveItem();
    // 移动事件
    const moveHandler = (c) => {
      const ret = antSword['ipcRenderer'].sendSync('shell-move', {
        ids: ids,
        category: c
      });
      if (typeof(ret) === 'number') {
        toastr.success(LANG['list']['move']['success'](ret), LANG_T['success']);
        antSword.modules.shellmanager.reloadData();
        antSword.modules.shellmanager.category.sidebar.callEvent('onSelect', [c])
      }else{
        toastr.error(LANG['list']['move']['error'](ret), LANG_T['error']);
      }
    }
    // 解析菜单
    let ret = [];
    items.map((_) => {
      ret.push({
        text: _ === 'default' ? LANG['category']['default'] : _,
        icon: 'fa fa-folder-o',
        disabled: category === _,
        action: moveHandler.bind(null, _)
      });
    });
    return ret;
  }

  /**
   * 添加数据
   */
  addData() {
    new Form({
      title: LANG['list']['add']['title'],
      icon: 'plus-circle',
      text: LANG['list']['add']['toolbar']['add']
    }, {}, (data) => {
      return new Promise((res, rej) => {
        // 获取当前分类
        data['base']['category'] = antSword.modules.shellmanager.category.sidebar.getActiveItem();
        // 通知后台插入数据
        const ret = antSword.ipcRenderer.sendSync('shell-add', data);
        if (ret instanceof Object) {
          // 重新加载数据
          antSword.modules.shellmanager.reloadData({
            category: data['base']['category']
          });
          return res(LANG['list']['add']['success']);
        } else {
          return rej(LANG['list']['add']['error'](ret.toString()));
        }
      });
    })
  }

  /**
   * 编辑数据
   * @param  {Object} info 当前选中的数据
   * @return {[type]}    [description]
   */
  editData(info) {
    new Form({
      title: LANG['list']['edit']['title'](info.url),
      icon: 'save',
      text: LANG['list']['edit']['toolbar']['save']
    }, info, (data) => {
      return new Promise((res, rej) => {
        // 通知后台更新数据
        const ret = antSword.ipcRenderer.sendSync('shell-edit', {
          old: info,
          new: data
        });
        if (ret === 1) {
          // 重新加载数据
          antSword.modules.shellmanager.reloadData({
            category: info['category']
          });
          return res(LANG['list']['edit']['success']);
        } else {
          return rej(LANG['list']['edit']['error'](ret.toString()));
        }
      })
    })
  }

  /**
   * 删除数据
   * @param  {array} ids [description]
   * @return {[type]}     [description]
   */
  delData(ids) {
    layer.confirm(
    LANG['list']['del']['confirm'](ids.length), {
      icon: 2, shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['list']['del']['title']}`
    }, (_) => {
      layer.close(_);
      const ret = antSword['ipcRenderer'].sendSync('shell-del', ids);
      if (typeof(ret) === 'number') {
        toastr.success(LANG['list']['del']['success'](ret), LANG_T['success']);
        // 更新UI
        antSword.modules.shellmanager.reloadData({
          category: antSword.modules.shellmanager.category.sidebar.getActiveItem()
        });
      }else{
        toastr.error(LANG['list']['del']['error'](ret.toString()), LANG_T['error']);
      }
    });
  }

  /**
   * 搜索数据
   * @return {[type]} [description]
   */
  searchData() {

  }

  /**
   * 清空缓存
   * @param  {number} id ID
   * @return {[type]}     [description]
   */
  clearCache(id) {
    layer.confirm(
    LANG['list']['clearCache']['confirm'], {
      icon: 2, shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['list']['clearCache']['title']}`
    }, (_) => {
      layer.close(_);
      const ret = antSword['ipcRenderer'].sendSync('cache-clear', {
        id: id
      });
      if (ret === true) {
        toastr.success(LANG['list']['clearCache']['success'], LANG_T['success']);
      }else{
        toastr.error(
          LANG['list']['clearCache']['error'](
            ret['errno'] === -2 ? 'Not cache file.' : ret['errno']
          ), LANG_T['error']
        );
      }
    });
  }

  /**
   * 清空所有缓存
   * @return {[type]} [description]
   */
  clearAllCache() {
    layer.confirm(
    LANG['list']['clearAllCache']['confirm'], {
      icon: 2, shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['list']['clearAllCache']['title']}`
    }, (_) => {
      layer.close(_);
      const ret = antSword['ipcRenderer'].sendSync('cache-clearAll');
      if (ret === true) {
        toastr.success(LANG['list']['clearAllCache']['success'], LANG_T['success']);
      }else{
        toastr.error(LANG['list']['clearAllCache']['error'](ret), LANG_T['error']);
      }
    });
  }
}

module.exports = ContextMenu;
