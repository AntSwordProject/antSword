//
// 数据库驱动::ASP 支持数据库:access,sqlserver,mysql
//

const LANG = antSword['language']['database'];
const LANG_T = antSword['language']['toastr'];
const dialog = antSword.remote.dialog;
const fs = require('fs');

class ASP {

  constructor(opt) {
    this.opt = opt;
    this.core = this.opt.core;
    this.manager = this.opt.super;
    //
    // * 数据库驱动列表
    //
    this.conns = {
      'dsn': 'Dsn=DsnName;',
      'mysql': 'Driver={MySQL};Server=localhost;database=mysql;UID=root;PWD=',
      'access': 'Driver={Microsoft Access Driver(*.mdb)};DBQ=c:\\test.mdb',
      'sqlserver': 'Driver={Sql Server};Server=(local);Database=master;Uid=sa;Pwd=',
      'sqloledb_1': 'Provider=SQLOLEDB.1;User ID=sa;Password=;Initial Catalog=master;Data Source=(loc' +
        'al);',
      'sqloledb_1_sspi': 'Provider=SQLOLEDB.1;Initial Catalog=master;Data Source=(local);Integrated Securi' +
        'ty=SSPI;',
      'oracle': 'Provider=OraOLEDB.Oracle;Data Source=test;User Id=sys;Password=;Persist Security' +
        ' Info=True;',
      'microsoft_jet_oledb_4_0': 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=c:\\test.mdb'
    };
    // 1. 初始化TREE UI
    this.tree = this
      .manager
      .list
      .layout
      .attachTree();
    // 2. 加载数据库配置
    this.parse();
    // 3. tree单击::设置当前配置&&激活按钮
    this
      .tree
      .attachEvent('onClick', (id) => {
        // 更改按钮状态
        id.startsWith('conn::') ?
          this.enableToolbar() :
          this.disableToolbar();
        // 设置当前配置
        const tmp = id.split('::');
        const arr = tmp[1].split(':');
        // 设置当前数据库
        this.dbconf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
          _id: this.manager.opt['_id'],
          id: arr[0]
        });
        if (arr.length > 1) {
          this.dbconf['database'] = Buffer.from(arr[1], 'base64').toString();
          // 更新SQL编辑器
          this.enableEditor();
          // manager.query.update(this.currentConf);
        } else {
          this.disableEditor();
        }
      });
    // 4. tree双击::加载库/表/字段
    this
      .tree
      .attachEvent('onDblClick', (id) => {
        const arr = id.split('::');
        if (arr.length < 2) {
          throw new Error('ID ERR: ' + id)
        };
        switch (arr[0]) {
          // 获取数据库列表
          case 'conn':
            this.getDatabases(arr[1]);
            break;
            // 获取数据库表名
          case 'database':
            let _db = arr[1].split(':');
            this.getTables(_db[0], Buffer.from(_db[1], 'base64').toString());
            break;
            // 获取表名字段
          case 'table':
            let _tb = arr[1].split(':');
            this.getColumns(_tb[0], Buffer.from(_tb[1], 'base64').toString(), Buffer.from(_tb[2], 'base64').toString());
            break;
            // 生成查询SQL语句
          case 'column':
            let _co = arr[1].split(':');
            const db = Buffer.from(_co[1], 'base64').toString();
            const table = Buffer.from(_co[2], 'base64').toString();
            const column = Buffer.from(_co[3], 'base64').toString();
            let sql = "";
            switch (this.dbconf['type']) {
              case 'mysql':
                sql = `SELECT \`${column}\` FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`;
                break;
              case 'oracle':
                sql = `SELECT "${table}"."${column}" FROM ${db}.${table} WHERE ROWNUM < 20 ORDER BY 1`;
                break;
              default:
                sql = `SELECT TOP 20 [${column}] FROM [${table}] ORDER BY 1 DESC;`;
                break;
            }
            this
              .manager
              .query
              .editor
              .session
              .setValue(sql);
            break;
        }
      });
    // 5. tree右键::功能菜单
    this
      .tree
      .attachEvent('onRightClick', (id, event) => {
        if (!id.startsWith('conn::')) {
          return
        };
        this
          .tree
          .selectItem(id);
        this
          .tree
          .callEvent('onClick', [id]);
        bmenu([{
          text: LANG['list']['menu']['add'],
          icon: 'fa fa-plus-circle',
          action: this
            .addConf
            .bind(this)
        }, {
          divider: true
        }, {
          text: LANG['list']['menu']['edit'],
          icon: 'fa fa-edit',
          action: this
            .editConf
            .bind(this)
        }, {
          divider: true
        }, {
          text: LANG['list']['menu']['del'],
          icon: 'fa fa-remove',
          action: this
            .delConf
            .bind(this)
        }], event);
      });
  }

  // 加载配置列表
  parse() {
    // 获取数据
    const info = antSword['ipcRenderer'].sendSync('shell-findOne', this.manager.opt['_id']);
    const conf = info['database'] || {};
    // 刷新UI 1.清空数据
    this
      .tree
      .deleteChildItems(0);
    // 2.添加数据
    let items = [];
    for (let _ in conf) {
      items.push({
        id: `conn::${_}`,
        // text: `${conf[_]['type']}:\/\/${conf[_]['user']}@${conf[_]['host']}`,
        text: antSword.noxss(conf[_]['type'].toUpperCase()),
        im0: this.manager.list.imgs[0],
        im1: this.manager.list.imgs[0],
        im2: this.manager.list.imgs[0]
      });
    }
    // 3.刷新UI
    this
      .tree
      .parse({
        id: 0,
        item: items
      }, 'json');
    // 禁用按钮
    this.disableToolbar();
    this.disableEditor();
  }

  // 添加配置
  addConf() {
    const hash = (+new Date * Math.random())
      .toString(16)
      .substr(2, 8);
    // 创建窗口
    const win = this
      .manager
      .win
      .createWindow(hash, 0, 0, 450, 300);
    win.setText(LANG['form']['title']);
    win.centerOnScreen();
    win
      .button('minmax')
      .hide();
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
    }, {
      type: 'separator'
    }, {
      id: 'test',
      type: 'button',
      icon: 'spinner',
      text: LANG['form']['toolbar']['test']
    }]);

    // form
    const form = win.attachForm([{
      type: 'settings',
      position: 'label-left',
      labelWidth: 80,
      inputWidth: 280
    }, {
      type: 'block',
      inputWidth: 'auto',
      offsetTop: 12,
      list: [{
        type: 'combo',
        label: LANG['form']['type'],
        readonly: true,
        name: 'type',
        options: (() => {
          let ret = [];
          for (let _ in this.conns) {
            ret.push({
              text: _.toUpperCase(),
              value: _
            });
          }
          return ret;
        })()
      }, {
        type: 'input',
        label: LANG['form']['conn'],
        name: 'conn',
        required: true,
        value: 'Dsn=DsnName;',
        rows: 9
      }]
    }], true);

    form.attachEvent('onChange', (_, id) => {
      if (_ !== 'type') {
        return
      };
      form.setFormData({
        conn: this.conns[id]
      });
    });

    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'clear':
          form.clear();
          break;
        case 'add':
          if (!form.validate()) {
            // return '填写完整！';
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
          this
            .tree
            .insertNewItem(0, `conn::${id}`,
              // `${data['type']}:\/\/${data['user']}@${data['host']}`,
              data['type'].toUpperCase(), null, this.manager.list.imgs[0], this.manager.list.imgs[0], this.manager.list.imgs[0]);
          break;
        case 'test':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let _data = form.getValues();
          win.progressOn();
          this
            .core
            .request(this.core[`database_${_data['type']}`].show_databases({
              conn: _data['conn']
            }))
            .then((res) => {
              if (res['text'].length > 0) {
                if (res['text'].indexOf("ERROR://") > -1) {
                  throw res["text"];
                }
                toastr.success(LANG['form']['test_success'], LANG_T['success']);
              } else {
                toastr.warning(LANG['form']['test_warning'], LANG_T['warning']);
              }
              win.progressOff();
            })
            .catch((err) => {
              win.progressOff();
              toastr.error(JSON.stringify(err), LANG_T['error']);
            });
          break;
      }
    });
  }

  // 修改配置
  editConf() {
    const id = this
      .tree
      .getSelected()
      .split('::')[1];
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });
    const hash = (+new Date * Math.random())
      .toString(16)
      .substr(2, 8);
    // 创建窗口
    const win = this
      .manager
      .win
      .createWindow(hash, 0, 0, 450, 300);
    win.setText(LANG['form']['title']);
    win.centerOnScreen();
    win
      .button('minmax')
      .hide();
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
    }, {
      type: 'separator'
    }, {
      id: 'test',
      type: 'button',
      icon: 'spinner',
      text: LANG['form']['toolbar']['test']
    }]);

    // form
    const form = win.attachForm([{
      type: 'settings',
      position: 'label-left',
      labelWidth: 80,
      inputWidth: 280
    }, {
      type: 'block',
      inputWidth: 'auto',
      offsetTop: 12,
      list: [{
        type: 'combo',
        label: LANG['form']['type'],
        readonly: true,
        name: 'type',
        options: (() => {
          let ret = [];
          for (let _ in this.conns) {
            ret.push({
              text: _.toUpperCase(),
              value: _,
              selected: conf['type'] === _
            });
          }
          return ret;
        })()
      }, {
        type: 'input',
        label: LANG['form']['conn'],
        name: 'conn',
        required: true,
        value: conf['conn'],
        rows: 9
      }]
    }], true);

    form.attachEvent('onChange', (_, id) => {
      if (_ !== 'type') {
        return
      };
      form.setFormData({
        conn: this.conns[id]
      });
    });

    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch (id) {
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
            id: this
              .tree
              .getSelected()
              .split('::')[1],
            data: data
          });
          win.close();
          toastr.success(LANG['form']['success'], LANG_T['success']);
          // 刷新 UI
          this.parse();
          break;
        case 'test':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let _data = form.getValues();
          win.progressOn();
          this
            .core
            .request(this.core[`database_${_data['type']}`].show_databases({
              conn: _data['conn']
            }))
            .then((res) => {
              if (res['text'].length > 0) {
                if (res['text'].indexOf("ERROR://") > -1) {
                  throw res["text"];
                }
                toastr.success(LANG['form']['test_success'], LANG_T['success']);
              } else {
                toastr.warning(LANG['form']['test_warning'], LANG_T['warning']);
              }
              win.progressOff();
            })
            .catch((err) => {
              win.progressOff();
              toastr.error(JSON.stringify(err), LANG_T['error']);
            });
          break;
      }
    });
  }

  // 删除配置
  delConf() {
    const id = this
      .tree
      .getSelected()
      .split('::')[1];
    layer.confirm(LANG['form']['del']['confirm'], {
      icon: 2,
      shift: 6,
      title: LANG['form']['del']['title']
    }, (_) => {
      layer.close(_);
      const ret = antSword['ipcRenderer'].sendSync('shell-delDataConf', {
        _id: this.manager.opt['_id'],
        id: id
      });
      if (ret === 1) {
        toastr.success(LANG['form']['del']['success'], LANG_T['success']);
        this
          .tree
          .deleteItem(`conn::${id}`);
        // 禁用按钮
        this.disableToolbar();
        this.disableEditor();
        // ['edit', 'del'].map(this.toolbar::this.toolbar.disableItem); this.parse();
      } else {
        toastr.error(LANG['form']['del']['error'](ret), LANG_T['error']);
      }
    });
  }

  // 获取数据库列表
  getDatabases(id) {
    this
      .manager
      .list
      .layout
      .progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });

    this
      .core
      .request(this.core[`database_${conf['type']}`].show_databases({
        conn: conf['conn'],
        dbname: ['access', 'microsoft_jet_oledb_4_0'].indexOf(conf['type']) > -1 ?
          conf['conn'].match(/[\w]+.mdb$/) : 'database'
      }))
      .then((res) => {
        let ret = res['text'];
        if (ret.indexOf("ERROR://") > -1) {
          throw ret;
        }
        const arr = ret.split('\t');
        if (arr.length === 1 && ret === '') {
          toastr.warning(LANG['result']['warning'], LANG_T['warning']);
          return this
            .manager
            .list
            .layout
            .progressOff();
        };
        // 删除子节点
        this
          .tree
          .deleteChildItems(`conn::${id}`);
        // 添加子节点
        arr.map((_) => {
          if (!_) {
            return
          };
          const _db = Buffer
            .from(antSword.unxss(_))
            .toString('base64');
          this
            .tree
            .insertNewItem(`conn::${id}`, `database::${id}:${_db}`, _, null, this.manager.list.imgs[1], this.manager.list.imgs[1], this.manager.list.imgs[1]);
        });
        this
          .manager
          .list
          .layout
          .progressOff();
      })
      .catch((err) => {
        toastr.error(LANG['result']['error']['database'](err['status'] || JSON.stringify(err)), LANG_T['error']);
        this
          .manager
          .list
          .layout
          .progressOff();
      });
  }

  // 获取数据库表数据
  getTables(id, db) {
    this
      .manager
      .list
      .layout
      .progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });

    this
      .core
      .request(this.core[`database_${conf['type']}`].show_tables({
        conn: conf['conn'],
        dbname: db
      }))
      .then((res) => {
        let ret = res['text'];
        if (ret.indexOf("ERROR://") > -1) {
          throw ret;
        }
        const arr = ret.split('\t');
        const _db = Buffer
          .from(db)
          .toString('base64');
        // 删除子节点
        this
          .tree
          .deleteChildItems(`database::${id}:${_db}`);
        // 添加子节点
        arr.map((_) => {
          if (!_) {
            return
          };
          const _table = Buffer
            .from(antSword.unxss(_))
            .toString('base64');
          this
            .tree
            .insertNewItem(`database::${id}:${_db}`, `table::${id}:${_db}:${_table}`, _, null, this.manager.list.imgs[2], this.manager.list.imgs[2], this.manager.list.imgs[2]);
        });
        this
          .manager
          .list
          .layout
          .progressOff();
      })
      .catch((err) => {
        toastr.error(LANG['result']['error']['table'](err['status'] || JSON.stringify(err)), LANG_T['error']);
        this
          .manager
          .list
          .layout
          .progressOff();
      });
  }

  // 获取字段
  getColumns(id, db, table) {
    this
      .manager
      .list
      .layout
      .progressOn();
    // 获取配置
    const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
      _id: this.manager.opt['_id'],
      id: id
    });
    let sql = "";
    switch (conf['type']) {
      case "oracle":
        // sql = `SELECT * FROM ${db}.${table} WHERE ROWNUM=0`;
        sql = `SELECT COLUMN_NAME,DATA_TYPE,DATA_LENGTH FROM ALL_TAB_COLUMNS WHERE OWNER='${db}' AND TABLE_NAME='${table}' ORDER BY COLUMN_ID`;
        break;
      case 'sqlserver':
      case 'sqloledb_1':
      case 'sqloledb_1_sspi':
        sql = `USE [${this.dbconf['database']}];SELECT TOP 0 * FROM ${table}`;
        break;
      case 'mysql':
        sql = `SELECT * FROM ${table} LIMIT 0,0;`;
        break;
      default:
        sql = `SELECT TOP 1 * FROM ${table} ORDER BY 1 DESC`;
        break;
    }
    this
      .core
      .request(this.core[`database_${conf['type']}`].show_columns({
        conn: conf['conn'],
        table: sql
      }))
      .then((res) => {
        let ret = res['text'];
        if (ret.indexOf("ERROR://") > -1) {
          throw ret;
        }
        const arr = ret.split('\t');
        const _db = Buffer
          .from(db)
          .toString('base64');
        const _table = Buffer
          .from(table)
          .toString('base64');
        // 删除子节点
        this
          .tree
          .deleteChildItems(`table::${id}:${_db}:${_table}`);
        // 添加子节点
        arr.map((_) => {
          if (!_) {
            return
          };
          _ = antSword.unxss(_);
          const _column = Buffer
            .from(_.substr(0, _.lastIndexOf(' ')))
            .toString('base64');
          this
            .tree
            .insertNewItem(`table::${id}:${_db}:${_table}`, `column::${id}:${_db}:${_table}:${_column}`, antSword.noxss(_), null, this.manager.list.imgs[3], this.manager.list.imgs[3], this.manager.list.imgs[3]);
        });
        let presql = "";
        switch (this.dbconf['type']) {
          case 'mysql':
            presql = `SELECT * FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`;
            break;
          case 'oracle':
            presql = `SELECT * FROM ${db}.${table} WHERE ROWNUM < 20 ORDER BY 1`;
            break;
          default:
            presql = `SELECT TOP 20 * from [${table}] ORDER BY 1 DESC;`;
            break;
        }
        // 更新编辑器SQL语句
        this
          .manager
          .query
          .editor
          .session
          .setValue(presql);
        this
          .manager
          .list
          .layout
          .progressOff();
      })
      .catch((err) => {
        toastr.error(LANG['result']['error']['column'](err['status'] || JSON.stringify(err)), LANG_T['error']);
        this
          .manager
          .list
          .layout
          .progressOff();
      });
  }

  // 执行SQL
  execSQL(sql) {
    this
      .manager
      .query
      .layout
      .progressOn();

    this
      .core
      .request(this.core[`database_${this.dbconf['type']}`].query({
        conn: this.dbconf['conn'],
        sql: sql,
        dbname: this.dbconf['database']
      }))
      .then((res) => {
        let ret = res['text'];
        if (ret.indexOf("ERROR://") > -1) {
          throw ret;
        }
        // 更新执行结果
        this.updateResult(ret);
        this
          .manager
          .query
          .layout
          .progressOff();
      })
      .catch((err) => {
        toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
        this
          .manager
          .query
          .layout
          .progressOff();
      });
  }

  // 更新SQL执行结果
  updateResult(data) {
    // 1.分割数组
    const arr = data.split('\n');
    // let arr = []; _arr.map((_) => {   arr.push(antSword.noxss(_)); });
    // console.log(_arr, arr); 2.判断数据
    if (arr.length < 2) {
      return toastr.error(LANG['result']['error']['parse'], LANG_T['error']);
    };
    // 3.行头
    let header_arr = (arr[0]).replace(/,/g, '&#44;').split('\t|\t');
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
      data_arr.push(_data);
    });
    data_arr.pop();
    // 5.初始化表格
    const grid = this
      .manager
      .result
      .layout
      .attachGrid();
    grid.clearAll();
    grid.setHeader(header_arr.join(',').replace(/,$/, ''));
    grid.setColTypes("txt,".repeat(header_arr.length).replace(/,$/, ''));
    grid.setColSorting(('str,'.repeat(header_arr.length)).replace(/,$/, ''));
    grid.setColumnMinWidth(100, header_arr.length - 1);
    grid.setInitWidths(("100,".repeat(header_arr.length - 1)) + "*");
    grid.setEditable(true);
    grid.init();
    // 添加数据
    let grid_data = [];
    for (let i = 0; i < data_arr.length; i++) {
      grid_data.push({
        id: i + 1,
        data: data_arr[i]
      });
    }
    grid.parse({
      'rows': grid_data
    }, 'json');
    // 启用导出按钮
    this.manager.result.toolbar[grid_data.length > 0 ?
      'enableItem' :
      'disableItem']('dump');
  }

  // 导出查询数据
  dumpResult() {
    const grid = this
      .manager
      .result
      .layout
      .getAttachedObject();
    let filename = `${this
      .core
      .__opts__
      .ip}_${new Date()
      .format("yyyyMMddhhmmss")}.csv`;
    dialog.showSaveDialog({
      title: LANG['result']['dump']['title'],
      defaultPath: filename
    }, (filePath) => {
      if (!filePath) {
        return;
      };
      let headerStr = grid
        .hdrLabels
        .join(',');
      let dataStr = grid.serializeToCSV();
      let tempDataBuffer = Buffer.from(headerStr + '\n' + dataStr);
      fs.writeFileSync(filePath, tempDataBuffer);
      toastr.success(LANG['result']['dump']['success'], LANG_T['success']);
    });
  }

  // 禁用toolbar按钮
  disableToolbar() {
    this
      .manager
      .list
      .toolbar
      .disableItem('del');
    this
      .manager
      .list
      .toolbar
      .disableItem('edit');
    this
      .manager
      .result
      .toolbar
      .disableItem('dump');
  }

  // 启用toolbar按钮
  enableToolbar() {
    this
      .manager
      .list
      .toolbar
      .enableItem('del');
    this
      .manager
      .list
      .toolbar
      .enableItem('edit');
  }

  // 禁用SQL编辑框
  disableEditor() {
    ['exec', 'clear'].map(this.manager.query.toolbar.disableItem.bind(this.manager.query.toolbar));
    this
      .manager
      .query
      .editor
      .setReadOnly(true);
  }

  // 启用SQL编辑框
  enableEditor() {
    ['exec', 'clear'].map(this.manager.query.toolbar.enableItem.bind(this.manager.query.toolbar));
    this
      .manager
      .query
      .editor
      .setReadOnly(false);
  }

}

module.exports = ASP;