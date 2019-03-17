//
// 数据库驱动::PHP
// 支持数据库:mysql,mssql,oracle,informix
//

const LANG = antSword['language']['database'];
const LANG_T = antSword['language']['toastr'];
const dialog = antSword.remote.dialog;
const fs = require('fs');
const Decodes = antSword.Decodes;

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
          const db = new Buffer(_co[1], 'base64').toString();
          const table = new Buffer(_co[2], 'base64').toString();
          const column = new Buffer(_co[3], 'base64').toString();

          let sql = "";
          switch(this.dbconf['type']){
            case 'mssql':
            case 'sqlsrv':
              sql = `SELECT TOP 20 [${column}] FROM [${table}] ORDER BY 1 DESC;`;
              break;
            case 'oracle':
            case 'oracle_oci8':
              sql = `SELECT ${column} FROM ${db}.${table} WHERE ROWNUM < 20 ORDER BY 1`;
              break;
            case 'postgresql':
            case 'postgresql_pdo':
              sql = `SELECT ${column} FROM ${table} ORDER BY 1 DESC LIMIT 20 OFFSET 0;`;
              break;
            default:
              sql = `SELECT \`${column}\` FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`;
              break;
          }
          this.manager.query.editor.session.setValue(sql);
          break;
      }
    });
    // 5. tree右键::功能菜单
    this.tree.attachEvent('onRightClick', (id, event) => {
      this.tree.selectItem(id);
      const arr = id.split('::');
      if (arr.length < 2) { throw new Error('ID ERR: ' + id) };
      switch(arr[0]) {
        case 'conn':
          this.tree.callEvent('onClick', [id]);
          bmenu([
            {
              text: LANG['list']['menu']['adddb'],
              icon: 'fa fa-plus-circle',
              action: this.addDatabase.bind(this)
            },
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
          break;
        case 'database':
          this.tree.callEvent('onClick', [id]);
          bmenu([
            {
              text: LANG['list']['menu']['addtable'],
              icon: 'fa fa-plus-circle',
              action: this.addTable.bind(this)
            },
            {
              text: LANG['list']['menu']['adddb'],
              icon: 'fa fa-plus-circle',
              action: this.addDatabase.bind(this)
            }, {
              divider: true
            }, {
              text: LANG['list']['menu']['editdb'],
              icon: 'fa fa-edit',
              action: this.editDatabase.bind(this)
            }, {
              divider: true
            }, {
              text: LANG['list']['menu']['deldb'],
              icon: 'fa fa-remove',
              action: this.delDatabase.bind(this)
            }
          ], event);
          break;
        case 'table':
          this.tree.callEvent('onClick', [id]);
          bmenu([
            {
              text: LANG['list']['menu']['addtable'],
              icon: 'fa fa-plus-circle',
              action: this.addTable.bind(this)
            }, {
              divider: true
            }, {
              text: LANG['list']['menu']['desctable'],
              icon: 'fa fa-table',
              action: this.descTable.bind(this)
            }, {
              text: LANG['list']['menu']['showcreatetable'],
              icon: 'fa fa-info',
              action: this.showcreateTable.bind(this)
            }, {
              text: LANG['list']['menu']['edittable'],
              icon: 'fa fa-edit',
              action: this.editTable.bind(this)
            }, {
              divider: true
            }, {
              text: LANG['list']['menu']['deltable'],
              icon: 'fa fa-remove',
              action: this.delTable.bind(this)
            }
          ], event);
          break;
        case 'column':
          this.tree.callEvent('onClick', [id]);
          bmenu([
            {
              text: LANG['list']['menu']['editcolumn'],
              icon: 'fa fa-edit',
              action: this.editColumn.bind(this)
            }, {
              text: LANG['list']['menu']['delcolumn'],
              icon: 'fa fa-remove',
              action: this.delColumn.bind(this)
            },
          ], event);
          break;
      }
      // if (id.startsWith('conn::')) {
      //   this.tree.callEvent('onClick', [id]);
      //   bmenu([
      //     {
      //       text: LANG['list']['menu']['add'],
      //       icon: 'fa fa-plus-circle',
      //       action: this.addConf.bind(this)
      //     }, {
      //       divider: true
      //     }, {
      //       text: LANG['list']['menu']['edit'],
      //       icon: 'fa fa-edit',
      //       action: this.editConf.bind(this)
      //     }, {
      //       divider: true
      //     }, {
      //       text: LANG['list']['menu']['del'],
      //       icon: 'fa fa-remove',
      //       action: this.delConf.bind(this)
      //     }
      //   ], event);
      // };
    });
    // mysql column type 
    // TODO: 
    // 1. column default value
    // 2. character set
    // 3. unsigned
    this.mysqlcolumntypes = [
      "tinyint", "smallint", "mediumint", "int", "integer", "bigint", "float", "double",
      "date", "time", "year", "datetime", "timestamp",
      "char", "varchar", "tinytext", "blob", "text", "mediumblob", "mediumtext", "longblob", "longtext"
    ];
    // mysql character set mapping
    this.mysqlcsMapping = {
      'default': ['default'],
      'utf8': [
        "utf8_general_ci","utf8_bin","utf8_unicode_ci","utf8_icelandic_ci","utf8_latvian_ci","utf8_romanian_ci","utf8_slovenian_ci","utf8_polish_ci","utf8_estonian_ci","utf8_spanish_ci","utf8_swedish_ci","utf8_turkish_ci","utf8_czech_ci","utf8_danish_ci","utf8_lithuanian_ci","utf8_slovak_ci","utf8_spanish2_ci","utf8_roman_ci","utf8_persian_ci","utf8_esperanto_ci","utf8_hungarian_ci","utf8_sinhala_ci","utf8_general_mysql500_ci",
      ],
      'big5': [ "big5_chinese_ci","big5_bin"],
      'dec8': [ "dec8_swedish_ci","dec8_bin"],
      'cp850': [ "cp850_general_ci","cp850_bin"],
      'hp8': [ "hp8_general_ci","hp8_bin"],
      'koi8r': [ "koi8_general_ci","koi8_bin"],
      'latin1':[
        "latin1_german1_ci","latin1_swedish_ci","latin1_danish_ci","latin1_german2_ci","latin1_bin","latin1_general_ci","latin1_general_cs","latin1_spanish_ci"
      ],
      'latin2':[ 
        "latin2_czech_cs","latin2_general_ci","latin2_hungarian_ci","latin2_croatian_ci","latin2_bin",
      ],
      'ascii':[ "ascii_general_ci","ascii_bin" ],
      'euckr':[ "euckr_korean_ci","euckr_bin" ],
      'gb2312':[ "gb2312_chinese_ci","gb2312_bin"],
      'gbk':[ "gbk_chinese_ci","gbk_bin"],
      'utf8mb4': [
        "utf8mb4_general_ci","utf8mb4_bin","utf8mb4_unicode_ci","utf8mb4_icelandic_ci","utf8mb4_latvian_ci","utf8mb4_romanian_ci","utf8mb4_slovenian_ci","utf8mb4_polish_ci","utf8mb4_estonian_ci","utf8mb4_spanish_ci","utf8mb4_swedish_ci","utf8mb4_turkish_ci","utf8mb4_czech_ci","utf8mb4_danish_ci","utf8mb4_lithuanian_ci","utf8mb4_slovak_ci","utf8mb4_spanish2_ci","utf8mb4_roman_ci","utf8mb4_persian_ci","utf8mb4_esperanto_ci","utf8mb4_hungarian_ci","utf8mb4_sinhala_ci",
      ],
      'utf16': [
        "utf16_general_ci","utf16_bin","utf16_unicode_ci","utf16_icelandic_ci","utf16_latvian_ci","utf16_romanian_ci","utf16_slovenian_ci","utf16_polish_ci","utf16_estonian_ci","utf16_spanish_ci","utf16_swedish_ci","utf16_turkish_ci","utf16_czech_ci","utf16_danish_ci","utf16_lithuanian_ci","utf16_slovak_ci","utf16_spanish2_ci","utf16_roman_ci","utf16_persian_ci","utf16_esperanto_ci","utf16_hungarian_ci","utf16_sinhala_ci",
      ],
    };
    this.encode_mapping = {
      'mysql': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
      'mysqli': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
      'mssql': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
      'sqlsrv': ['utf-8', 'char'],
      'oracle': ['UTF8','ZHS16GBK','ZHT16BIG5','ZHS16GBKFIXED','ZHT16BIG5FIXED'],
      'oracle_oci8': ['UTF8','ZHS16GBK','ZHT16BIG5','ZHS16GBKFIXED','ZHT16BIG5FIXED'],
      'postgresql': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
      'postgresql_pdo': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
      'informix': ['utf8', 'big5', 'dec8', 'cp850', 'hp8', 'koi8r', 'latin1', 'latin2', 'ascii', 'euckr', 'gb2312', 'gbk'],
    }
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
    }, {
      type: 'separator'
    }, {
      id: 'test',
      type: 'button',
      icon: 'spinner',
      text: LANG['form']['toolbar']['test']
    }]);

    // form
    const form = win.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'combo', label: LANG['form']['type'], readonly: true, name: 'type', options: [
          { text: 'MYSQL', value: 'mysql' },
          { text: 'MYSQLI', value: 'mysqli' },
          { text: 'MSSQL', value: 'mssql' },
          { text: 'SQLSRV', value: 'sqlsrv' },
          { text: 'ORACLE', value: 'oracle' },
          { text: 'ORACLE_OCI8', value: 'oracle_oci8' },
          { text: 'PostgreSQL', value: 'postgresql' },
          { text: 'PostgreSQL_PDO', value: 'postgresql_pdo' },
          { text: 'INFORMIX', value: 'informix' }
        ] },
        { type: 'combo', label: LANG['form']['encode'], name: 'encode', options: ((c) => {
          let ret = [];
          this.encode_mapping[c].map((_)=>{
            ret.push({
              text: _,
              value: _
            });
          });
          return ret;
        })("mysql")},
        { type: 'input', label: LANG['form']['host'], name: 'host', required: true, value: 'localhost' },
        { type: 'input', label: LANG['form']['user'], name: 'user', required: true, value: 'root' },
        { type: 'input', label: LANG['form']['passwd'], name: 'passwd', value: '' }
      ]}
    ], true);

    form.attachEvent('onChange', (_, id) => {
      if (_ !== 'type') { return };
      var encodecmb = form.getCombo("encode");
      encodecmb.clearAll();
      encodecmb.setComboValue(null);
      var ret = [];
      this.encode_mapping[id].map((_)=>{
        ret.push({
          text: _,
          value: _
        });
      });
      encodecmb.addOption(ret);
      encodecmb.selectOption(0);
      switch(id) {
        case 'mysql':
        case 'mysqli':
          form.setFormData({
            host: 'localhost:3306',
            user: 'root',
            passwd: ''
          });
          break;
        case 'mssql':
          form.setFormData({
            host: 'localhost,1433',
            user: 'sa',
            passwd: ''
          });
          break;
        case 'sqlsrv':
          form.setFormData({
            host: 'localhost',
            user: 'sa',
            passwd: ''
          });
          break;
        case 'oracle_oci8':
          form.setFormData({
            host: 'localhost/orcl',
            user: '',
            passwd: '',
          })
          break;
        case 'postgresql':
        case 'postgresql_pdo':
          form.setFormData({
            host: 'localhost:5432',
            user: 'postgres',
            passwd: '',
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
        case 'test':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let _data = form.getValues();
          win.progressOn();
          this.core.request(
            this.core[`database_${_data['type']}`].show_databases({
              host: _data['host'],
              user: _data['user'],
              passwd: _data['passwd']
            })
          ).then((res) => {
            if(res['text'].length > 0){
              if(res['text'].indexOf("ERROR://") > -1) {
                throw res["text"];
              }
              toastr.success(LANG['form']['test_success'], LANG_T['success']);
            }else{
              toastr.warning(LANG['form']['test_warning'], LANG_T['warning']);
            }
            win.progressOff();
          }).catch((err)=>{
            win.progressOff();
            toastr.error(JSON.stringify(err), LANG_T['error']);
          });
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
    }, {
      type: 'separator'
    }, {
      id: 'test',
      type: 'button',
      icon: 'spinner',
      text: LANG['form']['toolbar']['test']
    }]);

    // form
    const form = win.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'combo', label: LANG['form']['type'], readonly: true, name: 'type', options: [
          { text: 'MYSQL', value: 'mysql', selected: conf['type'] === 'mysql' },
          { text: 'MYSQLI', value: 'mysqli', selected: conf['type'] === 'mysqli' },
          { text: 'MSSQL', value: 'mssql', selected: conf['type'] === 'mssql' },
          { text: 'SQLSRV', value: 'sqlsrv', selected: conf['type'] === 'sqlsrv' },
          { text: 'ORACLE', value: 'oracle', selected: conf['type'] === 'oracle' },
          { text: 'ORACLE_OCI8', value: 'oracle_oci8', selected: conf['type'] === 'oracle_oci8' },
          { text: 'PostgreSQL', value: 'postgresql', selected: conf['type'] === 'postgresql' },
          { text: 'PostgreSQL_PDO', value: 'postgresql_pdo', selected: conf['type'] === 'postgresql_pdo' },
          { text: 'INFORMIX', value: 'informix', selected: conf['type'] === 'informix' }
        ] },
        { type: 'combo', label: LANG['form']['encode'], name: 'encode', options: ((c) => {
          let ret = [];
          this.encode_mapping[c].map((_)=>{
            ret.push({
              text: _,
              value: _,
              selected: conf['encode'] === _
            });
          });
          return ret;
        })(conf["type"])},
        { type: 'input', label: LANG['form']['host'], name: 'host', required: true, value: conf['host'] },
        { type: 'input', label: LANG['form']['user'], name: 'user', required: true, value: conf['user'] },
        { type: 'input', label: LANG['form']['passwd'], name: 'passwd', value: conf['passwd'] }
      ]}
    ], true);

    form.attachEvent('onChange', (_, id, state) => {
      if (_ == 'type') {
        var encodecmb = form.getCombo("encode");
        encodecmb.clearAll();
        encodecmb.setComboValue(null);
        var ret = [];
        this.encode_mapping[id].map((_)=>{
          ret.push({
            text: _,
            value: _,
            selected: conf['encode'] === _
          });
        });
        encodecmb.addOption(ret);
        encodecmb.selectOption(this.encode_mapping[id].indexOf(conf['encode']) == -1 ? 0 : this.encode_mapping[id].indexOf(conf['encode']));
        switch(id) {
          case 'mysql':
          case 'mysqli':
            form.setFormData({
              // encode: conf['encode'],
              user: conf['user'],
              passwd: conf['passwd']
            });
            break;
          case 'mssql':
            form.setFormData({
              // encode: conf['encode'],
              user: conf['user'],
              passwd: conf['passwd']
            });
            break;
          default:
            form.setFormData({
              // encode: conf['encode'],
              user: conf['user'],
              passwd: conf['passwd']
            });
        }
      };
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
        case 'test':
          if (!form.validate()) {
            return toastr.warning(LANG['form']['warning'], LANG_T['warning']);
          };
          // 解析数据
          let _data = form.getValues();
          win.progressOn();
          this.core.request(
            this.core[`database_${_data['type']}`].show_databases({
              host: _data['host'],
              user: _data['user'],
              passwd: _data['passwd']
            })
          ).then((res) => {
            if(res['text'].length > 0){
              if(res['text'].indexOf("ERROR://") > -1) {
                throw res["text"];
              }
              toastr.success(LANG['form']['test_success'], LANG_T['success']);
            }else{
              toastr.warning(LANG['form']['test_warning'], LANG_T['warning']);
            }
            win.progressOff();
          }).catch((err)=>{
            win.progressOff();
            toastr.error(JSON.stringify(err), LANG_T['error']);
          });
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

  // 新增数据库
  addDatabase() {
    const id = this.tree.getSelected().split('::')[1].split(":")[0];
    // // 获取配置
    // const conf = antSword['ipcRenderer'].sendSync('shell-getDataConf', {
    //   _id: this.manager.opt['_id'],
    //   id: id
    // });
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    switch(this.dbconf['type']){
    case "mysqli":
    case "mysql":
      // 创建窗口
      const win = this.manager.win.createWindow(hash, 0, 0, 450, 200);
      win.setText(LANG['form']['adddb']['title']);
      win.centerOnScreen();
      win.button('minmax').hide();
      win.setModal(true);
      win.denyResize();
      // form
      const form = win.attachForm([
        { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
        { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
          { type: 'input', label: LANG['form']['adddb']['dbname'], name: 'dbname', value: "", required: true, validate:"ValidAplhaNumeric",},
          { type: 'combo', label: LANG['form']['adddb']['characterset'], readonly:true, name: 'characterset', options: (() => {
            let ret = [];
            Object.keys(this.mysqlcsMapping).map((_) => {
              ret.push({
                text: _,
                value: _,
              });
            })
            return ret;
          })() },
          { type: 'combo', label: LANG['form']['adddb']['charactercollation'], readonly:true, name: 'charactercollation', options: ((c)=>{
            let ret = [];
            this.mysqlcsMapping[c].map((_)=>{
              ret.push({
                text: _,
                value: _,
              });
            });
            return ret;
          })("default")},
          { type: "block", name:"btnblock", className:"display: flex;flex-direction: row;align-items: right;",offsetLeft:150, list:[
            { type:"button" , name:"createbtn", value: `<i class="fa fa-plus"></i> ${LANG['form']['adddb']['createbtn']}`},
            {type: 'newcolumn', offset:20},
            { type:"button" , name:"cancelbtn", value: `<i class="fa fa-ban"></i> ${LANG['form']['adddb']['cancelbtn']}`},
          ]}
        ]}
      ], true);
      form.enableLiveValidation(true);
      // combo 联动
      form.attachEvent("onChange",(_, id)=>{
        if (_ == "characterset") {
          let collcombo = form.getCombo("charactercollation");
          collcombo.clearAll();
          collcombo.setComboValue(null);
          let ret = [];
          this.mysqlcsMapping[id].map((_)=>{
            ret.push({
              text: _,
              value: _,
            });
          });
          collcombo.addOption(ret);
          collcombo.selectOption(0);
        }
      });
      
      form.attachEvent("onButtonClick", (btnid)=>{
        switch(btnid){
        case "createbtn":
          if(form.validate()==false){break;}
          let formvals = form.getValues();
          let charset = formvals['characterset']=='default'? "": `DEFAULT CHARSET ${formvals['characterset']} COLLATE ${formvals['charactercollation']}`;
          let sql = `CREATE DATABASE IF NOT EXISTS ${formvals['dbname']} ${charset};`
          this.execSQLAsync(sql, (res, err)=>{
            if(err){
              toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
              return;
            }
            let data = res['text'];
            let arr = data.split('\n');
            if (arr.length < 2) {
              return toastr.error(LANG['result']['error']['parse'], LANG_T['error']);
            };
            if(arr[1].indexOf("VHJ1ZQ==")!= -1){
              // 操作成功
              toastr.success(LANG['form']['adddb']['success'] ,LANG_T['success']);
              win.close();
              // refresh
              this.getDatabases(id);
              return
            }
            toastr.error(LANG['form']['adddb']['error'], LANG_T['error']);
            return
          });
          // 创建
          break
        case "cancelbtn":
          win.close();
          break;
        }
      });
      break;
    default:
      toastr.warning(LANG['notsupport'], LANG_T['warning']);
      break;
    }
  }

  editDatabase() {
    // 获取配置
    const id = this.tree.getSelected().split('::')[1].split(":")[0];
    let dbname = new Buffer(this.tree.getSelected().split('::')[1].split(":")[1],"base64").toString();
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    switch(this.dbconf['type']){
    case "mysqli":
    case "mysql":
      let sql = `SELECT SCHEMA_NAME,DEFAULT_CHARACTER_SET_NAME,DEFAULT_COLLATION_NAME FROM \`information_schema\`.\`SCHEMATA\` where \`SCHEMA_NAME\`="${dbname}";`
      this.execSQLAsync(sql, (res, err)=>{
        if(err){
          toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
          return;
        }
        let result = this.parseResult(res['text']);
        dbname = result.datas[0][0]
        let characterset = result.datas[0][1] || "default"
        let collation = result.datas[0][2] || "default"
        // 创建窗口
        const win = this.manager.win.createWindow(hash, 0, 0, 450, 200);
        win.setText(LANG['form']['editdb']['title']);
        win.centerOnScreen();
        win.button('minmax').hide();
        win.setModal(true);
        win.denyResize();
        // form
        const form = win.attachForm([
          { type: 'settings', position: 'label-left', labelWidth: 90, inputWidth: 250 },
          { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
            { type: 'input', label: LANG['form']['editdb']['dbname'], name: 'dbname', readonly: true, value: dbname, required: true, validate:"ValidAplhaNumeric",},
            { type: 'combo', label: LANG['form']['editdb']['characterset'], readonly:true, name: 'characterset', options: (() => {
              let ret = [];
              Object.keys(this.mysqlcsMapping).map((_) => {
                ret.push({
                  text: _,
                  value: _,
                });
              })
              return ret;
            })() },
            { type: 'combo', label: LANG['form']['editdb']['charactercollation'], readonly:true, name: 'charactercollation', options: ((c)=>{
              let ret = [];
              this.mysqlcsMapping[c].map((_)=>{
                ret.push({
                  text: _,
                  value: _,
                });
              });
              return ret;
            })("default")},
            { type: "block", name:"btnblock", className:"display: flex;flex-direction: row;align-items: right;",offsetLeft:150, list:[
              { type:"button" , name:"updatebtn", value: `<i class="fa fa-pen"></i> ${LANG['form']['editdb']['updatebtn']}`},
              {type: 'newcolumn', offset:20},
              { type:"button" , name:"cancelbtn", value: `<i class="fa fa-ban"></i> ${LANG['form']['editdb']['cancelbtn']}`},
            ]}
          ]}
        ], true);
        form.enableLiveValidation(true);
        // combo 联动
        form.attachEvent("onChange",(_, id)=>{
          if (_ == "characterset") {
            let collcombo = form.getCombo("charactercollation");
            collcombo.clearAll();
            collcombo.setComboValue(null);
            let ret = [];
            this.mysqlcsMapping[id].map((_)=>{
              ret.push({
                text: _,
                value: _,
              });
            });
            collcombo.addOption(ret);
            collcombo.selectOption(0);
          }
        });
        
        let cscombo = form.getCombo("characterset");
        cscombo.selectOption(Object.keys(this.mysqlcsMapping).indexOf(characterset));
        let collcombo = form.getCombo("charactercollation");
        collcombo.selectOption(this.mysqlcsMapping[characterset].indexOf(collation));

        form.attachEvent("onButtonClick", (btnid)=>{
          switch(btnid){
          case "updatebtn":
            if(form.validate()==false){break;}
            let formvals = form.getValues();
            let charset = formvals['characterset']=='default'? "": `DEFAULT CHARSET ${formvals['characterset']} COLLATE ${formvals['charactercollation']}`;
            let sql = `ALTER DATABASE ${dbname} ${charset};`
            this.execSQLAsync(sql, (res, err)=>{
              if(err){
                toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
                return;
              }
              let data = res['text'];
              let arr = data.split('\n');
              if (arr.length < 2) {
                return toastr.error(LANG['result']['error']['parse'], LANG_T['error']);
              };
              if(arr[1].indexOf("VHJ1ZQ==")!= -1){
                // 操作成功
                toastr.success(LANG['form']['editdb']['success'] ,LANG_T['success']);
                win.close();
                // refresh
                this.getDatabases(id);
                return
              }
              toastr.error(LANG['form']['editdb']['error'], LANG_T['error']);
              return
            });
            // 修改
            break
          case "cancelbtn":
            win.close();
            break;
          }
        });
      });
      break;
    default:
      toastr.warning(LANG['notsupport'], LANG_T['warning']);
      break;
    }
  }

  delDatabase() {
    // 获取配置
    const id = this.tree.getSelected().split('::')[1].split(":")[0];
    let dbname = new Buffer(this.tree.getSelected().split('::')[1].split(":")[1],"base64").toString();
    layer.confirm(LANG['form']['deldb']['confirm'](dbname), {
      icon: 2, shift: 6,
      title: LANG['form']['deldb']['title']
    }, (_) => {
      layer.close(_);
      switch(this.dbconf['type']){
      case "mysqli":
      case "mysql":
        let sql = `drop database ${dbname};`
        this.execSQLAsync(sql, (res, err) => {
          if(err){
            toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
            return;
          }
          let result = this.parseResult(res['text']);
          if(result.datas[0][0]=='True'){
            toastr.success(LANG['form']['deldb']['success'], LANG_T['success']);
            this.getDatabases(id);
          }else{
            toastr.error(LANG['form']['deldb']['error'], LANG_T['error']);
          }
        });
        break;
      default:
        toastr.warning(LANG['notsupport'], LANG_T['warning']);
        break;
      }
    });
  }
  
  // 新增表
  addTable() {
    // 获取配置
    const id = this.tree.getSelected().split('::')[1].split(":")[0];
    let dbname = new Buffer(this.tree.getSelected().split('::')[1].split(":")[1],"base64").toString();
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    switch(this.dbconf['type']){
    case "mysqli":
    case "mysql":
//       let sql = `CREATE TABLE IF NOT EXISTS \`table_name\` (
//   \`id\` INT UNSIGNED AUTO_INCREMENT,
//   \`title\` VARCHAR(100) NOT NULL,
//   PRIMARY KEY ( \`id\` )
// );`;
//       this.manager.query.editor.session.setValue(sql);
      const win = this.manager.win.createWindow(hash, 0, 0, 600, 400);
      win.setText(LANG['form']['addtable']['title']);
      win.centerOnScreen();
      win.button('minmax').hide();
      win.setModal(true);
      win.denyResize();
      const toolbar = win.attachToolbar();
      toolbar.loadStruct([{
        id: 'add',
        type: 'button',
        icon: 'plus-circle',
        text: LANG['form']['addtable']['add'],
      }, {
        type: 'separator'
      }, {
        id: 'delete',
        type: 'button',
        icon: 'remove',
        text: LANG['form']['addtable']['delete']
      },{
        id: 'save',
        type: 'button',
        icon: 'save',
        text: LANG['form']['addtable']['save']
      }]);
      dhtmlxValidation.hasOwnProperty("isValidPositiveInteger") ? "" : dhtmlxValidation.isValidPositiveInteger = (a) => { return !!a.toString().match(/(^\d+$)/);}

      const grid=win.attachGrid();
      grid.clearAll();
      // Name,Type,Length,Not Null,Key,Auto Increment
      grid.setHeader(LANG['form']['addtable']['gridheader']);
      grid.setInitWidths('*,100,80,80,50,130');
      grid.setColTypes("ed,co,edn,acheck,acheck,acheck");
      grid.setColValidators(["ValidAplhaNumeric","NotEmpty","ValidPositiveInteger","ValidBoolean","ValidBoolean","ValidBoolean"]);
      grid.setEditable(true);
      const combobox = grid.getCombo(1);
      this.mysqlcolumntypes.forEach(v => {
        combobox.put(v, v);
      });
      grid.enableEditEvents(false,true,true);
      grid.enableEditTabOnly(true);
      grid.init();
      grid.clearAll();
      
      grid.attachEvent("onCheck", (rId,cInd,state) => {
        if(state == true){
          switch(cInd){
            case 4:
              let c3 = grid.cells(rId, 3);
              c3.setChecked(true);
            break;
          }
        }
      });

      // grid.attachEvent("onValidationError", (rid,index,value,rule)=>{
      //   // toolbar.disableItem('save');
      //   let idx = grid.getRowIndex(rid);
      //   // grid.editStop();
      //   grid.selectCell(idx, index);
      //   grid.editCell();
      //   return true;
      // });

      toolbar.attachEvent('onClick',(tbid)=>{
        switch(tbid){
          case "add":
            let ncid = (+new Date * Math.random()).toString(16).substr(2, 8);
            grid.addRow(ncid, ",,0,0,0,0");
            let idx = grid.getRowIndex(ncid);
            grid.selectCell(idx, 0);
            grid.editCell();
          break;
          case "delete":
            var ncids = grid.getSelectedId();
            if(!ncids){
              toastr.warning(LANG['form']['addtable']['delete_not_select'], LANG_T['warning']);
              return
            }
            let _ncids = ncids.split(",");
            _ncids.map(_=>{
              grid.deleteRow(_);
            });
          break;
          case "save":
            let rids = grid.getAllRowIds();
            if(!rids){
              toastr.warning(LANG['form']['addtable']['save_row_is_null'], LANG_T['warning']);
              return
            }

            let _rids = rids.split(",");
            let bdstr = "";
            let pkstr = "";
            for(var i=0; i< _rids.length;i++){
              let cvalarr = [];
              for(var j=0; j<6;j++){
                if(grid.validateCell(_rids[i], j) == false){
                  toastr.error(LANG['form']['addtable']['cell_valid_error'](i,j), LANG_T['error']);
                  grid.selectCell(_rids[i], j);
                  grid.editCell();
                  return
                }
                var c = grid.cells(_rids[i], j);
                cvalarr[j] = c.getValue();
              }
              let lenstr = "";
              let auto_inc_str = "";
              switch(cvalarr[1]){
                case "varchar":
                case "varbinary":
                  if(cvalarr[2] == "0"){
                    lenstr = `(255)`;
                  }else{
                    lenstr = `(${cvalarr[2]})`;
                  }
                  break;
                case "int":
                case "integer":
                  if(cvalarr[5] == "1"){
                    auto_inc_str = "AUTO_INCREMENT";
                  }
                  break;
                default:
                  break;
              }
              let notnull = cvalarr[4] == "1" ? `NOT NULL` : (cvalarr[3] == "0" ? "": `NOT NULL`);
              pkstr += cvalarr[4] == "0"? "": `\`${cvalarr[0]}\`,`;
              bdstr += `\t\`${cvalarr[0]}\` ${cvalarr[1]}${lenstr} ${notnull} ${auto_inc_str},\n`;
            }
            layer.prompt({
              value: "",
              title: `<i class="fa fa-file-code-o"></i> ${LANG['form']['addtable']['confirmtitle']}`
            },(value, i, e) => {
              if(!value.match(/^[a-zA-Z0-9_]+$/)){
                toastr.error(LANG['form']['addtable']['invalid_tablename'], LANG_T['error']);
                return
              }
              layer.close(i);
              let pkres = pkstr.length > 0 ? `\tPRIMARY KEY ( ${pkstr.substr(0, pkstr.length-1)} )` : "";

              if(pkres.length == 0) {
                bdstr = bdstr.slice(0, bdstr.lastIndexOf(","));
              }
              let rsql = `CREATE TABLE IF NOT EXISTS \`${value}\` (\n${bdstr}\n${pkres}\n);`;
              this.manager.query.editor.session.setValue(rsql);
              this.execSQLAsync(rsql, (res, err) => {
                if(err){
                  toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
                  return;
                }
                let result = this.parseResult(res['text']);
                if(result.datas[0][0]=='True'){
                  toastr.success(LANG['form']['addtable']['success'],LANG_T['success']);
                  this.getTables(id,dbname);
                  win.close();
                }else{
                  toastr.error(LANG['form']['addtable']['error'], LANG_T['error']);
                }
              });
            });
          break;
        }
      });
      break;
    default:
      toastr.warning(LANG['notsupport'], LANG_T['warning']);
      break;
    }
  }

  // 修改表名
  editTable() {
    // 获取配置
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    // const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    layer.prompt({
      value: tablename,
      title: `<i class="fa fa-file-code-o"></i> ${LANG['form']['edittable']['title']}`
    },(value, i, e) => {
      if(!value.match(/^[a-zA-Z0-9_]+$/)){
        toastr.error(LANG['form']['edittable']['invalid_tablename'], LANG_T['error']);
        return
      }
      layer.close(i);
      switch(this.dbconf['type']){
        case "mysqli":
        case "mysql":
          let sql = `RENAME TABLE \`${dbname}\`.\`${tablename}\` TO \`${dbname}\`.\`${value}\`;`;
          this.execSQLAsync(sql, (res, err) => {
            if(err){
              toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
              return;
            }
            let result = this.parseResult(res['text']);
            if(result.datas[0][0]=='True'){
              toastr.success(LANG['form']['edittable']['success'],LANG_T['success']);
              this.getTables(id,dbname);
            }else{
              toastr.error(LANG['form']['edittable']['error'],LANG_T['error']);
            }
          });
          break;
        default:
          toastr.warning(LANG['notsupport'], LANG_T['warning']);
          break;
      }
    });
    
  }

  delTable() {
    // 获取配置
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    layer.confirm(LANG['form']['deltable']['confirm'](tablename), {
      icon: 2, shift: 6,
      title: LANG['form']['deltable']['title']
    }, (_) => {
      layer.close(_);
      switch(this.dbconf['type']){
      case "mysqli":
      case "mysql":
        let sql = `DROP TABLE \`${dbname}\`.\`${tablename}\`;`;
        this.execSQLAsync(sql, (res, err) => {
          if(err){
            toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
            return;
          }
          let result = this.parseResult(res['text']);
          if(result.datas[0][0]=='True'){
            toastr.success(LANG['form']['deltable']['success'],LANG_T['success']);
            this.getTables(id,dbname);
          }else{
            toastr.error(LANG['form']['deltable']['error'],LANG_T['error']);
          }
        });
        break;
      default:
        toastr.warning(LANG['notsupport'], LANG_T['warning']);
        break;
      }
    });
  }
  // 显示表结构
  descTable() {
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    switch(this.dbconf['type']){
      case "mysqli":
      case "mysql":
        let sql = `DESC \`${dbname}\`.\`${tablename}\`;`;
        this.manager.query.editor.session.setValue(sql);
        this.execSQL(sql);
        break;
      default:
        toastr.warning(LANG['notsupport'], LANG_T['warning']);
        break;
      }
  }

  showcreateTable() {
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    switch(this.dbconf['type']){
      case "mysqli":
      case "mysql":
        let sql = `SHOW CREATE TABLE \`${dbname}\`.\`${tablename}\`;`;
        this.manager.query.editor.session.setValue(sql);
        this.execSQL(sql);
        break;
      default:
        toastr.warning(LANG['notsupport'], LANG_T['warning']);
        break;
      }
  }

  // TODO: 新增列
  addColumn() {
    // 获取配置
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    let columnname = new Buffer(treeselect.split('::')[1].split(":")[3],"base64").toString();
    
  }

  // TODO: 编辑列
  editColumn() {
    // 获取配置
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    let columnname = new Buffer(treeselect.split('::')[1].split(":")[3],"base64").toString();
    let columntyperaw = this.tree.getSelectedItemText();
    let columntype = null;
    var ctypereg = new RegExp(columnname+'\\s\\((.+?\\))\\)');
    var res = columntyperaw.match(ctypereg);
    if (res.length == 2) {
      columntype = res[1];
    }
    if (columntype == null) {
      toastr.error(LANG['form']['editcolumn']['get_column_type_error'], LANG_T['error']);
      return
    }
    layer.prompt({
      value: columnname,
      title: `<i class="fa fa-file-code-o"></i> ${LANG['form']['editcolumn']['title']}`
    },(value, i, e) => {
      if(!value.match(/^[a-zA-Z0-9_]+$/)){
        toastr.error(LANG['form']['editcolumn']['invalid_tablename'], LANG_T['error']);
        return
      }
      layer.close(i);
      switch(this.dbconf['type']){
        case "mysqli":
        case "mysql":
          let sql = `ALTER TABLE \`${dbname}\`.\`${tablename}\` CHANGE COLUMN \`${columnname}\` \`${value}\` ${columntype};`;
          this.manager.query.editor.session.setValue(sql);
          this.execSQLAsync(sql, (res, err) => {
            if(err){
              toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
              return;
            }
            let result = this.parseResult(res['text']);
            if(result.datas[0][0]=='True'){
              toastr.success(LANG['form']['editcolumn']['success'],LANG_T['success']);
              this.getColumns(id,dbname,tablename);
            }else{
              toastr.error(LANG['form']['editcolumn']['error'],LANG_T['error']);
            }
          });
          break;
        default:
          toastr.warning(LANG['notsupport'], LANG_T['warning']);
          break;
      }
    });
  }

  delColumn() {
    // 获取配置
    const treeselect = this.tree.getSelected();
    const id = treeselect.split('::')[1].split(":")[0];
    let dbname = new Buffer(treeselect.split('::')[1].split(":")[1],"base64").toString();
    let tablename = new Buffer(treeselect.split('::')[1].split(":")[2],"base64").toString();
    let columnname = new Buffer(treeselect.split('::')[1].split(":")[3],"base64").toString();
    layer.confirm(LANG['form']['delcolumn']['confirm'](columnname), {
      icon: 2, shift: 6,
      title: LANG['form']['delcolumn']['title']
    }, (_) => {
      layer.close(_);
      switch(this.dbconf['type']){
      case "mysqli":
      case "mysql":
        let sql = `ALTER TABLE \`${dbname}\`.\`${tablename}\` DROP ${columnname};`;
        this.execSQLAsync(sql, (res, err) => {
          if(err){
            toastr.error(LANG['result']['error']['query'](err['status'] || JSON.stringify(err)), LANG_T['error']);
            return;
          }
          let result = this.parseResult(res['text']);
          if(result.datas[0][0]=='True'){
            toastr.success(LANG['form']['delcolumn']['success'],LANG_T['success']);
            this.getColumns(id,dbname, tablename);
          }else{
            toastr.error(LANG['form']['delcolumn']['error'],LANG_T['error']);
          }
        });
        break;
      default:
        toastr.warning(LANG['notsupport'], LANG_T['warning']);
        break;
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
      if(ret.indexOf("ERROR://") > -1) {
        throw ret;
      }
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
      if(ret.indexOf("ERROR://") > -1) {
        throw ret;
      }
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
      if(ret.indexOf("ERROR://") > -1) {
        throw ret;
      }
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
      let presql = "";
      switch(this.dbconf['type']){
        case 'mssql':
        case 'sqlsrv':
          presql = `SELECT TOP 20 * from [${table}] ORDER BY 1 DESC;`;
          break;
        case 'oracle':
        case 'oracle_oci8':
          presql = `SELECT * FROM ${db}.${table} WHERE ROWNUM < 20 ORDER BY 1`;
          break;
        case 'postgresql':
        case 'postgresql_pdo':
          presql = `SELECT * FROM ${table} ORDER BY 1 DESC LIMIT 20 OFFSET 0;`;
          break;
        default:
          presql = `SELECT * FROM \`${table}\` ORDER BY 1 DESC LIMIT 0,20;`;
          break;
      }
      this.manager.query.editor.session.setValue(presql);
      this.manager.list.layout.progressOff();
    }).catch((err) => {
      toastr.error(LANG['result']['error']['column'](err['status'] || JSON.stringify(err)), LANG_T['error']);
      this.manager.list.layout.progressOff();
    });
  }

  // 执行SQL
  execSQLAsync(sql, callback) {
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
      callback(res, null);
    }).catch((err) => {
      callback(null, err);
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

  parseResult(data) {
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
        let buff = new Buffer(_data[i], "base64");
        let encoding = Decodes.detectEncoding(buff, {defaultEncoding: "unknown"});
        if(encoding == "unknown") {
          switch(this.dbconf['type']){
            case 'sqlsrv':
              var sqlsrv_conncs_mapping = {
                'utf-8': 'utf8',
                'char': '',
              }
              encoding = sqlsrv_conncs_mapping[this.dbconf['encode']] || '';
              break;
            case 'oracle_oci8':
              var oci8_characterset_mapping = {
                'UTF8': 'utf8',
                'ZHS16GBK':'gbk',
                'ZHT16BIG5': 'big5',
                'ZHS16GBKFIXED': 'gbk',
                'ZHT16BIG5FIXED': 'big5', 
              }
              encoding = oci8_characterset_mapping[this.dbconf['encode']] || '';
              break;
            default:
              encoding = this.dbconf['encode'] || '';
              break;
          }
        }
        encoding = encoding != "" ? encoding : this.opt.core.__opts__['encode'];
        let text = Decodes.decode(buff, encoding);
      	_data[i] = antSword.noxss(text);
      }
      data_arr.push(_data);
    });
    data_arr.pop();
    return {
      headers: header_arr,
      datas: data_arr
    }
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
        // _data[i] = antSword.noxss(new Buffer(_data[i], "base64").toString(), false);
        let buff = new Buffer(_data[i], "base64");
        let encoding = Decodes.detectEncoding(buff, {defaultEncoding: "unknown"});
        if(encoding == "unknown") {
          switch(this.dbconf['type']){
            case 'sqlsrv':
              var sqlsrv_conncs_mapping = {
                'utf-8': 'utf8',
                'char': '',
              }
              encoding = sqlsrv_conncs_mapping[this.dbconf['encode']] || '';
              break;
            case 'oracle_oci8':
              var oci8_characterset_mapping = {
                'UTF8': 'utf8',
                'ZHS16GBK':'gbk',
                'ZHT16BIG5': 'big5',
                'ZHS16GBKFIXED': 'gbk',
                'ZHT16BIG5FIXED': 'big5', 
              }
              encoding = oci8_characterset_mapping[this.dbconf['encode']] || '';
              break;
            default:
              encoding = this.dbconf['encode'] || '';
              break;
          }
        }
        encoding = encoding != "" ? encoding : this.opt.core.__opts__['encode'];
        let text = Decodes.decode(buff, encoding);
      	_data[i] = antSword.noxss(text, false);
      }
      data_arr.push(_data);
    });
    data_arr.pop();
    // 5.初始化表格
    const grid = this.manager.result.layout.attachGrid();
    grid.clearAll();
    grid.setHeader(header_arr.join(',').replace(/,$/, ''));
    grid.setColTypes("txt,".repeat(header_arr.length).replace(/,$/,''));
    grid.setColSorting(('str,'.repeat(header_arr.length)).replace(/,$/, ''));
    grid.setColumnMinWidth(100, header_arr.length-1);
    grid.setInitWidths(("100,".repeat(header_arr.length-1)) + "*");
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
    this.manager.result.toolbar[grid_data.length > 0 ? 'enableItem' : 'disableItem']('dump');
  }
  
  // 导出查询数据
  dumpResult() {
    const grid = this.manager.result.layout.getAttachedObject();
    let filename = `${this.core.__opts__.ip}_${new Date().format("yyyyMMddhhmmss")}.csv`;
    dialog.showSaveDialog({
      title: LANG['result']['dump']['title'],
      defaultPath: filename
    },(filePath) => {
      if (!filePath) { return; };
      let headerStr = grid.hdrLabels.join(',');
      let dataStr = grid.serializeToCSV();
      let tempDataBuffer = new Buffer(headerStr+'\n'+dataStr);
      fs.writeFileSync(filePath, tempDataBuffer);
      toastr.success(LANG['result']['dump']['success'], LANG_T['success']);
    });
  }
  // 禁用toolbar按钮
  disableToolbar() {
    this.manager.list.toolbar.disableItem('del');
    this.manager.list.toolbar.disableItem('edit');
    this.manager.result.toolbar.disableItem('dump');
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
