/**
 * 虚拟终端模块
 * 更新：2016/04/13
 * 作者：蚁逅 <https://github.com/antoor>
 */
const LANG = antSword['language']['terminal'];
const LANG_T = antSword['language']['toastr'];

class Terminal {

  constructor(opts, options = {}) {
    // 生存一个随机ID，用于标识多个窗口dom
    const hash = String(Math.random()).substr(2, 10);

    // 初始化UI::tabbar
    const tabbar = antSword['tabbar'];
    tabbar.addTab(`tab_terminal_${hash}`, `<i class="fa fa-terminal"></i> ${opts['ip']}`, null, null, true, true);
    tabbar.attachEvent('onTabClick', (id, lid) => {
      if (id !== `tab_terminal_${hash}`) {
        return
      };
      this.term ?
        this
        .term
        .focus() :
        0;
    });
    let config = {
      tsize: 1,
    };
    this.config = JSON.parse(antSword['storage']("adefault_terminal", false, JSON.stringify(config)));

    // 初始化UI::cell
    const cell = tabbar.cells(`tab_terminal_${hash}`);
    cell.attachHTMLString(`
      <div
        id="div_terminal_${hash}"
        style="height:100%;margin:0;padding:0 5px 1px 5px;overflow:scroll;--size:${parseFloat(this.config.tsize)};"
      ></div>
    `);
    this.path = '';
    this.opts = opts;
    this.options = options || {};
    this.hash = hash;
    this.term = null;
    this.cell = cell;
    this.isWin = true;
    this.isPowershell = false;
    this.sessbin = null;
    this.sess_powershell = null;
    this.core = new antSword['core'][opts['type']](opts);
    this.cache = new antSword['CacheManager'](this.opts['_id']);
    this.asenvironmet = {};

    this
      .getInformation()
      .then((ret) => {
        this.initTerminal(ret['info'], ret['dom']);
        if (this.options.hasOwnProperty("path")) {
          if (this.isWin && this.path.substr(0, 1).toUpperCase() != this.options.path.substr(0, 1).toUpperCase()) {
            this
              .term
              .exec(`${this.options.path.substr(0, 1).toUpperCase()}:`);
          }
          this
            .term
            .exec(`cd ${this.options.path}`);
        }
        if (this.options.hasOwnProperty("exec")) {
          this.core.command.exec = this.options.exec;
        }
        if (this.options.hasOwnProperty("tsize")) {
          this.term[0].style.setProperty("--size", parseFloat(this.options.size));
        }
      })
      .catch((err) => {
        toastr.error((typeof (err) === 'object') ?
          JSON.stringify(err) :
          String(err), LANG_T['error']);
        this
          .cell
          .progressOff();
        this
          .cell
          .close();
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
      let infoCache = this
        .cache
        .get('info');
      // 如果有缓存？初始化终端：获取信息&&保存缓存&&初始化终端
      if (infoCache) {
        return ret({
          dom: dom,
          info: infoCache
        });
      }
      // 开始获取信息
      this
        .cell
        .progressOn();
      this
        .core
        .request(this.core.base.info())
        .then((_ret) => {
          this
            .cell
            .progressOff();
          this
            .cache
            .set('info', _ret['text']);
          return ret({
            dom: dom,
            info: _ret['text']
          });
        })
        .catch((e) => {
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
    let self = this;
    let info = ret.split('\t');
    let infoUser,
      infoPath,
      infoDrive,
      infoSystem;
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
      this
        .cache
        .del('info');
      return this
        .cell
        .close();
    }

    // 转换路径特殊字符
    infoPath = infoPath
      .replace(/\\/g, '/')
      .replace(/\.$/, '');

    // 判断是否为!win
    this.isWin = !(infoPath.substr(0, 1) === '/')
    this.path = infoPath;

    // 组合banner
    banner += `\n[[b;#99A50D;]${LANG['banner']['path']}]: [[;#C3C3C3;]${antSword.noxss(infoPath)}]`;
    banner += `\n[[b;#99A50D;]${LANG['banner']['drive']}]: [[;#C3C3C3;]${antSword.noxss(infoDrive)}]`;
    if (info.length === 4) {
      banner += `\n[[b;#99A50D;]${LANG['banner']['system']}]: [[;#C3C3C3;]${antSword.noxss(infoSystem)}]`;
      banner += `\n[[b;#99A50D;]${LANG['banner']['user']}]: [[;#C3C3C3;]${antSword.noxss(infoUser)}]`;
    }

    // 初始化终端
    this.term = dom.terminal((cmd, term) => {
      if (!cmd) {
        return false
      }
      // 如果为exit||quit则关闭窗口
      if (cmd === 'exit' || cmd === 'quit') {
        return this
          .cell
          .close()
      }
      // clear清空
      if (cmd === 'cls' || cmd === 'clear') {
        return term.clear()
      }

      if (cmd === 'ashelp') {
        term.echo(LANG['ascmd']['ashelp']);
        return;
      }
      if (cmd === 'aslistcmd') {
        var binarr = "";
        if (this.isWin) {
          binarr = [
            "C:/Windows/System32/cmd.exe",
            "C:/Windows/SysWOW64/cmd.exe",
            "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
            "C:/Windows/SysWOW64/WindowsPowerShell/v1.0/powershell.exe",
            "C:/Windows/System32/WindowsPowerShell/v2.0/powershell.exe",
            "C:/Windows/SysWOW64/WindowsPowerShell/v2.0/powershell.exe",
            "C:/Windows/System32/WindowsPowerShell/v3.0/powershell.exe",
            "C:/Windows/SysWOW64/WindowsPowerShell/v3.0/powershell.exe",
            "C:/Windows/System32/WindowsPowerShell/v4.0/powershell.exe",
            "C:/Windows/SysWOW64/WindowsPowerShell/v4.0/powershell.exe"
          ].join(',');
        } else {
          binarr = ["/bin/sh", "/bin/ash", "/bin/bash", "/bin/zsh", "/bin/busybox"].join(',');
        }
        this
          .core
          .request(this.core.command.listcmd({
            binarr: binarr
          }))
          .then((ret) => {
            let res = ret['text'];
            if (res.indexOf("ERROR://") > -1) {
              throw res;
            }
            let result = "";
            res
              .split('\n')
              .map((v) => {
                var line = v.split('\t');
                if (line.length == 2) {
                  var r = parseInt(line[1]) === 1 ?
                    '[[b;#15af63;]OK]' :
                    '[[b;#E80000;]FAIL]';
                  result += `${line[0]}\t\t\t${r}\n`;
                }
              });
            term.echo(result);
            term.resume();
          })
          .catch((err) => {
            term.resume();
          });
        return;
      }
      if (cmd.substr(0, 5) === 'ascmd') {
        var sessbin = cmd
          .substr(5)
          .trim();
        if (sessbin.length > 0) {
          self.sessbin = sessbin;
          term.echo(LANG['ascmd']['ascmd'](antSword.noxss(self.sessbin)));
        } else {
          term.echo(LANG['ascmd']['ashelp']);
        }
        return;
      }
      if (cmd.substr(0, 12) === 'aspowershell') {
        var _switch = cmd
          .substr(12)
          .trim()
          .toLowerCase();
        if (_switch === "on") {
          self.sess_powershell = true;
          term.echo(LANG['ascmd']['aspowershell']["on"]);
        } else {
          self.sess_powershell = false;
          term.echo(LANG['ascmd']['aspowershell']["off"]);
        }
        return;
      }
      // 当 web 目录使用的是 smb 目录时, windows 下路径为 //xxx.xxx.xxx.xxx/share
      // 第一个字符为 / 则会识别为 Linux 系统, 需要使用该指令手动切换成 windows mode
      // Fix https://github.com/AntSwordProject/antSword/issues/229
      if (cmd.substr(0, 9) === 'aswinmode') {
        var _switch = cmd.substr(9).trim().toLowerCase();
        if (_switch === "off") {
          self.isWin = false;
          term.echo("Windows Mode: [[b;red;]Off]");
        } else if (_switch === "on") {
          self.isWin = true;
          term.echo("Windows Mode: [[b;green;]On]");
        } else {
          term.echo(`Current Windows Mode: ${self.isWin ? "[[b;green;]On]" : "[[b;red;]Off]"}`);
        }
        return;
      }
      if (cmd.substr(0, 5) === 'asenv') {
        var envstr = cmd.substr(5).trim();
        if (envstr.length > 0 && envstr.indexOf('=') > 0) {
          var k = envstr.substr(0, envstr.indexOf('=')).trim();
          var v = envstr.substr(envstr.indexOf('=') + 1).trim();
          this.asenvironmet[k] = v;
        } else {
          Object.keys(this.asenvironmet).map((k) => {
            term.echo(`${antSword.noxss(k)}=${antSword.noxss(this.asenvironmet[k])}`);
          });
        }
        return;
      }
      term.pause();
      // 是否有缓存
      let cacheTag = 'command-' + Buffer
        .from(this.path + cmd)
        .toString('base64');
      let cacheCmd = this
        .cache
        .get(cacheTag);
      if ((this.opts.otherConf || {})['terminal-cache'] === 1 && cacheCmd) {
        term.echo(antSword.noxss(cacheCmd, false));
        return term.resume();
      };
      // 获取自定义执行路径
      let _bin = this.isWin ?
        'cmd' :
        '/bin/sh';
      let _confBin = (this.opts['otherConf'] || {})['command-path'];
      _bin = _confBin || _bin;
      if (self.sessbin !== null) {
        _bin = self.sessbin;
      }
      if (self.isWin && _bin.indexOf("powershell") > -1) {
        self.isPowershell = true
      } else {
        self.isPowershell = false
      }
      if (self.sess_powershell !== null) {
        self.isPowershell = self.sess_powershell;
      }
      // 开始执行命令
      this
        .core
        .request(this.core.command.exec({
          cmd: this.parseCmd(cmd, this.path),
          bin: _bin,
          env: Object.keys(this.asenvironmet).map((k) => {
            return `${k}|||askey|||${this.asenvironmet[k]}|||asline|||`;
          }).join(''),
        }))
        .then((ret) => {
          let _ = antSword.unxss(ret['text'], false);
          // 解析出命令执行路径
          const indexS = _.lastIndexOf('[S]');
          const indexE = _.lastIndexOf('[E]');
          let _path = _.substr(indexS + 3, indexE - indexS - 3);

          let output = _.replace(`[S]${_path}[E]`, '');
          _path = _path
            .replace(/\n/g, '')
            .replace(/\r/g, '');

          this.path = _path || this.path;
          term.set_prompt(this.parsePrompt(infoUser));

          // 去除换行符
          [
            /\n\n$/,
            /^\n\n/,
            /\r\r$/,
            /^\r\r/,
            /\r\n$/,
            /^\r\n/,
            /\n\r$/,
            /^\n\r/,
            /\r$/,
            /^\r/,
            /\n$/,
            /^\n/
          ].map((_) => {
            output = output.replace(_, '');
          });
          if (output.length > 0) {
            term.echo(antSword.noxss(output, false));
            // 保存最大100kb数据
            if (output.length < (1024 * 1024)) {
              this
                .cache
                .set(cacheTag, output);
            };
          };
          term.resume();
        })
        .catch((_) => {
          // term.error('ERR: ' + (_ instanceof Object) ? JSON.stringify(_) : String(_));
          term.resume();
        });
    }, {
      greetings: banner,
      name: `terminal_${this.hash}`,
      prompt: this.parsePrompt(infoUser),
      numChars: 2048,
      exit: false,
      // < 1.0.0 时使用3个参数 completion: (term, value, callback) => {}
      completion: (value, callback) => {
        callback(['asenv', 'ashelp', 'ascmd', 'aslistcmd', 'aspowershell', 'aswinmode', 'quit', 'exit'].concat(
          this.isWin ? [
            'dir', 'whoami', 'net', 'ipconfig', 'netstat', 'cls', 'wscript', 'nslookup', 'copy', 'del', 'ren', 'md', 'type', 'ping'
          ] : [
            'cd', 'ls', 'find', 'cp', 'mv', 'rm', 'ps', 'kill', 'file', 'tar', 'cat', 'chown', 'chmod', 'pwd', 'history', 'whoami', 'ifconfig', 'clear', 'ping'
          ]))
      },
      keydown: (event, terminal) => {
        if (event.ctrlKey == true) {
          // ctrl 键按下
          switch (event.keyCode) {
            case 187: // 放大 ctrl +
              var s = parseFloat(terminal[0].style.getPropertyValue("--size"));
              if (isNaN(s)) {
                s = 1;
              }
              if (s < 5) {
                s += 0.05;
              }
              terminal[0]
                .style
                .setProperty("--size", s);
              return false;
            case 189: // 缩小 ctrl -
              var s = parseFloat(terminal[0].style.getPropertyValue("--size"));
              if (isNaN(s)) {
                s = 1;
              }
              if (s > 0.5) {
                s -= 0.05;
              }
              terminal[0]
                .style
                .setProperty("--size", s);
              return false;
            default:
              break;
          }
        }
      }
    });
    this
      .term
      .echo(`[[b;cyan;](*) ${LANG['ascmd']['help']}]`);
  }

  /**
   * 根据执行命令&&路径生成最终command
   * @param  {String} cmd  要执行的命令
   * @param  {String} path 当前路径
   * @return {String}      最终执行命令
   */
  parseCmd(cmd, path) {
    path = path
      .replace(/\\\\/g, '\\')
      .replace(/"/g, '\\"')
      .replace(/\\/g, '\\\\');
    return (this.isWin ?
      this.isPowershell ?
      `cd "${path}";${cmd};echo [S];(pwd).path;echo [E]` :
      `cd /d "${path}"&${cmd}&echo [S]&cd&echo [E]` :
      `cd "${path}";${cmd};echo [S];pwd;echo [E]`);
  }

  /**
   * 生成路径提示符
   * @param  {String} user 当前用户名
   * @return {String}      term输出字符串
   */
  parsePrompt(user) {
    return antSword.noxss(this.isWin ?
      `[[b;white;]${this.path.replace(/\//g, '\\')}> ]` :
      (user ?
        `([[b;#E80000;]${user}]:[[;#0F93D2;]` :
        '[[;0F93D2;]') + this.path + ']) $ ');
  }

}

// export default Terminal;
module.exports = Terminal;