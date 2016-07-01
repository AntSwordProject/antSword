/**
 * 网站浏览模块
 * 开写：2016/07/01
 */

const CookieMgr = require('./cookiemgr');

class ViewSite {
  constructor(opts) {
    const hash = String(Math.random()).substr(2, 10);

    // 初始化UI::tabbar
    const tabbar = antSword['tabbar'];
    tabbar.addTab(
      `tab_viewsite_${hash}`,
      `<i class="fa fa-chrome"></i> ${opts['ip']}`,
      null, null, true, true
    );
    tabbar.attachEvent('onTabClick', (id,lid) => {
      if (id !== `tab_viewsite_${hash}`) { return };
    });

    this.opts = opts;
    this.cell = tabbar.cells(`tab_viewsite_${hash}`);

    // 初始化工具栏
    this.toolbar = this._initToolbar();

    this.grid = this._initGrid();

    // 定时刷新Cookie
    this._refreshCookie();
    const inter = setInterval(() => {
      if (this.grid.clearAll instanceof Function) {
        this._refreshCookie();
      } else {
        clearInterval(inter);
      }
    }, 1000);

    // 打开浏览窗口
    this._loadURL(opts.url);
  }

  /**
   * 初始化工具栏
   * @return {[type]} [description]
   */
  _initToolbar() {
    const toolbar = this.cell.attachToolbar();
    toolbar.loadStruct([
      { id: 'save', type: 'button', icon: 'save', text: '保存' },
      { type: 'separator' },
    ]);
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'save':
          this._saveCookie();
          break;
      }
    })
    return toolbar;
  }


  /**
   * 初始化grid
   * @return {[type]} [description]
   */
  _initGrid() {
    const grid = this.cell.attachGrid();
    // 设置grid头
    grid.setHeader('Name,Value,Domain,Path,Expires / Max-Age,Size,HTTP,Secure');
    grid.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
    grid.setColSorting('str,str,str,str,str,str,str,str');
    grid.setInitWidths("120,*,120,50,150,50,50,60");
    grid.setColAlign("left,left,left,left,left,right,center,left");
    grid.enableMultiselect(true);
    grid.init();
    return grid;
  }

  /**
   * 刷新Cookie
   * @return {[type]} [description]
   */
  _refreshCookie() {
    CookieMgr.get({
      url: this.opts['url']
    }).then((cookie) => {
      let data = [];
      cookie.map((c, i) => {
        data.push({
          id: i + 1,
          data: [
            c.name, c.value, c.domain,
            c.path, new Date(c.expirationDate).toUTCString(),
            c.name.length + c.value.length, c.httpOnly, c.secure
          ]
        });
      });
      // 刷新UI
      this.grid.clearAll();
      this.grid.parse({
        'rows': data
      }, 'json');
    })
  }


  /**
   * 保存Cookie到配置
   * @return {[type]} [description]
   */
  _saveCookie() {
    CookieMgr.getStr({
      url: this.opts.url
    }).then((cookie) => {
      // 1. 获取旧数据
      const oldHttpConf = (antSword.ipcRenderer.sendSync('shell-findOne', this.opts._id).httpConf || {});
      // 2. 添加新数据(cookie)
      const httpConf = Object.assign({}, oldHttpConf, {
        headers: Object.assign({}, oldHttpConf.headers || {}, {
          Cookie: cookie
        })
      })
      // 3. 更新数据
      const ret = antSword.ipcRenderer.sendSync('shell-updateHttpConf', {
        _id: this.opts._id,
        conf: httpConf
      });
      if (ret === 1) {
        toastr.success('保存Cookie成功！', '成功');
      } else {
        toastr.error('保存Cookie失败！' + ret, '失败');
      }
    })
  }


  /**
   * 初始化浏览窗口
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  _loadURL(url) {
    let win = new antSword['remote'].BrowserWindow({
      width: 930,
      height: 666,
      minWidth: 888,
      minHeight: 555,
      show: false,
      webPreferences: {
        nodeIntegration: false,
      },
      title: 'AntSword.Store'
    });
    win.on('close', () => {
      win = null;
    });
    win.loadURL(url);
    win.show();
    win.openDevTools();
  }
}

module.exports = ViewSite;