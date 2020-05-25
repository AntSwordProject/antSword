/**
 * 设置中心::默认设置
 */

const LANG = antSword['language']['settings']['adefault'];
const LANG_T = antSword['language']['toastr'];

class ADefault {

  constructor(sidebar) {
    var self = this;
    sidebar.addItem({
      id: 'adefault',
      text: `<i class="fa fa-sliders"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('adefault');
    const default_config = {
      filemanager: {
        openfileintab: false,
        bookmarks: {}
      },
      database: {
        bookmarks: {}
      },
      shellmanager: {
        headers: {},
        bodys: {},
        others: {
          "ignore-https": 0,
          "use-random-variable": 0,
          "request-timeout": '10000',
          "random-Prefix": '2'
        }
      },
      terminal: {
        tsize: 1,
      }
    };
    // 读取配置
    const filemanager_settings = JSON.parse(antSword['storage']("adefault_filemanager", false, JSON.stringify(default_config.filemanager)));
    this.filemanager_settings = filemanager_settings;
    if (!this.filemanager_settings.bookmarks) {
      this.filemanager_settings.bookmarks = default_config.filemanager.bookmarks;
    }

    const database_settings = JSON.parse(antSword['storage']("adefault_database", false, JSON.stringify(default_config.database)));
    this.database_settings = database_settings;
    if (!this.database_settings.bookmarks) {
      this.database_settings.bookmarks = default_config.database.bookmarks;
    }

    const shellmanager_settings = JSON.parse(antSword['storage']("adefault_shellmanager", false, JSON.stringify(default_config.shellmanager)));
    this.shellmanager_settings = shellmanager_settings;
    if (!this.shellmanager_settings.headers) {
      this.shellmanager_settings.headers = default_config.shellmanager.headers;
    }
    if (!this.shellmanager_settings.bodys) {
      this.shellmanager_settings.bodys = default_config.shellmanager.bodys;
    }
    if (!this.shellmanager_settings.others) {
      this.shellmanager_settings.others = default_config.shellmanager.others;
    }

    const terminal_settings = JSON.parse(antSword['storage']("adefault_terminal", false, JSON.stringify(default_config.terminal)));
    this.terminal_settings = terminal_settings;

    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([{
      id: 'save',
      type: 'button',
      text: LANG['toolbar']['save'],
      icon: 'save'
    }]);
    // 表单
    const form = cell.attachForm([{
      type: 'block',
      name: 'filemanager',
      list: [
        // {type: "label", label: LANG['filemanager']['title']},
        {
          type: "fieldset",
          label: `<i class="fa fa-folder"></i> ${LANG['filemanager']['title']}`,
          list: [{
              type: "block",
              list: [{
                type: "label",
                label: LANG['filemanager']['openfileintab']['title']
              }, {
                type: 'newcolumn',
                offset: 20
              }, {
                type: "radio",
                label: LANG['filemanager']['openfileintab']['window'],
                name: 'openfileintab',
                checked: filemanager_settings.openfileintab == false,
                position: "label-right",
                value: false
              }, {
                type: 'newcolumn',
                offset: 20
              }, {
                type: "radio",
                label: LANG['filemanager']['openfileintab']['tab'],
                name: 'openfileintab',
                checked: filemanager_settings.openfileintab == true,
                position: "label-right",
                value: true
              }]
            },
            // 后续文件管理其它设置
            {
              type: 'block',
              list: [{
                type: 'label',
                label: LANG['filemanager']['bookmark']['title']
              }, {
                type: 'container',
                name: 'filemanager_bookmarks',
                inputWidth: 600,
                inputHeight: 200
              }]
            }
          ]
        }, {
          type: 'fieldset',
          label: `<i class="fa fa-database"></i> ${LANG['database']['title']}`,
          list: [{
            type: 'block',
            list: [{
              type: 'label',
              label: `${LANG['database']['bookmark']['title']}`
            }, {
              type: 'container',
              name: 'database_bookmarks',
              inputWidth: 600,
              inputHeight: 200
            }]
          }]
        }, {
          type: 'fieldset',
          label: `<i class="fa fa-th-large"></i> ${LANG['shellmanager']['title']}`,
          list: [{
            type: 'block',
            list: [{
              type: 'checkbox',
              position: 'label-right',
              name: 'shellmanager_ignore-https',
              label: LANG['shellmanager']['other']['nohttps'],
              checked: self.shellmanager_settings.others['ignore-https'] === 1
            }, {
              type: 'checkbox',
              position: 'label-right',
              name: 'shellmanager_use-random-variable',
              label: LANG['shellmanager']['other']['userandomvariable'],
              checked: self.shellmanager_settings.others['use-random-variable'] === 1
            }, {
              type: "label",
              label: LANG['shellmanager']['other']['requestTimeout']
            }, {
              type: "combo",
              position: 'label-right',
              label: '/ms',
              inputWidth: 100,
              name: "shellmanager_request-timeout",
              options: ((items) => {
                let ret = [];
                // 如果自定义的路径不在items里，则++
                if (items.indexOf(self.shellmanager_settings.others['request-timeout']) === -1) {
                  items.unshift(self.shellmanager_settings.others['request-timeout']);
                }
                items.map((_) => {
                  ret.push({
                    text: _,
                    value: _,
                    selected: self.shellmanager_settings.others['request-timeout'] === _
                  })
                });
                return ret;
              })(['5000', '10000', '30000', '60000'])
            }, {
              type: 'label',
              label: LANG['shellmanager']['header']['title']
            }, {
              type: 'container',
              name: 'shellmanager_headers',
              inputWidth: 600,
              inputHeight: 150
            }, {
              type: 'label',
              label: LANG['shellmanager']['body']['title']
            }, {
              type: 'container',
              name: 'shellmanager_bodys',
              inputWidth: 600,
              inputHeight: 150
            }]
          }]
        },
        {
          type: 'fieldset',
          label: `<i class="fa fa-terminal"></i> ${LANG['terminal']['title']}`,
          list: [{
            type: 'block',
            list: [{
              type: 'label',
              name: 'terminal_size_label',
              label: `${LANG['terminal']['size']} x${parseFloat(this.terminal_settings.tsize).toFixed(2)}`
            }, {
              type: 'newcolumn',
              offset: 20
            }, {
              type: 'container',
              name: 'terminal_size',
              inputWidth: 300,
              inputHeight: 30
            }, {
              type: 'container',
              name: 'terminal_size_preview',
              inputWidth: 600,
              inputHeight: 200
            }, ]
          }]
        },
        // 后续其它模块
      ]
    }], true);
    form.enableLiveValidation(true);

    let bookmark_grid = new dhtmlXGridObject(form.getContainer('filemanager_bookmarks'));
    bookmark_grid.setHeader(`
    &nbsp;,
    ${LANG['filemanager']['bookmark']['grid']['name']},
    ${LANG['filemanager']['bookmark']['grid']['path']}
    `);
    bookmark_grid.setColTypes("ro,edtxt,edtxt");
    bookmark_grid.setColSorting('str,str,str');
    bookmark_grid.setInitWidths("40,*,200");
    bookmark_grid.setColAlign("center,left,left");
    bookmark_grid.enableMultiselect(true);

    bookmark_grid.attachEvent('onRightClick', (id, lid, event) => {
      let _ids = (bookmark_grid.getSelectedId() || '').split(',');
      if (id === -1) {
        _ids = [];
      } else if (_ids.length === 1) {
        // 如果没有选中？则选中右键对应选项
        bookmark_grid.selectRowById(id);
        _ids = [id];
      };
      let ids = [];
      _ids.map((_) => {
        ids.push(bookmark_grid.getRowAttribute(_, 'bname'));
      });
      id = ids[0] || '';

      let menu = [{
        text: LANG['filemanager']['bookmark']['bmenu']['add'],
        icon: 'fa fa-plus-circle',
        action: self
          .addBookMarks
          .bind(self)
      }, {
        text: LANG['filemanager']['bookmark']['bmenu']['del'],
        icon: 'fa fa-trash-o',
        action: () => {
          self.delBookMarks(ids);
        }
      }];
      bmenu(menu, event);
      return true;
    });

    bookmark_grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
      // 2 编辑完成
      if (stage === 2) {
        if (nValue === oValue) {
          return;
        }
        var obname = bookmark_grid.getRowAttribute(rId, "bname");
        var obpath = bookmark_grid.getRowAttribute(rId, "bpath");
        switch (cInd) { // 具体是哪一列被编辑了
          case 1: // name
            // if(!nValue.match(/^[a-zA-Z0-9_/]+$/)){
            // toastr.error(LANG["filemanager"]['bookmark']['edit']["name_invalid"],
            // LANG_T['error']);   return }
            if (self.filemanager_settings.bookmarks.hasOwnProperty(obname)) {
              delete self.filemanager_settings.bookmarks[obname];
              self.filemanager_settings.bookmarks[nValue] = obpath;
            }
            toastr.success(LANG["filemanager"]['bookmark']['edit']["success"], LANG_T["success"]);
            break;
          case 2: // path
            nValue = nValue.replace(/\\/g, '/');
            if (!nValue.endsWith('/')) {
              nValue += '/';
            }
            if (self.filemanager_settings.bookmarks.hasOwnProperty(obname)) {
              self.filemanager_settings.bookmarks[obname] = nValue;
            }
            break;
        }
        antSword['storage']('adefault_filemanager', self.filemanager_settings);
        self.reloadFMBookmarks();
      }
    });

    bookmark_grid.init();
    this.bookmark_grid = bookmark_grid;

    // 数据管理配置
    let db_bookmark_grid = new dhtmlXGridObject(form.getContainer('database_bookmarks'));
    db_bookmark_grid.setHeader(`
    &nbsp;,
    ${LANG['database']['bookmark']['grid']['name']},
    ${LANG['database']['bookmark']['grid']['path']}
    `);
    db_bookmark_grid.setColTypes("ro,edtxt,edtxt");
    db_bookmark_grid.setColSorting('str,str,str');
    db_bookmark_grid.setInitWidths("40,220,*");
    db_bookmark_grid.setColAlign("center,left,left");
    db_bookmark_grid.enableMultiselect(true);

    db_bookmark_grid.attachEvent('onRightClick', (id, lid, event) => {
      let _ids = (db_bookmark_grid.getSelectedId() || '').split(',');
      if (id === -1) {
        _ids = [];
      } else if (_ids.length === 1) {
        // 如果没有选中？则选中右键对应选项
        db_bookmark_grid.selectRowById(id);
        _ids = [id];
      };
      let ids = [];
      _ids.map((_) => {
        ids.push(db_bookmark_grid.getRowAttribute(_, 'bname'));
      });
      id = ids[0] || '';

      let dbmenu = [{
        text: LANG['database']['bookmark']['bmenu']['add'],
        icon: 'fa fa-plus-circle',
        action: self
          .addDatabaseBookMarks
          .bind(self)
      }, {
        text: LANG['database']['bookmark']['bmenu']['del'],
        icon: 'fa fa-trash-o',
        action: () => {
          self.delDatabaseBookMarks(ids);
        }
      }];
      bmenu(dbmenu, event);
      return true;
    });
    db_bookmark_grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
      // 2 编辑完成
      if (stage === 2) {
        if (nValue === oValue) {
          return;
        }
        var obname = db_bookmark_grid.getRowAttribute(rId, "bname"); // string
        var obpath = db_bookmark_grid.getRowAttribute(rId, "bpath"); // base64 格式的
        switch (cInd) { // 具体是哪一列被编辑了
          case 1: // name
            // if(!nValue.match(/^[a-zA-Z0-9_/]+$/)){
            // toastr.error(LANG["database"]['bookmark']['edit']["name_invalid"],
            // LANG_T['error']);   return }
            if (self.database_settings.bookmarks.hasOwnProperty(obname)) {
              delete self.database_settings.bookmarks[obname];
              self.database_settings.bookmarks[nValue] = obpath;
            }
            toastr.success(LANG["database"]['bookmark']['edit']["success"], LANG_T["success"]);
            break;
          case 2: // sql
            if (self.database_settings.bookmarks.hasOwnProperty(obname)) {
              self.database_settings.bookmarks[obname] = Buffer
                .from(nValue)
                .toString('base64');
            }
            break;
        }
        antSword['storage']('adefault_database', self.database_settings);
        self.reloadDatabaseBookmarks();
      }
    });
    db_bookmark_grid.init();
    this.db_bookmark_grid = db_bookmark_grid;
    // 保存
    toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'save':
          if (form.validate()) {
            var _formvals = form.getValues();
            let config = default_config;
            config.filemanager.openfileintab = _formvals['openfileintab'];
            config.filemanager.bookmarks = self.filemanager_settings.bookmarks;

            config.database.bookmarks = self.database_settings.bookmarks;

            config.shellmanager.headers = self.shellmanager_settings.headers;
            config.shellmanager.bodys = self.shellmanager_settings.bodys;
            config.shellmanager.others["ignore-https"] = _formvals['shellmanager_ignore-https'];
            config.shellmanager.others["use-random-variable"] = _formvals['shellmanager_use-random-variable'];
            config.shellmanager.others["request-timeout"] = _formvals['shellmanager_request-timeout'];

            config.terminal.tsize = self.terminal_settings.tsize;
            // save save 文件管理设置
            antSword['storage']('adefault_filemanager', config.filemanager);
            antSword['storage']('adefault_database', config.database);
            antSword['storage']('adefault_shellmanager', config.shellmanager);
            antSword['storage']('adefault_terminal', config.terminal);
            toastr.success(LANG['success'], LANG_T['success']);
            // 重启应用
            layer.confirm(LANG['confirm']['content'], {
              icon: 2,
              shift: 6,
              title: LANG['confirm']['title']
            }, (_) => {
              location.reload();
            });
          } else {
            toastr.error(LANG['error'], LANG_T['error']);
          }
          break;
      }
    });

    // 数据管理配置 请求 headers
    let shellmanager_headers_grid = new dhtmlXGridObject(form.getContainer('shellmanager_headers'));
    shellmanager_headers_grid.setHeader(`
    &nbsp;,
    ${LANG['shellmanager']['header']['grid']['name']},
    ${LANG['shellmanager']['header']['grid']['value']}
    `);
    shellmanager_headers_grid.setColTypes("ro,edtxt,edtxt");
    shellmanager_headers_grid.setColSorting('str,str,str');
    shellmanager_headers_grid.setInitWidths("40,200,*");
    shellmanager_headers_grid.setColAlign("center,left,left");
    shellmanager_headers_grid.enableMultiselect(true);

    shellmanager_headers_grid.attachEvent('onRightClick', (id, lid, event) => {
      let _ids = (shellmanager_headers_grid.getSelectedId() || '').split(',');
      if (id === -1) {
        _ids = [];
      } else if (_ids.length === 1) {
        // 如果没有选中？则选中右键对应选项
        shellmanager_headers_grid.selectRowById(id);
        _ids = [id];
      };
      let ids = [];
      _ids.map((_) => {
        ids.push(shellmanager_headers_grid.getRowAttribute(_, 'bname'));
      });
      id = ids[0] || '';

      let menu = [{
        text: LANG['shellmanager']['header']['bmenu']['add'],
        icon: 'fa fa-plus-circle',
        action: self
          .addShellmanagerHeaders
          .bind(self)
      }, {
        text: LANG['shellmanager']['header']['bmenu']['del'],
        icon: 'fa fa-trash-o',
        action: () => {
          self.delShellmanagerHeaders(ids);
        }
      }];
      bmenu(menu, event);
      return true;
    });

    shellmanager_headers_grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
      // 2 编辑完成
      if (stage === 2) {
        if (nValue === oValue) {
          return;
        }
        var obname = shellmanager_headers_grid.getRowAttribute(rId, "bname");
        var obpath = shellmanager_headers_grid.getRowAttribute(rId, "bvalue");
        switch (cInd) { // 具体是哪一列被编辑了
          case 1: // name
            // if(!nValue.match(/^[a-zA-Z0-9_/]+$/)){
            // toastr.error(LANG["filemanager"]['bookmark']['edit']["name_invalid"],
            // LANG_T['error']);   return }
            if (self.shellmanager_settings.headers.hasOwnProperty(obname)) {
              delete self.shellmanager_settings.headers[obname];
              self.shellmanager_settings.headers[nValue] = obpath;
            }
            toastr.success(LANG["shellmanager"]['header']['edit']["success"], LANG_T["success"]);
            break;
          case 2: // value
            if (self.shellmanager_settings.headers.hasOwnProperty(obname)) {
              self.shellmanager_settings.headers[obname] = nValue;
            }
            break;
        }
        antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
        self.reloadShellmanagerHeaders();
      }
    });

    shellmanager_headers_grid.init();
    this.shellmanager_headers_grid = shellmanager_headers_grid;

    // 请求Body
    let shellmanager_bodys_grid = new dhtmlXGridObject(form.getContainer('shellmanager_bodys'));
    shellmanager_bodys_grid.setHeader(`
    &nbsp;,
    ${LANG['shellmanager']['body']['grid']['name']},
    ${LANG['shellmanager']['body']['grid']['value']}
    `);
    shellmanager_bodys_grid.setColTypes("ro,edtxt,edtxt");
    shellmanager_bodys_grid.setColSorting('str,str,str');
    shellmanager_bodys_grid.setInitWidths("40,200,*");
    shellmanager_bodys_grid.setColAlign("center,left,left");
    shellmanager_bodys_grid.enableMultiselect(true);

    shellmanager_bodys_grid.attachEvent('onRightClick', (id, lid, event) => {
      let _ids = (shellmanager_bodys_grid.getSelectedId() || '').split(',');
      if (id === -1) {
        _ids = [];
      } else if (_ids.length === 1) {
        // 如果没有选中？则选中右键对应选项
        shellmanager_bodys_grid.selectRowById(id);
        _ids = [id];
      };
      let ids = [];
      _ids.map((_) => {
        ids.push(shellmanager_bodys_grid.getRowAttribute(_, 'bname'));
      });
      id = ids[0] || '';

      let menu = [{
        text: LANG['shellmanager']['body']['bmenu']['add'],
        icon: 'fa fa-plus-circle',
        action: self
          .addShellmanagerBodys
          .bind(self)
      }, {
        text: LANG['shellmanager']['body']['bmenu']['del'],
        icon: 'fa fa-trash-o',
        action: () => {
          self.delShellmanagerBodys(ids);
        }
      }];
      bmenu(menu, event);
      return true;
    });

    shellmanager_bodys_grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
      // 2 编辑完成
      if (stage === 2) {
        if (nValue === oValue) {
          return;
        }
        var obname = shellmanager_bodys_grid.getRowAttribute(rId, "bname");
        var obpath = shellmanager_bodys_grid.getRowAttribute(rId, "bvalue");
        switch (cInd) { // 具体是哪一列被编辑了
          case 1: // name
            // if(!nValue.match(/^[a-zA-Z0-9_/]+$/)){
            // toastr.error(LANG["shellmanager"]['body']['edit']["name_invalid"],
            // LANG_T['error']);   return }
            if (self.shellmanager_settings.bodys.hasOwnProperty(obname)) {
              delete self.shellmanager_settings.bodys[obname];
              self.shellmanager_settings.bodys[nValue] = obpath;
            }
            toastr.success(LANG["shellmanager"]['body']['edit']["success"], LANG_T["success"]);
            break;
          case 2: // path
            if (self.shellmanager_settings.bodys.hasOwnProperty(obname)) {
              self.shellmanager_settings.bodys[obname] = nValue;
            }
            break;
        }
        antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
        self.reloadShellmanagerBodys();
      }
    });

    shellmanager_bodys_grid.init();
    this.shellmanager_bodys_grid = shellmanager_bodys_grid;

    // Terminal 部分
    // preview
    form.getContainer('terminal_size_preview').innerHTML = `<div id="div_terminal_preview" style="height:100%;margin:0;padding:0 5px 1px 5px;overflow:scroll;--size:${this.terminal_settings.tsize};"></div>`;
    let banner = `[[b;cyan;](*) Information]`;
    banner += `\n[[b;#99A50D;]Path  ]: [[;#C3C3C3;]/var/www/html]`;
    banner += `\n[[b;#99A50D;]Driver]: [[;#C3C3C3;]/]`;
    banner += `\n[[b;#99A50D;]System]: [[;#C3C3C3;]Linux 4.9.125-linuxkit #1 SMP Fri Sep 7 08:20:28 UTC 2018 x86_64]`;
    banner += `\n[[b;#99A50D;]User  ]: [[;#C3C3C3;]www-data]`;
    let terminal_size_preview = $("#div_terminal_preview");
    let term = terminal_size_preview.terminal((cmd, ter) => {
      ter.reset();
    }, {
      prompt: '([[b;#E80000;]www-data]:[[;#0F93D2;]/var/www/html]) $ ',
      greetings: banner,
      history: false,
    });
    // size slider
    let terminal_size_slider = new dhtmlXSlider({
      parent: form.getContainer('terminal_size'),
      size: 300,
      value: this.terminal_settings.tsize,
      step: 0.05,
      min: 0.5,
      max: 2,
    });
    terminal_size_slider.attachEvent("onSlideEnd", (value) => {
      this.terminal_settings.tsize = value;
      form.setItemLabel('terminal_size_label', `${LANG['terminal']['size']} x${parseFloat(value).toFixed(2)}`);
      term[0].style.setProperty('--size', value);
    });

    // grid右键
    [bookmark_grid, db_bookmark_grid, shellmanager_headers_grid, shellmanager_bodys_grid].forEach((g) => {
      // 空白数据右键fix
      $('.objbox').on('contextmenu', (e) => {
        (e.target.nodeName === 'DIV' && e.target.grid === g && g.callEvent instanceof Function && antSword['tabbar'].getActiveTab() === "tab_about" && sidebar.getActiveItem() === "adefault") ?
        g.callEvent('onRightClick', [-1, -1, e]): null;
      });
    });
    $('.objbox').on('click', (e) => {
      bmenu.hide();
    });

    this.reloadFMBookmarks();
    this.reloadDatabaseBookmarks();
    this.reloadShellManager();
  }

  reloadShellManager() {
    this.reloadShellmanagerHeaders();
    this.reloadShellmanagerBodys();
  }

  // 重载 bookmarks grid
  reloadFMBookmarks() {
    let self = this;
    let data = [];
    let _id = 1;
    Object
      .keys(self.filemanager_settings.bookmarks)
      .map((t) => {
        data.push({
          id: _id,
          bname: t,
          bpath: self.filemanager_settings.bookmarks[t],
          data: [
            `<i class="fa fa-bookmark-o"></i>`, antSword.noxss(t),
            antSword.noxss(self.filemanager_settings.bookmarks[t])
          ]
        });
        _id++;
      });
    if (data.length == 0) {
      data.push({
        id: _id,
        bname: '',
        bpath: '',
        data: [`<i class="fa fa-bookmark-o"></i>`, LANG['filemanager']['bookmark']['nodata'],
          '&nbsp;'
        ]
      });
    }
    self
      .bookmark_grid
      .clearAll();
    self
      .bookmark_grid
      .parse({
        'rows': data
      }, 'json');
  }

  addBookMarks() {
    let self = this;
    let hash = +new Date();
    let index = layer.prompt({
      title: `<i class="fa fa-bookmark"></i> ${LANG['filemanager']['bookmark']['add']['title']}`,
      content: '<input type="text" style="width:300px;" class="layui-layer-input" id="bname_' + hash + '" value="" placeholder="bookmark name"><p/><input style="width:300px;" type="tex' +
        't" id="bpath_' + hash + '" class="layui-layer-input" value="" placeholder="bookmark path">',
      btn: [LANG['filemanager']['bookmark']['add']['addbtn']],
      yes: (i) => {
        let _bname = $(`#bname_${hash}`);
        let _bpath = $(`#bpath_${hash}`);
        let bname = _bname.val();
        let bpath = _bpath.val();
        let gbm = self.filemanager_settings.bookmarks;
        if (gbm.hasOwnProperty(bname)) {
          _bname.focus();
          return toastr.warning(LANG['filemanager']['bookmark']['add']['namedup'], LANG_T['warning']);
        }
        bpath = bpath.replace(/\\/g, '/');
        if (!bpath.endsWith('/')) {
          bpath += '/';
        }
        gbm[bname] = bpath;
        self.filemanager_settings.bookmarks = gbm;
        antSword['storage']('adefault_filemanager', self.filemanager_settings);
        self.reloadFMBookmarks();
        toastr.success(LANG['filemanager']['bookmark']['add']['success'], LANG_T['success']);
        layer.close(i);
      }
    });
  }

  delBookMarks(ids) {
    let self = this;
    if (ids.length === 1 && !ids[0]) {
      return
    }
    layer.confirm(LANG['filemanager']['bookmark']['del']['confirm'](ids.length > 1 ?
      ids.length :
      ids[0]), {
      icon: 2,
      shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['filemanager']['bookmark']['del']['title']}`
    }, (_) => {
      layer.close(_);
      ids.map((p) => {
        if (self.filemanager_settings.bookmarks.hasOwnProperty(p)) {
          delete self.filemanager_settings.bookmarks[p];
        }
      });
      antSword['storage']('adefault_filemanager', self.filemanager_settings);
      self.reloadFMBookmarks();
      toastr.success(LANG['filemanager']['bookmark']['del']['success'], LANG_T['success']);
    })
  }

  // 重载 database_bookmarks grid
  reloadDatabaseBookmarks() {
    let self = this;
    let data = [];
    let _id = 1;
    Object
      .keys(self.database_settings.bookmarks)
      .map((t) => {
        data.push({
          id: _id,
          bname: t,
          bpath: self.database_settings.bookmarks[t],
          data: [
            `<i class="fa fa-bookmark-o"></i>`, t, Buffer.from(self.database_settings.bookmarks[t], 'base64').toString()
          ]
        });
        _id++;
      });
    if (data.length == 0) {
      data.push({
        id: _id,
        bname: '',
        bpath: '',
        data: [`<i class="fa fa-bookmark-o"></i>`, LANG['database']['bookmark']['nodata'],
          '&nbsp;'
        ]
      });
    }
    self
      .db_bookmark_grid
      .clearAll();
    self
      .db_bookmark_grid
      .parse({
        'rows': data
      }, 'json');
  }

  addDatabaseBookMarks() {
    let self = this;
    let hash = +new Date();
    let index = layer.prompt({
      title: `<i class="fa fa-bookmark"></i> ${LANG['database']['bookmark']['add']['title']}`,
      content: '<input type="text" style="width:300px;" class="layui-layer-input" id="bname_' + hash + '" value="" placeholder="bookmark name"><p/><input style="width:300px;" type="tex' +
        't" id="bpath_' + hash + '" class="layui-layer-input" value="" placeholder="bookmark sql">',
      btn: [LANG['database']['bookmark']['add']['addbtn']],
      yes: (i) => {
        let _bname = $(`#bname_${hash}`);
        let _bpath = $(`#bpath_${hash}`);
        let bname = _bname.val();
        let bpath = _bpath.val();
        let gbm = self.database_settings.bookmarks;
        if (gbm.hasOwnProperty(bname)) {
          _bname.focus();
          return toastr.warning(LANG['database']['bookmark']['add']['namedup'], LANG_T['warning']);
        }
        // bpath = bpath.replace(/\\/g,'/'); if(!bpath.endsWith('/')) {   bpath += '/';
        // }
        gbm[bname] = Buffer
          .from(bpath)
          .toString('base64');
        self.database_settings.bookmarks = gbm;
        antSword['storage']('adefault_database', self.database_settings);
        self.reloadDatabaseBookmarks();
        toastr.success(LANG['database']['bookmark']['add']['success'], LANG_T['success']);
        layer.close(i);
      }
    });
  }

  delDatabaseBookMarks(ids) {
    let self = this;
    if (ids.length === 1 && !ids[0]) {
      return
    }
    layer.confirm(LANG['database']['bookmark']['del']['confirm'](ids.length > 1 ?
      ids.length :
      ids[0]), {
      icon: 2,
      shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['database']['bookmark']['del']['title']}`
    }, (_) => {
      layer.close(_);
      ids.map((p) => {
        if (self.database_settings.bookmarks.hasOwnProperty(p)) {
          delete self.database_settings.bookmarks[p];
        }
      });
      antSword['storage']('adefault_database', self.database_settings);
      self.reloadDatabaseBookmarks();
      toastr.success(LANG['database']['bookmark']['del']['success'], LANG_T['success']);
    })
  }

  // 重载 shellmanager headers grid
  reloadShellmanagerHeaders() {
    let self = this;
    let data = [];
    let _id = 1;
    Object
      .keys(self.shellmanager_settings.headers)
      .map((t) => {
        data.push({
          id: _id,
          bname: t,
          bvalue: self.shellmanager_settings.headers[t],
          data: [`<i class="fa fa-bookmark-o"></i>`, t, self.shellmanager_settings.headers[t]]
        });
        _id++;
      });
    if (data.length == 0) {
      data.push({
        id: _id,
        bname: '',
        bvalue: '',
        data: [`<i class="fa fa-bookmark-o"></i>`, LANG['shellmanager']['header']['nodata'],
          '&nbsp;'
        ]
      });
    }
    self
      .shellmanager_headers_grid
      .clearAll();
    self
      .shellmanager_headers_grid
      .parse({
        'rows': data
      }, 'json');
  }

  addShellmanagerHeaders() {
    let self = this;
    let hash = +new Date();
    let index = layer.prompt({
      title: `<i class="fa fa-bookmark"></i> ${LANG['shellmanager']['header']['add']['title']}`,
      content: '<input type="text" style="width:300px;" class="layui-layer-input" id="bname_' + hash + '" value="" placeholder="name"><p/><input style="width:300px;" type="text" id="bv' +
        'alue_' + hash + '" class="layui-layer-input" value="" placeholder="value">',
      btn: [LANG['shellmanager']['header']['add']['addbtn']],
      yes: (i) => {
        let _bname = $(`#bname_${hash}`);
        let _bvalue = $(`#bvalue_${hash}`);
        let bname = _bname.val();
        let bvalue = _bvalue.val();
        let gbm = self.shellmanager_settings.headers;
        if (gbm.hasOwnProperty(bname)) {
          _bname.focus();
          return toastr.warning(LANG['shellmanager']['header']['add']['namedup'], LANG_T['warning']);
        }
        gbm[bname] = bvalue;
        self.shellmanager_settings.headers = gbm;
        antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
        self.reloadShellmanagerHeaders();
        toastr.success(LANG['shellmanager']['header']['add']['success'], LANG_T['success']);
        layer.close(i);
      }
    });
  }

