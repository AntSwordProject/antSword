//
// 数据库驱动::PHP
// 支持数据库:mysql,mssql,oracle,informix
//

const LANG = antSword['language']['database'];
const LANG_T = antSword['language']['toastr'];

class PHP {

  constructor(opt) {
    this.opt = opt;
    this.core = this.opt.core;
    this.manager = this.opt.super;
    // 1. 初始化TREE UI
    this.tree = this.manager.list.layout.attachTree();
    // 2. 加载数据库配置
    this.parse();
    // 3. tree单击::设置当前配置&&激活按钮
    this.tree.attachEvent('onClick', (id) => {
      // 更改按钮状态
      id.startsWith('conn::') ? this.enableToolbar() : this.disableToolbar();
      // 设置当前配置
      const tmp = id.split('::');
      const arr = tmp[1].split(':');
      // 设置当前数据库
      this.dbconf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
        _id: this.manager.opt['_id'],
        id: arr[0]
      });
      if (arr.length > 1) {
        this.dbconf['database'] = new Buffer(arr[1], 'base64').toString();
        // 更新SQL编辑器
        this.enableEditor();
        // manager.query.update(this.currentConf);
      }else{
        this.disableEditor();
      }
    });
    // 4. tree双击::加载库/表/字段
    this.tree.attachEvent('onDblClick', (id) => {
      const arr = id.split('::');
      if (arr.length < 2) { throw new Error('ID ERR: ' + id) };

      switch(arr[0]) {
        // 获取数据库列表
        case 'conn':
          this.getDatabases(arr[1]);
          break;
        // 获取数据库表名
        case 'database':
          let _db = arr[1].split(':');
          this.getTables(
            _db[0],
            new Buffer(_db[1], 'base64').toString()
          );
          break;
        // 获取表名字段
        case 'table':
          let _tb = arr[1].split(':');
          this.getColumns(
            _tb[0],
            new Buffer(_tb[1], 'base64').toString(),
            new Buffer(_tb[2], 'base64').toString()
          );
          break;
        // 生成查询SQL语句
        case 'column':
          let _co = arr[1].split(':');
          const table = new Buffer(_co[2], 'base64').toString();
          const column = new Buffer(_co[3], 'base64').toString();

          const sql = `SELECT \`${column}\` FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`;
          this.manager.query.editor.session.setValue(sql);
          break;
      }
    });
    // 5. tree右键::功能菜单
    this.tree.attachEvent('onRightClick', (id, event) => {
      if (!id.startsWith('conn::')) { return };
      this.tree.selectItem(id);
      this.tree.callEvent('onClick', [id]);
      bmenu([
        {
          text: LANG['list']['menu']['add'],
          icon: 'fa fa-plus-circle',
          action: this.addConf.bind(this)
        }, {
          divider: true
        }, {
          text: LANG['list']['menu']['edit'],
          icon: 'fa fa-edit',
          action: this.editConf.bind(this)
        }, {
          divider: true
        }, {
          text: LANG['list']['menu']['del'],
          icon: 'fa fa-remove',
          action: this.delConf.bind(this)
        }
      ], event);
    });
  }

  // 加载配置列表
  parse() {
    // 获取数据
    const info = antSword['ipcRenderer'].sendSync('shell-findOne', this.manager.opt['_id']);
    const conf = info['database'] || {};
    // 刷新UI
    // 1.清空数据
    this.tree.deleteChildItems(0);
    // 2.添加数据
    let items = [];
    for (let _ in conf) {
      items.push({
        id: `conn::${_}`,
        text: `${conf[_]['type']}:\/\/${conf[_]['user']}@${conf[_]['host']}`,
        im0: this.manager.list.imgs[0],
        im1: this.manager.list.imgs[0],
        im2: this.manager.list.imgs[0]
      });
    }
    // 3.刷新UI
    this.tree.parse({
      id: 0,
      item: items
    }, 'json');
    // 禁用按钮
    this.disableToolbar();
    this.disableEditor();
  }

  // 添加配置
  addConf() {
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    // 创建窗口
    const win = this.manager.win.createWindow(hash, 0, 0, 450, 300);
    win.setText(LANG['form']['title']);
    win.centerOnScreen();
    win.button('minmax').hide();
    win.setModal(true);
    win.denyResize();
    // 工具栏
    const toolbar = win.attachToolbar();
    toolbar.loadStruct([{
      id: 'add',
      type: 'button',
      icon: 'plus-circle',
      text: LANG['form']['toolbar']['add']
    }, {
      type: 'separator'
    }, {
      id: 'clear',
      type: 'button',
      icon: 'remove',
      text: LANG['form']['toolbar']['clear']
    }]);

    // form
    const form = win.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'combo', label: LANG['form']['type'], readonly: true, name: 'type', options: [
          { text: 'MYSQL', value: 'mysql', list: [

            { type: 'settings', position: 'label-left', offsetLeft: 70, labelWidth: 90, inputWidth: 150 },
            { type: 'label', label: LANG['form']['encode'] },
            { type: 'combo', label: '', name: 'encode', options: (() => {
              let ret = [];
              ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'].map((_) => {
                ret.push({
                  text: _,
                  value: _
                });
              })
              return ret;
            })() }

          ] },
          { text: 'MYSQLI', value: 'mysqli', list: [

            { type: 'settings', position: 'label-left', offsetLeft: 70, labelWidth: 90, inputWidth: 150 },
            { type: 'label', label: LANG['form']['encode'] },
            { type: 'combo', label: '', name: 'encode', options: (() => {
              let ret = [];
              ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'].map((_) => {
                ret.push({
                  text: _,
                  value: _
                });
              })
              return ret;
            })() }

          ] },
          { text: 'MSSQL', value: 'mssql' },
          { text: 'ORACLE', value: 'oracle' },
          { text: 'INFORMIX', value: 'informix' }
        ] },
        { type: 'input', label: LANG['form']['host'], name: 'host', required: true, value: 'localhost' },
        { type: 'input', label: LANG['form']['user'], name: 'user', required: true, value: 'root' },
        { type: 'input', label: LANG['form']['passwd'], name: 'passwd', value: '' }
      ]}
    ], true);

    form.attachEvent('onChange', (_, id) => {
      if (_ !== 'type') { return };
      switch(id) {
        case 'mysql':
        case 'mysqli':
          form.setFormData({
            user: 'root',
            passwd: ''
          });
          break;
        case 'mssql':
          form.setFormData({
            user: 'sa',
            passwd: ''
          });
          break;
        default:
          form.setFormData({
            user: 'dbuser',
            passwd: 'dbpwd'
          });
      }
    });

    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'clear':
          form.clear();
          break;
        case 'add':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let data = form.getValues();
          // 验证是否连接成功(获取数据库列表)
          const id = antSword['ipcRenderer'].sendSync('shell-addDataConf', {
            _id: this.manager.opt['_id'],
            data: data
          });
          win.close();
          toastr.success(LANG['form']['success'], LANG_T['success']);
          this.tree.insertNewItem(0,
            `conn::${id}`,
            `${data['type']}:\/\/${data['user']}@${data['host']}`,
            null,
            this.manager.list.imgs[0],
            this.manager.list.imgs[0],
            this.manager.list.imgs[0]
          );
          break;
      }
    });
  }

  // 编辑配置
  editConf(){
    const id = this.tree.getSelected().split('::')[1];
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    // 创建窗口
    const win = this.manager.win.createWindow(hash, 0, 0, 450, 300);
    win.setText(LANG['form']['title']);
    win.centerOnScreen();
    win.button('minmax').hide();
    win.setModal(true);
    win.denyResize();
    // 工具栏
    const toolbar = win.attachToolbar();
    toolbar.loadStruct([{
      id: 'edit',
      type: 'button',
      icon: 'edit',
      text: LANG['form']['toolbar']['edit']
    }, {
      type: 'separator'
    }, {
      id: 'clear',
      type: 'button',
      icon: 'remove',
      text: LANG['form']['toolbar']['clear']
    }]);

    // form
    const form = win.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'combo', label: LANG['form']['type'], readonly: true, name: 'type', options: [
          { text: 'MYSQL', value: 'mysql', selected: conf['type'] === 'mysql', list: [

            { type: 'settings', position: 'label-left', offsetLeft: 70, labelWidth: 90, inputWidth: 150 },
            { type: 'label', label: LANG['form']['encode'] },
            { type: 'combo', label: '', name: 'encode', options: (() => {
              let ret = [];
              ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'].map((_) => {
                ret.push({
                  text: _,
                  value: _,
                  selected: conf['encode'] === _
                });
              })
              return ret;
            })() }

          ] },
          { text: 'MYSQLI', value: 'mysqli', selected: conf['type'] === 'mysqli', list: [

            { type: 'settings', position: 'label-left', offsetLeft: 70, labelWidth: 90, inputWidth: 150 },
            { type: 'label', label: LANG['form']['encode'] },
            { type: 'combo', label: '', name: 'encode', options: (() => {
              let ret = [];
              ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'].map((_) => {
                ret.push({
                  text: _,
                  value: _,
                  selected: conf['encode'] === _
                });
              })
              return ret;
            })() }

          ] },
          { text: 'MSSQL', value: 'mssql', selected: conf['type'] === 'mssql' },
          { text: 'ORACLE', value: 'oracle', selected: conf['type'] === 'oracle' },
          { text: 'INFORMIX', value: 'informix', selected: conf['type'] === 'informix' }
        ] },
        { type: 'input', label: LANG['form']['host'], name: 'host', required: true, value: conf['host'] },
        { type: 'input', label: LANG['form']['user'], name: 'user', required: true, value: conf['user'] },
        { type: 'input', label: LANG['form']['passwd'], name: 'passwd', value: conf['passwd'] }
      ]}
    ], true);

    form.attachEvent('onChange', (_, id) => {
      if (_ !== 'type') { return };
      switch(id) {
        case 'mysql':
        case 'mysqli':
          form.setFormData({
            user: conf['user'],
            passwd: conf['passwd']
          });
          break;
        case 'mssql':
          form.setFormData({
            user: conf['user'],
            passwd: conf['passwd']
          });
          break;
        default:
          form.setFormData({
            user: conf['user'],
            passwd: conf['passwd']
          });
      }
    });

    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'clear':
          form.clear();
          break;
        case 'edit':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let data = form.getValues();
          // 验证是否连接成功(获取数据库列表)
          const id = antSword['ipcRenderer'].sendSync('shell-editDataConf', {
            _id: this.manager.opt['_id'],
            id: this.tree.getSelected().split('::')[1],
            data: data
          });
          win.close();
          toastr.success(LANG['form']['success'], LANG_T['success']);
          // 刷新 UI
          this.parse();
          break;
      }
    });
  }

  // 删除配置
  delConf() {
    const id = this.tree.getSelected().split('::')[1];
    layer.confirm(LANG['form']['del']['confirm'], {
      icon: 2, shift: 6,
      title: LANG['form']['del']['title']
    }, (_) => {
      layer.close(_);
      const ret = antSword['ipcRenderer'].sendSync('shell-delDataConf', {
        _id: this.manager.opt['_id'],
        id: id
      });
      if (ret === 1) {
        toastr.success(LANG['form']['del']['success'], LANG_T['success']);
        this.tree.deleteItem(`conn::${id}`);
        // 禁用按钮
        this.disableToolbar();
        this.disableEditor();
        // ['edit', 'del'].map(this.toolbar::this.toolbar.disableItem);
        // this.parse();
      }else{
        toastr.error(LANG['form']['del']['error'](ret), LANG_T['error']);
      }
    });
  }

  // 获取数据库列表
  getDatabases(id) {
    this.manager.list.layout.progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });
    this.core.request(
      this.core[`database_${conf['type']}`].show_databases({
        host: conf['host'],
        user: conf['user'],
        passwd: conf['passwd']
      })
    ).then((res) => {
      let ret = res['text'];
      const arr = ret.split('\t');
      if (arr.length === 1 && ret === '') {
        toastr.warning(LANG['result']['warning'], LANG_T['warning']);
        return this.manager.list.layout.progressOff();
      };
      // 删除子节点
      this.tree.deleteChildItems(`conn::${id}`);
      // 添加子节点
      arr.map((_) => {
        if (!_) { return };
        const _db = new Buffer(_).toString('base64');
        this.tree.insertNewItem(
          `conn::${id}`,
          `database::${id}:${_db}`,
          _, null,
          this.manager.list.imgs[1],
          this.manager.list.imgs[1],
          this.manager.list.imgs[1]);
      });
      this.manager.list.layout.progressOff();
    }).catch((err) => {
      toastr.error(LANG['result']['error']['database'](err['status'] || JSON.stringify(err)), LANG_T['error']);
      this.manager.list.layout.progressOff();
    });
  }

  // 获取数据库表数据
  getTables(id, db) {
    this.manager.list.layout.progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });

    this.core.request(
      this.core[`database_${conf['type']}`].show_tables({
        host: conf['host'],
        user: conf['user'],
        passwd: conf['passwd'],
        db: db
      })
    ).then((res) => {
      let ret = res['text'];
      const arr = ret.split('\t');
      const _db = new Buffer(db).toString('base64');
      // 删除子节点
      this.tree.deleteChildItems(`database::${id}:${_db}`);
      // 添加子节点
      arr.map((_) => {
        if (!_) { return };
        const _table = new Buffer(_).toString('base64');
        this.tree.insertNewItem(
          `database::${id}:${_db}`,
          `table::${id}:${_db}:${_table}`,
          _,
          null,
          this.manager.list.imgs[2],
          this.manager.list.imgs[2],
          this.manager.list.imgs[2]
        );
      });
      this.manager.list.layout.progressOff();
    }).catch((err) => {
      toastr.error(LANG['result']['error']['table'](err['status'] || JSON.stringify(err)), LANG_T['error']);
      this.manager.list.layout.progressOff();
    });
  }

  // 获取字段
  getColumns(id, db, table) {
    this.manager.list.layout.progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });

    this.core.request(
      this.core[`database_${conf['type']}`].show_columns({
        host: conf['host'],
        user: conf['user'],
        passwd: conf['passwd'],
        db: db,
        table: table
      })
    ).then((res) => {
      let ret = res['text'];
      const arr = ret.split('\t');
      const _db = new Buffer(db).toString('base64');
      const _table = new Buffer(table).toString('base64');
      // 删除子节点
      this.tree.deleteChildItems(`table::${id}:${_db}:${_table}`);
      // 添加子节点
      arr.map((_) => {
        if (!_) { return };
        const _column = new Buffer(_.split(' ')[0]).toString('base64');
        this.tree.insertNewItem(
          `table::${id}:${_db}:${_table}`,
          `column::${id}:${_db}:${_table}:${_column}`,
          _, null,
          this.manager.list.imgs[3],
          this.manager.list.imgs[3],
          this.manager.list.imgs[3]
        );
      });
      // 更新编辑器SQL语句
      this.manager.query.editor.session.setValue(`SELECT * FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`);
      this.manager.list.layout.progressOff();
    }).catch((err) => {
      toastr.error(LANG['result']['error']['column'](err['status'] || JSON.stringify(err)), LANG_T['error']);
      this.manager.list.layout.progressOff();
    });
  }

  // 执行SQL
  execSQL(sql) {
    this.manager.query.layout.progressOn();

    this.core.request(
      this.core[`database_${this.dbconf['type']}`].query({
        host: this.dbconf['host'],
        user: this.dbconf['user'],
        passwd: this.dbconf['passwd'],
        db: this.dbconf['database'],
        sql: sql,
        encode: this.dbconf['encode'] || 'utf8'
      })
    ).then((res) => {
      let ret = res['text'];
      // 更新执行结果
      this.updateResult(ret);
      this.manager.query.layout.progressOff();
    }).catch((err) => {
      toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
      this.manager.query.layout.progressOff();
    });
  }

  // 更新SQL执行结果
  updateResult(data) {
    // 1.分割数组
    const arr = data.split('\n');
    // 2.判断数据
    if (arr.length < 2) {
      return toastr.error(LANG['result']['error']['parse'], LANG_T['error']);
    };
    // 3.行头
    let header_arr = arr[0].split('\t|\t');
    if (header_arr.length === 1) {
      return toastr.warning(LANG['result']['error']['noresult'], LANG_T['warning']);
    };
    if (header_arr[header_arr.length - 1] === '\r') {
      header_arr.pop();
    };
    arr.shift();
    // 4.数据
    let data_arr = [];
    arr.map((_) => {
      let _data = _.split('\t|\t');
      for (let i = 0; i < _data.length; i ++) {
      	_data[i] = antSword.noxss(new Buffer(_data[i], "base64").toString());
      }
      data_arr.push(_data);
    });
    data_arr.pop();
    // 5.初始化表格
    const grid = this.manager.result.layout.attachGrid();
    grid.clearAll();
    grid.setHeader(header_arr.join(',').replace(/,$/, ''));
    grid.setColSorting(('str,'.repeat(header_arr.length)).replace(/,$/, ''));
    grid.setInitWidths('*');
    grid.setEditable(true);
    grid.init();
    // 添加数据
    let grid_data = [];
    for (let i = 0; i < data_arr.length; i ++) {
      grid_data.push({
        id: i + 1,
        data: data_arr[i]
      });
    }
    grid.parse({
      'rows': grid_data
    }, 'json');
    // 启用导出按钮
    // this.manager.result.toolbar[grid_data.length > 0 ? 'enableItem' : 'disableItem']('dump');
  }

  // 禁用toolbar按钮
  disableToolbar() {
    this.manager.list.toolbar.disableItem('del');
    this.manager.list.toolbar.disableItem('edit');
  }

  // 启用toolbar按钮
  enableToolbar() {
    this.manager.list.toolbar.enableItem('del');
    this.manager.list.toolbar.enableItem('edit');
  }

  // 禁用SQL编辑框
  disableEditor() {
    ['exec', 'clear'].map(
      this.manager.query.toolbar.disableItem.bind(this.manager.query.toolbar)
    );
    this.manager.query.editor.setReadOnly(true);
  }

  // 启用SQL编辑框
  enableEditor() {
    ['exec', 'clear'].map(
      this.manager.query.toolbar.enableItem.bind(this.manager.query.toolbar)
    );
    this.manager.query.editor.setReadOnly(false);
  }

}

module.exports = PHP;
