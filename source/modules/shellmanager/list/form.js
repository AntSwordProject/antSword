/**
 * 添加/编辑数据表单
 */

const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['shellmanager'];
const ENCODES = require('../../../base/encodes');

class Form {
  /**
   * 初始化函数
   * @param  {object} opt ui配置
   * @param  {object} arg = {} 默认数据
   * @param  {function} callback 点击按钮后回调数据
   */
  constructor(opt, arg = {}, callback = false) {
    // 创建win窗口
    const win = this._createWin(opt);
    // 创建toolbar工具栏
    this.toolbar = this._createToolbar(win, opt);
    // 创建表单分隔accordion
    this.accordion = this._createAccordion(win);
    // 创建表单
    this.baseForm = this._createBaseForm(arg);
    this.httpForm = this._createHttpForm(arg);
    this.otherForm = this._createOtherForm(arg);

    // toolbar点击事件
    this
      .toolbar
      .attachEvent('onClick', (id) => {
        switch (id) {
          case 'clear':
            this
              .baseForm
              .clear();
            break;
          case 'test':
            if (!this.baseForm.validate() || !this.httpForm.validate() || !this.otherForm.validate()) {
              return toastr.warning(LANG['list']['add']['warning'], LANG_T['warning']);
            };
            let opts = this._parseFormData(this.baseForm.getValues(), this.httpForm.getValues(), this.otherForm.getValues());
            let opt = {
              "url": opts.base['url'],
              "pwd": opts.base['pwd'],
              "type": opts.base['type'],
              "encode": opts.base['encode'],
              "encoder": opts.base['encoder'],
              "decoder": opts.base['decoder'],
              "httpConf": opts.http,
              "otherConf": opts.other
            }
            win.progressOn();
            let core = new antSword["core"][opt['type']](opt);
            core
              .request(core.base.info())
              .then((ret) => {
                if (ret['text'].length > 0) {
                  toastr.success(LANG['list']['add']['test_success'], LANG_T['success']);
                } else {
                  toastr.warning(LANG['list']['add']['test_warning'], LANG_T['warning']);
                }
                win.progressOff();
              })
              .catch((err) => {
                win.progressOff();
                toastr.error(JSON.stringify(err), LANG_T['error']);
              });
            break;
          case 'act':
            // 检测表单数据
            if (!this.baseForm.validate() || !this.httpForm.validate() || !this.otherForm.validate()) {
              return toastr.warning(LANG['list']['add']['warning'], LANG_T['warning']);
            };
            // 回调数据
            if (callback) {
              win.progressOn();
              setTimeout(() => {
                callback(this._parseFormData(this.baseForm.getValues(), this.httpForm.getValues(), this.otherForm.getValues())).then((msg) => {
                  // 添加/保存完毕后回调
                  win.close();
                  toastr.success(msg, LANG_T['success']);
                }).catch((msg) => {
                  // 添加/保存错误
                  win.progressOff();
                  toastr.error(msg, LANG_T['error']);
                });
              }, 100);
            };
            break;
          default:
            break;
        }
      });
  }

  /**
   * 创建win窗口
   * @param  {object} opts = {} 窗口属性(title,width,height)
   * @return {object}      win
   */
  _createWin(opts = {}) {
    let _id = String(Math.random()).substr(5, 10);
    // 默认配置
    let opt = Object.assign({
      title: opts['title'] || 'Window:' + _id,
      width: 550,
      height: 450
    }, opts);

    // 创建窗口
    let win = antSword.modules.shellmanager.list.win;
    if (!win) {
      win = new dhtmlXWindows();
      win.attachViewportTo(antSword.modules.shellmanager.list.cell.cell);
      antSword.modules.shellmanager.list.win = win;
    }
    let _win = win.createWindow(_id, 0, 0, opt['width'], opt['height']);
    _win.setText(opt['title']);
    _win.centerOnScreen();
    _win
      .button('minmax')
      .show();
    _win
      .button('minmax')
      .enable();

    return _win;
  }

