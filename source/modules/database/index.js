//
// 数据库管理模块
//

// import React from 'react';
// import ReactDOM from 'react-dom';
// import AceEditor from 'react-ace';

const LANG = antSword['language']['database'];

class Database {

  constructor(opt) {
    this.hash = (+new Date * Math.random()).toString(16).substr(2, 8);

    // 初始化UI
    const tabbar = antSword['tabbar'];
    tabbar.addTab(
      `tab_database_${this.hash}`,
      `<i class="fa fa-database"></i> ${opt['ip']}`,
      null, null, true, true
    );
    this.cell = tabbar.cells(`tab_database_${this.hash}`);
    this.cell.progressOn();

    // layout
    this.layout_main = this.cell.attachLayout('2U');
    this.layout_right = this.layout_main.cells('b').attachLayout('2E');

    this.list = this.initList(this.layout_main.cells('a'));
    this.query = this.initQuery(this.layout_right.cells('a'));
    this.result = this.initResult(this.layout_right.cells('b'));

    this.opt = opt;
    this.win = new dhtmlXWindows();
    this.win.attachViewportTo(this.cell.cell);

    // 加载数据库驱动
    const _module = require(`./${opt['type']}/index`);
    this.drive = new _module({
      core: new antSword['core'][opt['type']](opt),
      super: this
    });
    this.cell.progressOff();
  }

