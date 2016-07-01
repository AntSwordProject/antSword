//
// 左侧目录 模块
//

const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['filemanager']['folder'];

class Folder {

  // 需要参数
  // 1.cell: 左侧layout.cell对象
  constructor(cell, manager) {
    cell.setWidth(250);
    // 创建tree
    let tree = cell.attachTree();
    // tree事件
    tree.attachEvent('onClick', (id) => {
      manager.files.gotoPath(id);
    });

    this.tree = tree;
    this.cell = cell;
    this.cache = {};
    this.manager = manager;
    this.setTitle(0);

  }

  parse(files) {

    let self = this;
    // 解析测试
    let path = this.manager.path.replace(/\/$/, '');
    // 解析盘符
    this.manager.devices.map((_) => {
      self.cache[_] = {};
      self.tree.deleteItem(_);
    });
    // 1. 分解当前路径
    let curPath = '';
    path.split('/').map((p) => {
      curPath += `${p}/`;
      // 添加到缓存
      self.cache[curPath] = 0;
    });
    // 2. 解析当前子目录
    let folderNum = 0;
    files.map((f) => {
      let _ = f['name'];
      if (!_.endsWith('/') || ['./', '../'].indexOf(_) !== -1) {return};
      self.cache[`${curPath}${_}`] = 0;
      folderNum ++;
    });
    // 设置标题
    this.setTitle(folderNum);

    // 3. 解析缓存为树形菜单虚拟对象
    // /var/www/html 根据/分割为数组，循环，相加，增加到虚拟缓存
    let vscache = {};
    let parseObj = (o, p) => {
      let start = p.substr(0, p.indexOf('/')) + '/';
      let end = p.substr(start.length);

      o[start] = o[start] || {};
      if (end.length > 0) {
        parseObj(o[start], end);
      }
    }
    for (let c in self.cache) {
      parseObj(vscache, c);
    }


    // 解析为树形菜单数据
    let parseItem = (obj, path) => {
      let _arr = [];
      for (let _ in obj) {
        let _path = path + _;
        let _obj = {
          id: antSword.noxss(_path),
          text: antSword.noxss((_.length === 1 || (_.endsWith(':/') && _.length === 3)) ? _ : _.replace(/\/$/, ''))
        };
        let _result = parseItem(obj[_], _path);
        if (_result) {
          _obj['item'] = _result;
        };
        if (_path === self.manager.path) {
          _obj['open'] = 1;
          _obj['select'] = 1;
        };
        _arr.push(_obj);
      }
      return _arr;
    }

    let items = parseItem(vscache, '');

    this.tree.parse({
      id: 0,
      item: items
    }, 'json');

    this.cell.progressOff();
  }

  /**
   * 设置标题
   * @param {Number} num 当前目录数
   */
  setTitle(num) {
    this.cell.setText(`<i class="fa fa-folder-o"></i> ${LANG['title']} (${num})`);
  }

}

// export default Folder;
module.exports = Folder;