  /**
   * 创建工具栏
   * @param  {object} win [description]
   * @param  {object} opt ui配置
   * @return {[type]}     [description]
   */
  _createToolbar(win, opt) {
    const toolbar = win.attachToolbar();
    toolbar.loadStruct([{
      id: 'act',
      type: 'button',
      icon: opt['icon'],
      text: opt['text']
    }, {
      type: 'separator'
    }, {
      id: 'clear',
      type: 'button',
      icon: 'remove',
      text: LANG['list']['add']['toolbar']['clear']
    }, {
      type: 'separator'
    }, {
      id: 'test',
      type: 'button',
      'icon': 'spinner',
      text: LANG['list']['add']['toolbar']['test']
    }]);
    return toolbar;
  }

  /**
   * 创建Accordion
   * @param  {[type]} win [description]
   * @return {[type]}     [description]
   */
  _createAccordion(win) {
    const accordion = win.attachAccordion({
      items: [{
        id: 'base',
        text: `<i class="fa fa-file-text"></i> ${LANG['list']['accordion']['base']}`
      }, {
        id: 'http',
        text: `<i class="fa fa-edge"></i> ${LANG['list']['accordion']['http']}`
      }, {
        id: 'other',
        text: `<i class="fa fa-cogs"></i> ${LANG['list']['accordion']['other']}`
      }]
    });
    return accordion;
  }

  /**
   * 创建基础表单
   * @param {object} arg 默认表单数据
   * @return {[type]}     [description]
   */
  _createBaseForm(arg) {
    const opt = Object.assign({}, {
      url: 'http://',
      pwd: '',
      note: '',
      type: 'php',
      encode: 'utf8',
      encoder: 'default',
      decoder: 'default'
    }, arg);
    const form = this
      .accordion
      .cells('base')
      .attachForm([{
        type: 'settings',
        position: 'label-left',
        labelWidth: 80,
        inputWidth: 400
      }, {
        type: 'block',
        inputWidth: 'auto',
        offsetTop: 12,
        list: [{
          type: 'input',
          label: LANG['list']['add']['form']['url'],
          name: 'url',
          required: true,
          value: opt.url
        }, {
          type: 'input',
          label: LANG['list']['add']['form']['pwd'],
          name: 'pwd',
          required: true,
          value: opt.pwd
        }, {
          type: 'input',
          label: LANG['list']['add']['form']['note'],
          name: 'note',
          value: opt.note
        }, {
          type: 'combo',
          label: LANG['list']['add']['form']['encode'],
          name: 'encode',
          readonly: true,
          options: this._parseEncodes(opt.encode)
        }, {
          type: 'combo',
          label: LANG['list']['add']['form']['type'],
          name: 'type',
          readonly: true,
          options: this._parseTypes(opt.type, opt.encoder, opt.decoder)
        }]
      }], true);

    form.attachEvent('onChange', (_, id) => {
      // 根据后缀自动修改 shell 类型
      if (_ == "url") {
        let file_match = {
          "php": /.+\.ph(p[345]?|s|t|tml)/,
          "aspx": /.+\.as(px|mx)/,
          "asp": /.+\.(as(p|a|hx)|c(dx|er))/,
          "custom": /.+\.((jsp[x]?)|cgi)/
        }
        let typecombo = form.getCombo('type');
        if (file_match.php.test(id) == true) {
          typecombo.selectOption(typecombo.getOption('php').index);
        } else if (file_match.aspx.test(id) == true) {
          typecombo.selectOption(typecombo.getOption('aspx').index);
        } else if (file_match.asp.test(id) == true) {
          typecombo.selectOption(typecombo.getOption('asp').index);
        } else if (file_match.custom.test(id) == true) {
          typecombo.selectOption(typecombo.getOption('custom').index);
        }
      }

      // 默认编码设置
      if (_ == "type") {
        let encodecombo = form.getCombo('encode');
        switch (id) {
          case 'php':
            encodecombo.selectOption(encodecombo.getOption('UTF8').index);
            break;
          case 'asp':
            encodecombo.selectOption(encodecombo.getOption('GBK').index);
            break;
          case 'aspx':
            encodecombo.selectOption(encodecombo.getOption('UTF8').index);
            break;
          case 'custom':
            encodecombo.selectOption(encodecombo.getOption('UTF8').index);
            break;
        }
      }
    });
    return form;
  }

