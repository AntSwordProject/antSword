//
// 前端菜单交互模块
//

class Menubar {

  constructor() {
    this.events = {};
    // 加载菜单栏
    antSword['ipcRenderer'].send('menubar', antSword['language']['menubar']);
    // 菜单栏事件
    /*
      如何注册菜单栏点击事件？
      antSword['menubar'].reg('command', () => {});
    */
    antSword['ipcRenderer'].on('menubar', (event, argv) => {
      let cmd = '';
      let arg = '';
      if (argv instanceof Array && argv.length === 2) {
        cmd = argv[0];
        arg = argv[1];
      }else{
        cmd = argv;
      }
      switch(cmd) {
        case 'tabbar-next':
          antSword['tabbar'].goToNextTab();
          break;
        case 'tabbar-prev':
          antSword['tabbar'].goToPrevTab();
          break;
        case 'tabbar-close':
          const tab = antSword['tabbar'].getActiveTab();
          if (tab === 'tab_shellmanager') { return };
          antSword['tabbar'].tabs(tab).close();
          break;
        default:
          // 检测是否有注册事件？执行注册事件：忽略
          let caller = this.events[cmd];
          if (caller instanceof Function) { caller() };
      }
    });
  }

  reg(name, event) {
    this['events'][name] = event;
  }

  run(name) {
    this['events'][name]();
  }

}

module.exports = Menubar;