  delShellmanagerHeaders(ids) {
    let self = this;
    if (ids.length === 1 && !ids[0]) {
      return
    }
    layer.confirm(LANG['shellmanager']['header']['del']['confirm'](ids.length > 1 ?
      ids.length :
      ids[0]), {
      icon: 2,
      shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['shellmanager']['header']['del']['title']}`
    }, (_) => {
      layer.close(_);
      ids.map((p) => {
        if (self.shellmanager_settings.headers.hasOwnProperty(p)) {
          delete self.shellmanager_settings.headers[p];
        }
      });
      antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
      self.reloadShellmanagerHeaders();
      toastr.success(LANG['shellmanager']['header']['del']['success'], LANG_T['success']);
    })
  }

  // 重载 shellmanager bodys grid
  reloadShellmanagerBodys() {
    let self = this;
    let data = [];
    let _id = 1;
    Object
      .keys(self.shellmanager_settings.bodys)
      .map((t) => {
        data.push({
          id: _id,
          bname: t,
          bvalue: self.shellmanager_settings.bodys[t],
          data: [`<i class="fa fa-bookmark-o"></i>`, t, self.shellmanager_settings.bodys[t]]
        });
        _id++;
      });
    if (data.length == 0) {
      data.push({
        id: _id,
        bname: '',
        bvalue: '',
        data: [`<i class="fa fa-bookmark-o"></i>`, LANG['shellmanager']['body']['nodata'],
          '&nbsp;'
        ]
      });
    }
    self
      .shellmanager_bodys_grid
      .clearAll();
    self
      .shellmanager_bodys_grid
      .parse({
        'rows': data
      }, 'json');
  }

  addShellmanagerBodys() {
    let self = this;
    let hash = +new Date();
    let index = layer.prompt({
      title: `<i class="fa fa-bookmark"></i> ${LANG['shellmanager']['body']['add']['title']}`,
      content: '<input type="text" style="width:300px;" class="layui-layer-input" id="bname_' + hash + '" value="" placeholder="name"><p/><input style="width:300px;" type="text" id="bv' +
        'alue_' + hash + '" class="layui-layer-input" value="" placeholder="value">',
      btn: [LANG['shellmanager']['body']['add']['addbtn']],
      yes: (i) => {
        let _bname = $(`#bname_${hash}`);
        let _bvalue = $(`#bvalue_${hash}`);
        let bname = _bname.val();
        let bvalue = _bvalue.val();
        let gbm = self.shellmanager_settings.bodys;
        if (gbm.hasOwnProperty(bname)) {
          _bname.focus();
          return toastr.warning(LANG['shellmanager']['body']['add']['namedup'], LANG_T['warning']);
        }
        gbm[bname] = bvalue;
        self.shellmanager_settings.bodys = gbm;
        antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
        self.reloadShellmanagerBodys();
        toastr.success(LANG['shellmanager']['body']['add']['success'], LANG_T['success']);
        layer.close(i);
      }
    });
  }

  delShellmanagerBodys(ids) {
    let self = this;
    if (ids.length === 1 && !ids[0]) {
      return
    }
    layer.confirm(LANG['shellmanager']['body']['del']['confirm'](ids.length > 1 ?
      ids.length :
      ids[0]), {
      icon: 2,
      shift: 6,
      title: `<i class="fa fa-trash"></i> ${LANG['shellmanager']['body']['del']['title']}`
    }, (_) => {
      layer.close(_);
      ids.map((p) => {
        if (self.shellmanager_settings.bodys.hasOwnProperty(p)) {
          delete self.shellmanager_settings.bodys[p];
        }
      });
      antSword['storage']('adefault_shellmanager', self.shellmanager_settings);
      self.reloadShellmanagerBodys();
      toastr.success(LANG['shellmanager']['body']['del']['success'], LANG_T['success']);
    })
  }
}

module.exports = ADefault;