  /**
   * 解析编码列表
   * @param {String} _default 默认编码器
   * @return {array} [description]
   */
  _parseEncodes(_default = 'utf8') {
    let ret = [];
    ENCODES.map((_) => {
      ret.push({
        text: _,
        value: _,
        selected: _ === _default.toUpperCase()
      });
    });
    return ret;
  }

  /**
   * 解析脚本支持列表
   * @param {String} _default 默认类型
   * @param {String} _encoder 默认编码器
   * @return {array} [description]
   */
  _parseTypes(_default = 'php', _encoder = 'default', _decoder = 'default') {
    let ret = [];
    for (let c in antSword['core']) {
      // 加载默认编码器和用户自定义编码器
      let encoders;
      let decoders;
      switch (c) {
        case 'php4':
          encoders = antSword['core']['php4']
            .prototype
            .encoders
            .concat(antSword['encoders']['php']);
          decoders = antSword['core']['php4']
            .prototype
            .decoders
            .concat(antSword['decoders']['php']);
          break;
        default:
          encoders = antSword['core'][c]
            .prototype
            .encoders
            .concat(antSword['encoders'][c]);
          decoders = antSword['core'][c]
            .prototype
            .decoders
            .concat(antSword['decoders'][c]);
          break;
      }
      ret.push({
        text: c.toUpperCase(),
        value: c,
        selected: c === _default,
        list: ((c) => {
          let _ = [{
            type: 'settings',
            position: 'label-right',
            offsetLeft: 60,
            labelWidth: 200
          }, {
            type: 'label',
            label: LANG['list']['add']['form']['encoder']
          }, {
            type: 'radio',
            name: `encoder_${c}`,
            value: 'default',
            label: `default\t(${LANG['list']['not_recommended']})`,
            checked: true
          }];
          if (c !== 'custom') {
            _.push({
              type: 'radio',
              name: `encoder_${c}`,
              value: 'random',
              label: `random\t(${LANG['list']['not_recommended']})`,
              checked: _encoder === 'random'
            });
          }
          encoders.map((e) => {
            _.push({
              type: 'radio',
              name: `encoder_${c}`,
              value: e,
              label: e,
              checked: e === _encoder
            })
          });

          _.push({
            type: 'label',
            label: LANG['list']['add']['form']['decoder']
          });
          decoders.map((e) => {
            _.push({
              type: 'radio',
              name: `decoder_${c}`,
              value: e,
              label: e,
              checked: e === _decoder
            })
          });
          return _;
        })(c)
      });
    }
    return ret;
  }

  /**
   * 解析表单数据
   * @param  {object} base  原始base数据
   * @param  {object} http  原始http数据
   * @param  {object} other 原始other数据
   * @return {object}       {base,http,other}
   */
  _parseFormData(base, http, other) {
    // 提取需要的base数据
    let _baseData = {
      url: base['url'],
      pwd: base['pwd'],
      note: base['note'],
      type: base['type'],
      encode: base['encode'],
      encoder: base[`encoder_${base['type']}`],
      decoder: base[`decoder_${base['type']}`]
    };
    // 提取需要的http数据
    let [headers,
      bodys
    ] = [{}, {}];
    for (let _ in http) {
      if (_.endsWith('value') || !http[_]) {
        continue
      }
      let _tmp = _.split('-');
      if (_tmp[0] === 'header') {
        headers[http[_]] = http[_.replace(/name$/, 'value')];
      } else {
        bodys[http[_]] = http[_.replace(/name$/, 'value')];
      }
    }
    // 返回处理完毕的数据
    return {
      base: _baseData,
      http: {
        body: bodys,
        headers: headers
      },
      other: other
    };
  }

