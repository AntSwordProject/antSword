//
// 代理设置
//

const LANG = antSword['language']['settings']['aproxy'];
const LANG_T = antSword['language']['toastr'];

class AProxy {

  constructor(sidebar) {
    sidebar.addItem({
      id: 'aproxy',
      text: `<i class="fa fa-paper-plane"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('aproxy');
    // 代理数据
    const aproxymode = localStorage.getItem('aproxymode') || 'noproxy';
    const aproxyprotocol = localStorage.getItem('aproxyprotocol') || 'http';
    const aproxyserver = localStorage.getItem('aproxyserver');
    const aproxyport = localStorage.getItem('aproxyport');
    const aproxyusername = localStorage.getItem('aproxyusername');
    const aproxypassword = localStorage.getItem('aproxypassword');

    // 工具栏
    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([
      { id: 'save', type: 'button', text: LANG['toolbar']['save'], icon: 'save' },
      { type: 'separator' },
      { id: 'test', name: 'test', type: 'button', text: LANG['toolbar']['test'], icon: 'spinner', disabled: aproxymode === 'noproxy'}
    ]);

    // 表单
    const form = cell.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 150, inputWidth: 200 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'label', label: LANG['form']['label'] },

        { type: 'radio', position: 'label-right', label: LANG['form']['mode']['noproxy'], name: 'aproxymode', value: 'noproxy', checked: aproxymode === 'noproxy'},

        { type: 'radio', position: 'label-right', label: LANG['form']['mode']['manualproxy'], name: 'aproxymode', value: 'manualproxy', checked: aproxymode === 'manualproxy' ,list:[
          { type: 'combo',label: LANG['form']['proxy']['protocol'],readonly: true, name: 'protocol', options:[
            { text: 'HTTP', value: 'http', selected: aproxyprotocol === 'http' },
            { text: 'HTTPS', value: 'https', selected: aproxyprotocol === 'https' },
            { text: 'SOCKS5', value: 'socks', selected: aproxyprotocol === 'socks' },
            { text: 'SOCKS4', value: 'socks4', selected: aproxyprotocol === 'socks4' },
          ]},
          { type: 'input', label: LANG['form']['proxy']['server'], name: 'server', required: true, validate:"NotEmpty", value: aproxyserver},
          { type: 'input', label: LANG['form']['proxy']['port'], name: 'port', required: true, validate:"NotEmpty,ValidInteger", value: aproxyport},
          { type: 'input', label: LANG['form']['proxy']['username'], name: 'username', value: aproxyusername},
          { type: 'password', label: LANG['form']['proxy']['password'], name: 'password', value:aproxypassword }
        ]}
      ]}
    ], true);
    form.enableLiveValidation(true);
    form.attachEvent("onChange", function(name, value, is_checked){
      if (name == "aproxymode") {
        if (value == "manualproxy") {
          toolbar.enableItem('test');
        }else{
          toolbar.disableItem('test');
        }
      }
    });
    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'save':
          if(form.validate()){
            var formvals = form.getValues();
            const aproxymode = formvals['aproxymode'];
            // 保存设置
            localStorage.setItem('aproxymode', aproxymode);
            localStorage.setItem('aproxyprotocol', formvals['protocol']);
            localStorage.setItem('aproxyserver', formvals['server'].replace(/.+:\/\//, '').replace(/:.+/, ''));
            localStorage.setItem('aproxyport', formvals['port']);
            localStorage.setItem('aproxyusername', formvals['username']);
            localStorage.setItem('aproxypassword', formvals['password']);

            toastr.success(LANG['success'], LANG_T['success']);
            // 重启应用
            layer.confirm(LANG['confirm']['content'], {
              icon: 2, shift: 6,
              title: LANG['confirm']['title']
            }, (_) => {
              location.reload();
            });
          }else{
            toastr.error(LANG['error'], LANG_T['error']);
          }
          break;
        case 'test':
          if(form.validate()){
            layer.prompt({
              title: LANG['prompt']['title'],
              value: 'http://uyu.us',
              formType: 0
            }, function(testurl, index){
              layer.close(index);
              var loadindex = layer.load(2, {time: 6*1000});
              var _formvals = form.getValues();
              var _server = _formvals['server'].replace(/.+:\/\//, '').replace(/:.+/, '');
              var _aproxyauth = "";
              if (_formvals['username'] == "" || _formvals['password'] == "" || _formvals['username'] == null || _formvals['password'] == null) {
                _aproxyauth = "";
              }else{
                _aproxyauth = _formvals['username'] + ":" + _formvals['password'];
              }
              var _aproxyuri = _formvals['protocol'] + '://' + _aproxyauth + '@' +_server + ':' + _formvals['port'];
              var hash = (String(+new Date) + String(Math.random())).substr(10, 10).replace('.', '_');

              antSword['ipcRenderer']
              .on(`aproxytest-error-${hash}`, (event, err) => {
                layer.close(loadindex);
                toastr.error(LANG['prompt']['error']+ "\n" + err['code'], LANG_T['error']);
              })
              .on(`aproxytest-success-${hash}`, (event, ret) => {
                layer.close(loadindex);
                toastr.success(LANG['prompt']['success'], LANG_T['success']);
              })
              .send('aproxytest',{
                hash: hash,
                url: testurl || 'http://uyu.us',
                aproxyuri: _aproxyuri
              });
            });
          }
          break;
      }
    });
  }
}

module.exports = AProxy;
