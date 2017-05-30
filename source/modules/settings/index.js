//
// 设置模块
//

// import About from './about';
// import Update from './update';
// import Language from './language';
// import AProxy from './aproxy'
const About = require('./about');
// const Update = require('./update');
const Language = require('./language');
const AProxy = require('./aproxy');
const Display = require('./display');
const Encoders = require('./encoders');

class Settings {

  constructor() {
    antSword['menubar'].reg('settings', this.open.bind(this));
    ['about', 'update', 'language', 'aproxy','display', 'encoders'].map((_) => {
      antSword['menubar'].reg(`settings-${_}`, this.setActive.bind(this, _));
    });
    return this;
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
    this.about = new About(sidebar);
    this.language = new Language(sidebar);
    // this.update = new Update(sidebar);
    this.aproxy = new AProxy(sidebar);
    this.display = new Display(sidebar);
    // Encoders
    this.encoders = new Encoders(sidebar);
    this.cell = cell;
    this.sidebar = sidebar;

  }

  // @设置当前激活项
  setActive(id) {
    this.open();
    this.sidebar.items(id).setActive();
  }

}

module.exports = Settings;