  /**
   * 创建其他设置表单
   * @param  {object} arg 默认配置
   * @return {[type]}     [description]
   */
  _createOtherForm(arg) {
    const opt = Object.assign({}, {
      'ignore-https': 0,
      'use-multipart': 0,
      'use-random-variable': 0,
      'use-chunk': 0,
      'chunk-step-byte-min': 2,
      'chunk-step-byte-max': 3,
      'terminal-cache': 0,
      'filemanager-cache': 1,
      'upload-fragment': '500',
      'request-timeout': '10000',
      'command-path': ''
    }, arg.otherConf);
    const form = this
      .accordion
      .cells('other')
      .attachForm([{
        type: 'settings',
        position: 'label-right',
        inputWidth: 400
      }, {
        type: 'block',
        inputWidth: 'auto',
        offsetTop: 12,
        list: [{
          type: "checkbox",
          name: 'ignore-https',
          label: LANG['list']['otherConf']['nohttps'],
          checked: opt['ignore-https'] === 1
        },{
          type: "checkbox",
          name: 'use-random-variable',
          label: LANG['list']['otherConf']['userandomvariable'],
          checked: opt['use-random-variable'] === 1
        },{
          type: "checkbox",
          name: 'use-multipart',
          label: LANG['list']['otherConf']['usemultipart'],
          checked: opt['use-multipart'] === 1
        }, {
          type: 'fieldset',
          offsetLeft: 0,
          label: LANG['list']['otherConf']['chunk']['title'],
          list: [{
            type: 'block',
            offsetLeft: 0,
            list: [{
              type: "checkbox",
              name: 'use-chunk',
              label: LANG['list']['otherConf']['chunk']['usechunk'],
              checked: opt['use-chunk'] === 1
            }]
          }, {
            type: 'block',
            offsetLeft: 0,
            list: [{
              type: 'label',
              label: LANG['list']['otherConf']['chunk']['min']
            }, {
              type: 'newcolumn'
            }, {
              type: 'combo',
              label: '/byte',
              validate: 'ValidNumeric',
              inputWidth: 50,
              name: "chunk-step-byte-min",
              options: ((items) => {
                let ret = [];
                // 如果自定义的路径不在items里，则++
                if (items.indexOf(opt['chunk-step-byte-min']) === -1) {
                  items.unshift(opt['chunk-step-byte-min']);
                }
                items.map((_) => {
                  ret.push({
                    text: _,
                    value: _,
                    selected: opt['chunk-step-byte-min'] === _
                  })
                });
                return ret;
              })([
                '2',
                '4',
                '10',
                '50',
                '100',
                '500'
              ])
            }, {
              type: 'newcolumn'
            }, {
              type: 'label',
              label: LANG['list']['otherConf']['chunk']['max'],
              offsetLeft: 30
            }, {
              type: 'newcolumn'
            }, {
              type: 'combo',
              label: '/byte',
              validate: 'ValidNumeric',
              inputWidth: 50,
              name: "chunk-step-byte-max",
              options: ((items) => {
                let ret = [];
                // 如果自定义的路径不在items里，则++
                if (items.indexOf(opt['chunk-step-byte-max']) === -1) {
                  items.unshift(opt['chunk-step-byte-max']);
                }
                items.map((_) => {
                  ret.push({
                    text: _,
                    value: _,
                    selected: opt['chunk-step-byte-max'] === _
                  })
                });
                return ret;
              })([
                '2',
                '4',
                '10',
                '50',
                '100',
                '500'
              ])
            }]
          }]
        }, {
          type: "checkbox",
          name: 'terminal-cache',
          label: LANG['list']['otherConf']['terminalCache'],
          checked: opt['terminal-cache'] === 1
        }, {
          type: "checkbox",
          name: 'filemanager-cache',
          label: LANG['list']['otherConf']['filemanagerCache'],
          checked: opt['filemanager-cache'] === 1
        }, {
          type: "label",
          label: LANG['list']['otherConf']['uploadFragment']
        }, {
          type: "combo",
          label: '/kb',
          inputWidth: 100,
          name: "upload-fragment",
          options: ((items) => {
            let ret = [];
            // 如果自定义的路径不在items里，则++
            if (items.indexOf(opt['upload-fragment']) === -1) {
              items.unshift(opt['upload-fragment']);
            }
            items.map((_) => {
              ret.push({
                text: _,
                value: _,
                selected: opt['upload-fragment'] === _
              })
            });
            return ret;
          })([
            '500',
            '400',
            '200',
            '100',
            '50',
            '10'
          ])
        }, {
          type: "label",
          label: LANG['list']['otherConf']['requestTimeout']
        }, {
          type: "combo",
          label: '/ms',
          inputWidth: 100,
          name: "request-timeout",
          options: ((items) => {
            let ret = [];
            // 如果自定义的路径不在items里，则++
            if (items.indexOf(opt['request-timeout']) === -1) {
              items.unshift(opt['request-timeout']);
            }
            items.map((_) => {
              ret.push({
                text: _,
                value: _,
                selected: opt['request-timeout'] === _
              })
            });
            return ret;
          })(['5000', '10000', '30000', '60000'])
        }, {
          type: 'label',
          label: LANG['list']['otherConf']['commandPath']
        }, {
          type: 'combo',
          name: 'command-path',
          inputWidth: 200,
          options: ((items) => {
            let ret = [];
            // 如果自定义的路径不在items里，则++
            if (items.indexOf(opt['command-path']) === -1) {
              items.unshift(opt['command-path']);
            }
            items.map((_) => {
              ret.push({
                text: _,
                value: _,
                selected: opt['command-path'] === _
              })
            });
            return ret;
          })(['/bin/sh', 'cmd'])
        }]
      }], true);
    form.attachEvent('onChange', (name, value, state) => {
      switch (name) {
        case 'use-multipart':
          if (state == true && form.isItemChecked('use-chunk')) {
            form.uncheckItem('use-chunk');
          }
          break;
        case 'use-chunk':
          if (state == true && form.isItemChecked('use-multipart')) {
            form.uncheckItem('use-multipart');
          }
          if (state == true) {
            layer.open({
              title: LANG_T['info'],
              content: LANG['list']['otherConf']['chunk']['exphint']
            });
          }
          break;
        default:
          break;
      }
    });
    return form;
  }

