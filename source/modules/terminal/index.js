/**
 * 虚拟终端模块
 * 更新：2016/04/13
 * 作者：蚁逅 <https://github.com/antoor>
 */

const LANG = antSword['language']['terminal'];
const LANG_T = antSword['language']['toastr'];

class Terminal {

  constructor(opts) {
    // 生存一个随机ID，用于标识多个窗口dom
    const hash = String(Math.random()).substr(2, 10);

    // 初始化UI::tabbar
    const tabbar = antSword['tabbar'];
    tabbar.addTab(
      `tab_terminal_${hash}`,
      `<i class="fa fa-terminal"></i> ${opts['ip']}`,
      null, null, true, true
    );
    tabbar.attachEvent('onTabClick', (id,lid) => {
      if (id !== `tab_terminal_${hash}`) { return };
      this.term ? this.term.focus() : 0;
    });
    // 初始化UI::cell
    const cell = tabbar.cells(`tab_terminal_${hash}`);
    cell.attachHTMLString(`
      <div
        id="div_terminal_${hash}"
        style="height:100%;margin:0;padding:0 5px 1px 5px;overflow:scroll"
      ></div>
    `);

    this.path = '';
    this.opts = opts;
    this.hash = hash;
    this.term = null;
    this.cell = cell;
    this.isWin = true;
    this.core = new antSword['core'][opts['type']](opts);
    this.cache = new antSword['CacheManager'](this.opts['_id']);

    this
      .getInformation()
      .then((ret) => {
        this.initTerminal(ret['info'], ret['dom']);
      })
      .catch((err) => {
        toastr.error((typeof(err) === 'object') ? JSON.stringify(err) : String(err), LANG_T['error']);
        this.cell.progressOff();
        this.cell.close();
      })
  }

  /**
   * 获取目标信息
   * @return {Promise} 返回一个Promise操作对象//{dom,info}
   */
  getInformation() {
    return new Promise((ret, rej) => {
      // 获取DOM
      const dom = $(`#div_terminal_${this.hash}`);
      // 获取缓存
      let infoCache = this.cache.get('info');
      // 如果有缓存？初始化终端：获取信息&&保存缓存&&初始化终端
      if (infoCache) {
        return ret({
          dom: dom,
          info: infoCache
        });
      }
      // 开始获取信息
      this.cell.progressOn();
      this.core.request(
        this.core.base.info()
      ).then((_ret) => {
        this.cell.progressOff();
        this.cache.set('info', _ret['text']);
        return ret({
          dom: dom,
          info: _ret['text']
        });
      }).catch((e) => {
        rej(e);
      });
    });
  }

  /**
   * 初始化终端
   * @param  {String} ret 目标信息
   * @param  {Object} dom 要操作的dom元素
   * @return {None}     [description]
   */
  initTerminal(ret, dom) {
    let info = ret.split('\t');
    let infoUser, infoPath, infoDrive, infoSystem;
    let banner = `[[b;cyan;](*) ${LANG['banner']['title']}]`;

    // 判断数据是否正确
    if (info.length === 4) {
      infoPath = info[0];
      infoDrive = info[1];
      infoSystem = info[2];
      infoUser = info[3];
    } else if (info.length === 2) {
      infoPath = info[0];
      infoDrive = info[1];
    } else {
      toastr.error('Loading infomations failed!<br/>' + ret, LANG_T['error']);
      this.cache.del('info');
      return this.cell.close();
    }

    // 转换路径特殊字符
    infoPath = infoPath.replace(/\\/g, '/').replace(/\.$/, '');

    // 判断是否为!win
    this.isWin = !(infoPath.substr(0, 1) === '/')
    this.path = infoPath;

    // 组合banner
    banner += `\n[[b;#99A50D;]${LANG['banner']['path']}]: [[;#C3C3C3;]${infoPath}]`;
    banner += `\n[[b;#99A50D;]${LANG['banner']['drive']}]: [[;#C3C3C3;]${infoDrive}]`;
    if (info.length === 4) {
      banner += `\n[[b;#99A50D;]${LANG['banner']['system']}]: [[;#C3C3C3;]${infoSystem}]`;
      banner += `\n[[b;#99A50D;]${LANG['banner']['user']}]: [[;#C3C3C3;]${infoUser}]`;
    }

    // 初始化终端
    this.term = dom.terminal( (cmd, term) => {
      if (!cmd) { return false };
      // 如果为exit||quit则关闭窗口
      if (cmd === 'exit' || cmd === 'quit') { return this.cell.close() };
      term.pause();
      // 是否有缓存
      let cacheTag = 'command-' + new Buffer(this.path + cmd).toString('base64');
      let cacheCmd = this.cache.get(cacheTag);
      if (
        (this.opts.otherConf || {})['terminal-cache'] === 1 && cacheCmd
      ) {
        term.echo(
          antSword.noxss(cacheCmd, false)
        );
        return term.resume();
      };
      // 开始执行命令
      this.core.request(
        this.core.command.exec({
          cmd: this.parseCmd(cmd, this.path),
          bin: this.isWin ? 'cmd' : '/bin/sh'
        })
      ).then((ret) => {
        let _ = ret['text'];
        // 解析出命令执行路径
        const indexS = _.indexOf('[S]');
        const indexE = _.lastIndexOf('[E]');
        let _path = _.substr(indexS + 3, indexE - indexS - 3);

        let output = _.replace(`[S]${_path}[E]`, '');
        _path = _path.replace(/\n/g, '').replace(/\r/g, '');

        this.path = _path || this.path;
        term.set_prompt(this.parsePrompt(infoUser));

        // 去除换行符
        [
          /\n\n$/, /^\n\n/, /\r\r$/,
          /^\r\r/, /\r\n$/, /^\r\n/,
          /\n\r$/, /^\n\r/, /\r$/,
          /^\r/, /\n$/, /^\n/
        ].map((_) => {
          output = output.replace(_, '');
        });
        if (output.length > 0) {
          term.echo(
            antSword.noxss(output, false)
          );
          // 保存最大100kb数据
          if (output.length < (1024 * 1024)) {
            this.cache.set(cacheTag, output);
          };
        };
        term.resume();
      }).catch((_) => {
        // term.error('ERR: ' + (_ instanceof Object) ? JSON.stringify(_) : String(_));
        term.resume();
      });
    }, {
        greetings: banner,
        name: `terminal_${this.hash}`,
        prompt: this.parsePrompt(infoUser),
        exit: false
    });
  }

  /**
   * 根据执行命令&&路径生成最终command
   * @param  {String} cmd  要执行的命令
   * @param  {String} path 当前路径
   * @return {String}      最终执行命令
   */
  parseCmd(cmd, path) {
    path = path.replace(/\\\\/g, '\\').replace(/"/g, '\\"').replace(/\\/g, '\\\\');
    return (this.isWin
      ? `cd /d "${path}"&${cmd}&echo [S]&cd&echo [E]`
      : `cd "${path}";${cmd};echo [S];pwd;echo [E]`
    );
  }

  /**
   * 生成路径提示符
   * @param  {String} user 当前用户名
   * @return {String}      term输出字符串
   */
  parsePrompt(user) {
    return antSword.noxss(this.isWin
      ? `[[b;white;]${this.path.replace(/\//g, '\\')}> ]`
      : (user ? `([[b;#E80000;]${user}]:[[;#0F93D2;]` : '[[;0F93D2;]') + this.path + ']) $ '
    );
  }

}

// export default Terminal;
module.exports = Terminal;
