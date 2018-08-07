/**
 * 中国蚁剑::编码器管理
 * 创建：2017-05-30
 * 更新：2017-05-30
 * 作者：Virink <virink@outlook.com>
 *
 * 瞎折腾好了。。。
 * 编辑保存什么的功能我就不弄了
 * 累觉不爱。。。。。。。。
 */

const LANG = antSword['language']['settings']['encoders'];
const LANG_T = antSword['language']['toastr'];
const fs = require('fs');
const path = require('path');

class Encoders {

  constructor(sidebar) {
    var _me = this;
    this.encoders = {asp:[],aspx:[],php:[],custom:[]};
    this.getEncoders();
    sidebar.addItem({
      id: 'encoders',
      text: `<i class="fa fa-file-code-o"></i> ${LANG['title']}`
    });
    this.cell = sidebar.cells('encoders');

    // 并没有什么卵用的工具栏
    const toolbar = this.cell.attachToolbar();
    toolbar.loadStruct([
      { type: 'button', text: `${LANG['title']}`, icon: 'eye'}
    ]);

    let layout = this.cell.attachLayout('2E');
    this.a = layout.cells('a');
    this.b = layout.cells('b');
    this.a.hideHeader();
    this.b.hideHeader();
    this.a.setHeight(80);

    this._createFrom({});

    this.editor = this.b.attachEditor([{
      name: 'editor', type: 'editor',
      inputLeft:0, inputTop:0, inputHeight:this.b.getHeight(),inputWidth:this.b.getWidth(),
      position:'absolute'
    }]);
  }

  _createFrom(arg){
    var _me = this;
    const opt = Object.assign({}, {
      type: 'asp',
      encoder: []
    }, arg);
    const form = this.a.attachForm([
      { type: 'block', list: [
        {
          type: 'combo', label: `${LANG['form']['shelltype']}`, width: 100,
          name: 'encodertype', readonly: true, options: this._parseEncodes(opt.type)
        }
      ]}
    ], true);
    form.enableLiveValidation(true);
    form.attachEvent("onChange", function(name, value){
      if (name == "encoder" && value != 'virink') {
        let _ = form.getFormData();
        _me._readEncoderSource(_.encodertype, value);
      }
    });
    return form;
  }

  _readEncoderSource(_path,name){
    let codes = fs.readFileSync(path.join(__dirname,`../../core/${_path}/encoder/${name}.js`));
    if(codes){
      let c = [];
      codes.toString().split("\n").map((_)=>{
        c.push(`<div>${_}</div>`);
      });
      this.editor.setContent(c.toString().replace(/,/ig,""));
    }
  }

  _parseEncodes(_st){
    let ret = [];
    for (let t in this.encoders){
      let es = this.encoders[t];
      ret.push({
        text: t.toUpperCase(),
        selected: t === _st,
        value: t,
        list: ((t)=>{
          let s = [{ text: 'Welcome', value: 'virink'}];
          es.map((e)=>{
            s.push({ text: e, value: e});
          });
          let _ = [{
            type: 'combo', label: `${LANG['form']['encoderslist']}`, width: 200,
            name: 'encoder', readonly: true, options: s
          }];
          return _;
        })(t)
      });
    }
    return ret;
  }

  getEncoders(){
    var _me = this;
    ['asp','aspx','php','custom'].map((t)=>{
      let me = fs.readdirSync(path.join(__dirname,`../../core/${t}/encoder`));
      me.map((_) => {
        if (_ != '.DS_Store')
        _me.encoders[t].push(_.replace(/\.js/ig, ''));
      });
      localStorage.setItem(`encoders_${t}`,_me.encoders[t]);
    });
    toastr.success(`${LANG['success']}`, LANG_T['success']);
  }
}

module.exports = Encoders;
