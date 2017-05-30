/**
 * 设置中心::界面
 */

const LANG = antSword['language']['settings']['display'];
const LANG_T = antSword['language']['toastr'];

class Display {

  constructor(sidebar) {
    sidebar.addItem({
      id: 'display',
      text: `<i class="fa fa-television"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('display');

    const display_shellmanager_hiddencolumns = localStorage.hasOwnProperty('display_shellmanager_hiddencolumns') ? JSON.parse(localStorage.display_shellmanager_hiddencolumns):[];

    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([
      { id: 'save', type: 'button', text: LANG['toolbar']['save'], icon: 'save' }
    ]);
    // 表单
    const form = cell.attachForm([{
      type: 'block', name: 'shellmanager', list: [
        {type: "label", label: LANG['form']['shellmanager']['title']}
      ]}
    ]);

    const LANG_HC = LANG['form']['shellmanager']['hiddencolumns'];
    // 数据管理隐藏列
    form.addItem(
      'shellmanager',
      {
        type: "fieldset", label: LANG_HC['title'], list:[
          { type: "block", list: [
            {
            type: "checkbox", label: LANG_HC['url'], name: 'hidden_columns[0]', checked: display_shellmanager_hiddencolumns.indexOf(0) != -1 , position: "label-right", value: 1, disabled: true
            },
            {type: 'newcolumn', offset:20},
            {
              type: "checkbox", label: LANG_HC['ip'], name: 'hidden_columns[1]', checked: display_shellmanager_hiddencolumns.indexOf(1) != -1 , position: "label-right", value: 2
            },
            {type: 'newcolumn', offset:20},
            {
              type: "checkbox", label: LANG_HC['addr'], name: 'hidden_columns[2]', checked: display_shellmanager_hiddencolumns.indexOf(2) != -1 , position: "label-right", value: 3
            },
            {type: 'newcolumn', offset:20},
            {
              type: "checkbox", label: LANG_HC['note'], name: 'hidden_columns[3]', checked: display_shellmanager_hiddencolumns.indexOf(3) != -1 , position: "label-right", value: 4
            },
            {type: 'newcolumn', offset:20},
            {
              type: "checkbox", label: LANG_HC['ctime'], name: 'hidden_columns[4]', checked: display_shellmanager_hiddencolumns.indexOf(4) != -1 , position: "label-right", value: 5
            },
            {type: 'newcolumn', offset:20},
            {
              type: "checkbox", label: LANG_HC['utime'], name: 'hidden_columns[5]', checked: display_shellmanager_hiddencolumns.indexOf(5) != -1 , position: "label-right", value: 6
            }
          ]}
        ]
      }
    );

    // 保存
    toolbar.attachEvent('onClick', (id) => {
      switch(id){
        case 'save':
          var _formvals = form.getValues();
          var _display_shellmanager_hiddencolumns = [];
          for (var i = 0; i < 6; i++) {
            var data = _formvals['hidden_columns['+i+']'];
            if (data) {
              _display_shellmanager_hiddencolumns.push(data-1);
            }
          }
          localStorage.setItem('display_shellmanager_hiddencolumns', JSON.stringify(_display_shellmanager_hiddencolumns));
          toastr.success(LANG['success'], LANG_T['success']);
          // 重启应用
          layer.confirm(LANG['confirm']['content'], {
            icon: 2, shift: 6,
            title: LANG['confirm']['title']
          }, (_) => {
            location.reload();
          });
          break;
      }
    });
  }

}

module.exports = Display;