  /**
   * 创建HTTP请求表单
   * @param  {object} arg [description]
   * @return {[type]}     [description]
   */
  _createHttpForm(arg) {
    const opt = Object.assign({}, {
      headers: {},
      body: {}
    }, arg.httpConf);
    const cell = this
      .accordion
      .cells('http');
    // 创建toolbar，用于添加数据
    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([{
      id: 'add-header',
      type: 'button',
      icon: 'plus-square-o',
      text: 'Header'
    }, {
      type: 'separator'
    }, {
      id: 'add-body',
      type: 'button',
      icon: 'plus-square-o',
      text: 'Body'
    }]);
    // 创建表单
    const form = cell.attachForm([{
      type: 'block',
      inputWidth: 'auto',
      offsetTop: 12,
      name: 'header',
      list: [{
        type: "label",
        label: "HTTP HEADERS"
      }]
    }, {
      type: 'block',
      inputWidth: 'auto',
      offsetTop: 12,
      name: 'body',
      list: [{
        type: "label",
        label: "HTTP BODY"
      }]
    }], true);
    // 添加Header
    let _headerCount = 0;
    const _addHeader = (name = '', value = '') => {
      _headerCount++;
      form.addItem('header', {
        type: "fieldset",
        label: `#${_headerCount}`,
        inputWidth: 480,
        list: [{
          type: "input",
          name: `header-${_headerCount}_name`,
          inputWidth: 350,
          labelWidth: 50,
          label: "Name",
          value: name
        }, {
          type: "input",
          name: `header-${_headerCount}_value`,
          inputWidth: 350,
          labelWidth: 50,
          label: "Value",
          value: value
        }]
      })
    }
    // 添加Body
    let _bodyCount = 0;
    const _addBody = (name = '', value = '') => {
      _bodyCount++;
      form.addItem('body', {
        type: "fieldset",
        label: `#${_bodyCount}`,
        inputWidth: 480,
        list: [{
          type: "input",
          name: `body-${_bodyCount}_name`,
          inputWidth: 350,
          labelWidth: 50,
          label: "Name",
          value: name
        }, {
          type: "input",
          name: `body-${_bodyCount}_value`,
          inputWidth: 350,
          labelWidth: 50,
          label: "Value",
          value: value
        }]
      })
    }
    // 监听toolbar事件
    toolbar.attachEvent('onClick', (id, e) => {
      switch (id) {
        case 'add-header':
          _addHeader();
          break;
        case 'add-body':
          _addBody();
          break;
      }
    });
    // 添加存储的配置
    for (let _ in opt.headers) {
      _addHeader(_, opt.headers[_]);
    }
    for (let _ in opt.body) {
      _addBody(_, opt.body[_]);
    }
    // 如果没有配置，则添加空白的输入框
    if (_headerCount === 0) {
      _addHeader();
    }
    if (_bodyCount === 0) {
      _addBody();
    }
    return form;
  }
}

module.exports = Form;