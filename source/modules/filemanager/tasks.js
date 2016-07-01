//
// 任务管理 模块
//

/*
  用法：
  const task = new Task('download', 'http://xx.com/path/to => /tmp/');
  task.update('start download..');
  task.update('100%');
  task.end('download success!');
*/

const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['filemanager']['tasks'];

class Tasks {

  constructor(cell, manager) {
    cell.setText(`<i class="fa fa-tasks"></i> ${LANG['title']}`);
    cell.setHeight(250);
    // 默认折叠panel
    cell.collapse();

    // 创建表格
    let grid = cell.attachGrid();

    grid.setHeader(`
      ${LANG['grid']['header']['name']},
      ${LANG['grid']['header']['desc']},
      ${LANG['grid']['header']['status']},
      ${LANG['grid']['header']['stime']},
      ${LANG['grid']['header']['etime']}
    `);
    grid.setColTypes("ro,ro,ro,ro,ro");
    grid.setInitWidths("100,*,150,150,150");
    grid.setColAlign("left,left,left,left,left");

    grid.init();

    this.grid = grid;
    this.cell = cell;
    this.manager = manager;
  }

  // const task = tasks.new('download', '/etc/passwd', '0%');
  // task.update('20%');
  // task.end('100%');
  new(name, desc, progress) {
    // 展开panel
    this.cell.expand();
    // 创建一个随机ID
    const hash = String(+new Date() + Math.random()).replace('.', '_');
    this.grid.addRow(
      hash, [
        antSword.noxss(name),
        antSword.noxss(desc),
        `<div id="filemanager_progress_${hash}">-</div>`,
        new Date().format('yyyy-MM-dd hh:mm:ss'),
        `<div id="filemanager_end_time_${hash}">-</div>`
      ], 0
    );
    const API = {
      // 更新任务状态
      update: (progress) => {
        $(`#filemanager_progress_${hash}`).text(progress);
      },
      // 任务结束
      end: (progress) => {
        $(`#filemanager_progress_${hash}`).text(progress || '100%');
        $(`#filemanager_end_time_${hash}`).text(new Date().format('yyyy-MM-dd hh:mm:ss'));
      },
      // 任务成功
      success: (progress) => {
        API['end'](progress);
        $(`#filemanager_progress_${hash}`).css('color', 'green');
      },
      // 任务失败
      failed: (progress) => {
        API['end'](progress);
        $(`#filemanager_progress_${hash}`).css('color', 'red');
      }
    };
    return API;
  }

}

// export default Tasks;
module.exports = Tasks;
