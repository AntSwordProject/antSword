/**
 * 语言设置
 */

const LANG = antSword['language']['settings']['language'];
const LANG_T = antSword['language']['toastr'];

class Language {

  constructor(sidebar) {
    sidebar.addItem({
      id: 'language',
      text: `<i class="fa fa-language"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('language');

    // 工具栏
    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([
      { id: 'save', type: 'button', text: LANG['toolbar']['save'], icon: 'save' },
      { type: 'separator' }
    ]);

    // 表单
    const _language = antSword['storage']('language', false, 'en');
    const form = cell.attachForm([
      { type: 'settings', position: 'label-left', labelWidth: 100, inputWidth: 150 },
      { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        { type: 'combo', label: LANG['form']['label'], readonly: true, name: 'language',
        options: (() => {
          let _ = [];
          for (let l in antSword['language']['__languages__']) {
            _.push({
              text: antSword['language']['__languages__'][l],
              value: l,
              selected: _language === l
            });
          }
          return _;
        })() }
      ]}
    ], true);

    // 工具栏点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'save':
          const language = form.getValues()['language'];
          // 保存设置
          localStorage.setItem('language', language);
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

module.exports = Language;