  // 初始化左侧列表
  initList(layout) {
    layout.setText(`<i class="fa fa-server"></i> ${LANG['list']['title']}`);
    layout.setWidth('250');

    // tree图标
    const imgs = [
      // connect
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAQAAACouOyaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGQAAABkAA+Wxd0AAAEUSURBVCjPddA9S1txAIXx370JwVCJ0YRCI4FARl2EOrrZdu4USjt0yDewg7uLk1/AF0gcXJylu7MQEUpbaCHcraGNbSik6r1/h2ZIhpzpnIdnOkxnz8B3A/vTMJ5RarpeOFGbr0RSYw+zdFb5ouXSO5/NzYJDQUdxGuZBVVGEIEOmOlljAyKxNz5YFoGykpEhCH47cBqp+Oi5X/6Bkif++gMKKnpe8cwnd95qamo6EnQnvWXsq3peEASJb2CI20l/KhOE2IqCWEWMBUsoKSJWlVOwwpVE4sYmdvQl+nax4Voi0Ys1tG0bqWPNuS1n1rFq7KX3arFMKpUJCNLJ+v9RKpXlZY7dW/QTP7S9VtbBUMOFvNwjiZlZspGW2aUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NDk6MzQrMDg6MDAa6yDqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTAxVDIxOjEyOjA2KzA4OjAwmIBnWAAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAACV0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRlZCBieSBJY29Nb29uLmlvIDDLy0gAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADY2N7Lgj5AAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzExhvGGCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4OTQ5OTI2Hzsr2gAAABN0RVh0VGh1bWI6OlNpemUANy4yMUtCQtXNgY4AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTU4Mi8xMTU4Mjc4LnBuZwIRWX8AAAAASUVORK5CYII=',
      // databass
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAQAAAB+HTb/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGQAAABkAA+Wxd0AAAEXSURBVBjTZck/S5RxAADg5+f75+5t8NTUSktEKCGCFp0U8dwcBMFBNwlu1a8Rrn4CJ0drdDF0bY1e4hAFQcEbTpT0ulfPc2irZ30C3lhWNabsrz/OHPrqLFiy6dKRXEMLmWHvzXlpm1xN6l+pmrzHiKbivyw0jQR36o4cqGtqo6TfpAXz3gUnNnwwpYIHxLiR+247lmnYkhjQL0PLFda0lWOpVUN+amjoIih75dqiUnBsVcWEVEcHkUjHrbrdWMWQfd+UPZOicKfkk3u9sUdzXvjl3I0WEs+99ttH3eDEosikAYmArnu3Ij98ibXN2JEjEuNBR2bdgiJyoaaqT0kikRn0VtWsaZ8Dxq2YNyr1iB6Fc4f2nD4BUO1Rv9s0w+gAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NTA6MjYrMDg6MDB8RcVXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTAxVDIwOjUwOjM1KzA4OjAwTl0AHAAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAACV0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRlZCBieSBJY29Nb29uLmlvIDDLy0gAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcxMRUA1lUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANjI03HRLcwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4OTQ4NjM1LMlreQAAABN0RVh0VGh1bWI6OlNpemUAMjEuM0tCQnpsrG8AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTU3Ny8xMTU3NzMyLnBuZxOTOSYAAAAASUVORK5CYII=',
      // table
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAABLAAAASwAJArFzAAAADgSURBVCjPfdA9L0NhGAbg660X7aaHQXo6kKYswmQUhPKT/Yl20sRQ0qKLGFjo11GW0w4t7unK/eRZ7qBsQ/BX3oMb+/j+5RjQDab//COaepUhSryZLGiLvnM7dp1oulhSN8o862FqNNfQU64sWpEaIbWuYpArNUQqBkNtAxTt6SzpgL5LNTWnWhq5mrnO9KJMzwMyQ49zzbpJVFC2iURUlggSUZKrEHxq+kDJkdtch9q5julrqKs713I911WuXpTpusfYQFdnQZPZDkFVUcVAmO8QVMXgTskYq7a9LGjN1w888l4QdsfN6AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wNy0yNVQyMTo1MDozMiswODowMESg4doAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDQtMDZUMDk6NTM6MTcrMDg6MDA8MBsjAAAATnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjguOC0xMCBRMTYgeDg2XzY0IDIwMTUtMDctMTkgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmcFDJw1AAAAI3RFWHRzdmc6Y29tbWVudAAgR2VuZXJhdG9yOiBJY29Nb29uLmlvILwwrIAAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUzM8q8AZUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTMzWU1RyAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk2NzQ5MTk37+6JEgAAABN0RVh0VGh1bWI6OlNpemUAMi45NUtCQn9HCG8AAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTQzNS8xMTQzNTI4LnBuZ1baGAoAAAAASUVORK5CYII=',
      // column
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAQAAABHeoekAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAASwAAAEsAHOI6VIAAAB1SURBVBjTY2TYyrCbATcwY2CoYsAHElgYWBjYkAT+MzAwMCLxWRgZtjHsQRIQYGBmeIvEN2VhOMswD0nAiYGXYSOcx8jwk4XhO8MHJAWfGBhQ+F+Z0BzFiM5HV4ABhoiC/yj8f+h8FgYNBh8kAQMGLobfyHwAyM8UUNk8qsEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NDk6MzYrMDg6MDCNdDHDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTEyLTE5VDE4OjU2OjEyKzA4OjAwOU9bHwAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAAGN0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgcgt1lgAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMjY1W+dGYAAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAyNjZRH0eHAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0MTg5ODY1NzJGLGnJAAAAE3RFWHRUaHVtYjo6U2l6ZQAxLjEzS0JCW7QG7wAAAFp0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExODMwLzExODMwMjcucG5nOFxJnwAAAABJRU5ErkJggg=='
    ];

    // 左侧拦toolbar
    const toolbar = layout.attachToolbar();
    toolbar.loadStruct([
      { id: 'add', text: LANG['list']['add'], icon: 'plus-circle', type: 'button' },
      { type: 'separator' },
      { id: 'edit', text: LANG['list']['edit'], icon: 'edit', type: 'button', disabled: true },
      { type: 'separator' },
      { id: 'del', text: LANG['list']['del'], icon: 'trash-o', type: 'button', disabled: true }
    ]);
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'add':
          this.drive.addConf();
          break;
        case 'del':
          this.drive.delConf();
          break;
        case 'edit':
          this.drive.editConf();
          break;
      }
    });
    return {
      imgs: imgs,
      layout: layout,
      toolbar: toolbar
    };
  }

  // 初始化右侧::SQL执行
  initQuery(layout) {
    layout.setText(`<i class="fa fa-code"></i> ${LANG['query']['title']}`);
    layout.setHeight('200');

    let editor;
    // SQL语句toolbar
    const toolbar = layout.attachToolbar();
    toolbar.loadStruct([
      { id: 'exec', text: LANG['query']['exec'], icon: 'play', type: 'button', disabled: true },
      // { type: 'separator' },
      // { id: 'import', text: '导入', icon: 'download', type: 'button' },
      { type: 'separator' },
      { id: 'clear', text: LANG['query']['clear'], icon: 'remove', type: 'button' }
    ]);

    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'clear':
          editor.session.setValue('');
          break;
        case 'exec':
          this.drive.execSQL(editor.session.getValue());
          break;
      }
    });

    // SQL语句编辑器
    editor = ace.edit(layout.cell.lastChild);
    editor.$blockScrolling = Infinity;
    editor.setTheme('ace/theme/tomorrow');
    editor.session.setMode('ace/mode/sql');
    editor.session.setUseWrapMode(true);
    editor.session.setWrapLimitRange(null,null);

    editor.setOptions({
      fontSize: '14px',
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    // 快捷键
    editor.commands.addCommand({
      name: 'exec',
      bindKey: {
        win: 'Ctrl-E',
        mac: 'Command-E'
      },
      exec: () => {
        toolbar.callEvent('onClick', ['exec']);
      }
    });

    editor.session.setValue('SELECT "Hello antSword :)" AS welcome;');

    return {
      editor: editor,
      layout: layout,
      toolbar: toolbar
    };
  }

  // 初始化右侧::执行结果
  initResult(layout) {
    layout.setText(`<i class="fa fa-inbox"></i> ${LANG['result']['title']}`);
    // layout.hideHeader();

    // const toolbar = layout.attachToolbar();
    // toolbar.loadStruct([
    //   { id: 'dump', text: '导出', icon: 'upload', type: 'button', disabled: true },
    //   { type: 'separator' }
    // ]);
    return {
      layout: layout,
      // toolbar: toolbar
    };
  }

  // 创建窗口
  createWin(opts) {
    const hash = (+new Date * Math.random()).toString(16).substr(2, 8);
    // 默认配置
    const opt = $.extend({
      title: 'Window:' + hash,
      width: 550,
      height: 450
    }, opts);

    // 创建窗口
    const _win = this.win.createWindow(hash, 0, 0, opt['width'], opt['height']);
    _win.setText(opt['title']);
    _win.centerOnScreen();
    _win.button('minmax').show();
    _win.button('minmax').enable();

    // 返回窗口对象
    return _win;
  }

}

// export default Database;
module.exports = Database;
