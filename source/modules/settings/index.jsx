//
// 设置模块
//

import About from './about';
import Update from './update';
import Language from './language';
import AProxy from './aproxy'

class Settings {

  constructor() {
    antSword['menubar'].reg('settings', this::this.open);
    ['about', 'update', 'language'].map((_) => {
      antSword['menubar'].reg(`settings-${_}`, this.setActive.bind(this, _));
    });
  }

  open() {
    const tabbar = antSword['tabbar'];
    // 判断是否已经打开
    if (tabbar.tabs('tab_about')) {
      return tabbar.tabs('tab_about').setActive();
    };
    tabbar.addTab(
      'tab_about',
      '<i class="fa fa-cog"></i>',
      null, null, true, true
    );
    const cell = tabbar.tabs('tab_about');

    const sidebar = cell.attachSidebar({
      template: 'text',
      width: 200
    });
    new About(sidebar);
    new Language(sidebar);
    new Update(sidebar);
    new AProxy(sidebar);

    this.cell = cell;
    this.sidebar = sidebar;

  }

  // @设置当前激活项
  setActive(id) {
    this.open();
    this.sidebar.items(id).setActive();
  }

}

export default Settings;
