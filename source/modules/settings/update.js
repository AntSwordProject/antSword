/**
 * 检查更新模块
 */

const LANG = antSword['language']['settings']['update'];
const LANG_T = antSword['language']['toastr'];

class Update {
  constructor(sidebar) {
    sidebar.addItem({
      id: 'update',
      text: `<i class="fa fa-cloud-download"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('update');

    // 初始化toolbar
    const toolbar = cell.attachToolbar();
    toolbar.loadStruct([
      {
        id: 'check',
        type: 'button',
        // 调试或者windows平台不支持更新
        disabled: antSword['package']['debug'] || process.platform === 'win32',
        text: LANG['toolbar']['check'], icon: 'check-square-o'
      }, { type: 'separator' }
    ]);

    // toolbar点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'check':
          this.checkUpdate();
          break;
      }
    });

    // 显示当前版本号
    cell.attachHTMLString(`
      ${LANG['current']}: ${antSword['package']['version']}
    `);

    this.cell = cell;
  }

  /**
   * 检查更新
   * @return {None} [description]
   */
  checkUpdate() {
    this.cell.progressOn();
    toastr.info(LANG['check']['ing'], LANG_T['info']);
    // 后台检查更新
    antSword['ipcRenderer']
      .once('update-check', (event, ret) => {
        this.cell.progressOff();
        let info = ret['retVal'];
        // 木有更新
        if (!ret['hasUpdate']) {
          return typeof info === 'string'
            ? toastr.error(LANG['check']['fail'](info), LANG_T['error'])
            : toastr.info(LANG['check']['none'](info['version']), LANG_T['info']);
        }
        // 发现更新
        toastr.success(LANG['check']['found'](info['version']), LANG_T['success']);
        // 更新来源html
        let sources_html = `<select id="ant-update-source">`;
        for (let s in info['update']['sources']) {
          sources_html += `<option value="${s}">${s}</option>`;
        }
        sources_html += `</select>`;
        // 提示更新
        layer.open({
          type: 1,
          shift: 2,
          skin: 'ant-update',
          btn: [LANG['prompt']['btns']['ok'], LANG['prompt']['btns']['no']],
          closeBtn: 0,
          title: `<i class="fa fa-cloud-download"></i> ${LANG['prompt']['title']}[v${info['version']}]`,
          content: `
            <strong>${LANG['prompt']['changelog']}</strong>
            <ol>
              <li>${info['update']['logs'].split('\n').join('</li><li>')}
            </ol>
            <strong>${LANG['prompt']['sources']}</strong>${sources_html}
          `,
          yes: () => {
            // 获取更新选择地址
            const download_source = $('#ant-update-source').val();
            // 开始更新
            // 更新动画
            this.updateLoading();
            // 通知后台
            antSword['ipcRenderer']
              .once('update-download', (event, ret) => {
                // 下载失败
                console.log(ret);
                if (!ret['done']) {
                  if (typeof ret['retVal'] === 'object') {
                    switch(ret['retVal']['type']) {
                      case 'md5':
                        this.updateFail(LANG['prompt']['fail']['md5']);
                        break;
                      case 'unzip':
                        this.updateFail(LANG['prompt']['fail']['unzip'](ret['retVal']['err']));
                        break;
                      default:
                        this.updateFail(ret['retVal']);
                    }
                  } else {
                    this.updateFail(ret['retVal']);
                  }
                  return;
                }
                this.updateSuccess();
              })
              .send('update-download', download_source);
          }
        });

      })
      .send('update-check', {
        local_ver: antSword['package']['version']
      });
  }

  /**
   * 更新动画进度
   * @return {[type]} [description]
   */
  updateLoading() {
    // 删除按钮
    $('.layui-layer-btn').remove();
    // 加载动画
    $('.layui-layer-content').html(`
      <div class="pacman">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p align="center"><strong>${LANG['message']['ing']}</strong></p>
    `);
  }

  /**
   * 更新失败提示界面
   * @param  {String} tip 失败信息
   * @return {[type]}     [description]
   */
  updateFail(tip) {
    $('.layui-layer-content').html(`
      <div align="center" style="color: red">
        <i class="fa fa-times-circle update-icon" />
        <p><strong>${LANG['message']['fail'](tip)}</strong></p>
      </div>
    `);
    toastr.error(LANG['message']['fail'](tip), LANG_T['error']);
    setTimeout(layer.closeAll, 1024 * 5);
  }

  /**
   * 更新成功提示界面
   * @return {None} [description]
   */
  updateSuccess() {
    $('.layui-layer-content').html(`
      <div align="center" style="color: green">
        <i class="fa fa-check-circle update-icon" />
        <p><strong>${LANG['message']['success']}</strong></p>
      </div>
    `);
    toastr.success(LANG['message']['success'], LANG_T['success']);
    setTimeout(() => {
      antSword['ipcRenderer'].send('quit');
    }, 1024 * 3);
  }
}

export default Update;
