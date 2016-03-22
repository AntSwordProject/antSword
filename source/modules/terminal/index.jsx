// 
// 虚拟终端模块
// 

// import React from 'react';
// import ReactDOM from 'react-dom';

const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['terminal'];
// const ipcRenderer = antSword['ipcRenderer'];

class Terminal {

  constructor(opts) {
    const tabbar = antSword['tabbar'];
    const hash = String(Math.random()).substr(2, 10);

    tabbar.addTab(
      `tab_terminal_${hash}`,
      // `<i class="fa fa-terminal"></i> ${LANG['title']} \/\/ ${opts['ip']}`,
      `<i class="fa fa-terminal"></i> ${opts['ip']}`,
      null, null, true, true
    );
    tabbar.attachEvent('onTabClick', (id,lid) => {
      if (id === `tab_terminal_${hash}`) {
        this.term ? this.term.focus() : 0;
      };
    });

    const cell = tabbar.cells(`tab_terminal_${hash}`);
    // ReactDOM.render(
    //   <div id={`div_terminal_${hash}`} style={{
    //     height: '100%',
    //     margin: '0',
    //     padding: '0px 5px 1px 5px',
    //     overflow: 'scroll'
    //   }} />
    //   , cell.cell
    // );
    cell.attachHTMLString(`
      <div id="div_terminal_${hash}" style="height:100%;margin:0;padding:0 5px 1px 5px;overflow:scroll"></div>
    `);

    this.path = '';
    this.opts = opts;
    this.hash = hash;
    this.term = null;
    this.cell = cell;
    this.isWin = true;
    this.core = new antSword['core'][opts['type']](opts);

    this.cache = new antSword['CacheManager'](this.opts['_id']);
    // this.initTerminal($(`#div_terminal_${hash}`));
    // 获取缓存::info
    const dom = $(`#div_terminal_${hash}`);
    const cache_info = this.cache.get('info');
    if (cache_info) {
      this.initTerminal(cache_info, dom);
    }else{
      this.cell.progressOn();
      this.core.base.info((ret) => {
        this.cell.progressOff();
        // 判断获取数据是否正确
        // let info = ret.split('\t');
        // if (info.length !== 4) {
        //   toastr.error('Loading infomations failed!', LANG_T['error']);
        //   return this.cell.close();
        // };
        // 更新缓存
        this.cache.set('info', ret);
        // ipcRenderer.sendSync('cache-add', {
        //   id: this.opts['id'],
        //   tag: 'info',
        //   cache: ret
        // });
        // 初始化终端
        this.initTerminal(ret, dom);
      }, (err) => {
        toastr.error((typeof(err) === 'object') ? JSON.stringify(err) : String(err), LANG_T['error']);
        this.cell.progressOff();
        this.cell.close();
      });
    }
  }

  // 初始化终端
  initTerminal(ret, dom) {
    // this.cell.progressOn();
    // // 获取缓存info
    // const _info = ipcRenderer.sendSync('cache-get', {
    //   id: this.opts['id'],
    //   tag: 'info'
    // });
    // this.core.base.info((ret) => {
    //   this.cell.progressOff();
      let info = ret.split('\t');
      let info_user;
      let info_path;
      let info_drive;
      let info_system;
      // 解析banner
      let banner = `[[b;cyan;](*) ${LANG['banner']['title']}]`;
      // 判断获取数据是否正确
      if (info.length === 4) {
        info_user = info[3];
        info_path = info[0];
        info_drive = info[1];
        info_system = info[2];
      }else if (info.length === 2) {
        info_path = info[0];
        info_drive = info[1];
      }else{
        toastr.error('Loading infomations failed!<br/>' + ret, LANG_T['error']);
        this.cache.del('info');
        return this.cell.close();
      };
      info_path = info_path.replace(/\\/g, '/').replace(/\.$/, '');
      // 判断是否为linux
      if (info_path.substr(0, 1) === '/') {
        this.isWin = false;
      };
      this.path = info_path;
      banner += `\n[[b;#99A50D;]${LANG['banner']['path']}]: [[;#C3C3C3;]${info_path}]`;
      banner += `\n[[b;#99A50D;]${LANG['banner']['drive']}]: [[;#C3C3C3;]${info_drive}]`;
      if (info.length === 4) {
        banner += `\n[[b;#99A50D;]${LANG['banner']['system']}]: [[;#C3C3C3;]${info_system}]`;
        banner += `\n[[b;#99A50D;]${LANG['banner']['user']}]: [[;#C3C3C3;]${info_user}]`;
      }
      // 初始化终端
      this.term = dom.terminal( (cmd, term) => {
        if (!cmd) { return false };
        // 如果为exit||quit则关闭窗口
        if (cmd === 'exit' || cmd === 'quit') { return this.cell.close() };
        term.pause();
        // 是否有缓存
        let cache_tag = 'command-' + new Buffer(this.path + cmd).toString('base64');
        let cache_cmd;
        if (cache_cmd = this.cache.get(cache_tag)) {
          term.echo(antSword.noxss(cache_cmd));
          return term.resume();
        };
        this.core.command.exec({
            cmd: this.parseCmd(cmd, this.path),
            bin: this.isWin ? 'cmd' : '/bin/sh'
          }, (_) => {
            // 解析出命令执行路径
            const index_s = _.indexOf('[S]');
            const index_e = _.lastIndexOf('[E]');
            let _path = _.substr(index_s + 3, index_e - index_s - 3);


            // let _sindex = _.indexOf('[S]') + 3;
            // let _eindex = _.indexOf('[E]');
            // let _path = _.substr(_sindex, _eindex - _sindex);
            let output = _.replace(`[S]${_path}[E]`, '');
            _path = _path.replace(/\n/g, '').replace(/\r/g, '');

            this.path = _path || this.path;
            term.set_prompt(this.parsePrompt(info_user));

            // let output = _.substr(0, _sindex - 3).replace(/\n$/, '');
            // 去除换行符
            [/\n\n$/, /^\n\n/, /\r\r$/, /^\r\r/, /\r\n$/, /^\r\n/, /\n\r$/, /^\n\r/, /\r$/, /^\r/, /\n$/, /^\n/].map((_) => {
              output = output.replace(_, '');
            });
            // output = output.replace(/\n$/, '').replace(/^\n/, '').replace(/^\r/, '').replace(/\r$/, '').;
            if (output.length > 0) {
              term.echo(antSword.noxss(output));
              // 保存最大100kb数据
              if (output.length < (1024 * 1024)) {
                this.cache.set(cache_tag, output);
              };
            };
            term.resume();
          }, (_) => {
            term.error('ERR: ' + (_ instanceof Object) ? JSON.stringify(_) : String(_));
            term.resume();
          }
        )
      }, {
          greetings: banner,
          name: `terminal_${this.hash}`,
          prompt: this.parsePrompt(info_user),
          exit: false
      });
    // }, (err) => {
    //   toastr.error(err, LANG_T['error']);
    //   this.cell.progressOff();
    //   this.cell.close();
    // });
  }

  // 生成CMD代码
  parseCmd(cmd, path) {
    path = path.replace(/\\\\/g, '\\').replace(/"/g, '\\"').replace(/\\/g, '\\\\');
    return this.isWin ? `cd /d "${path}"&${cmd}&echo [S]&cd&echo [E]` : `cd "${path}";${cmd};echo [S];pwd;echo [E]`;
  }

  // 生成路径提示
  parsePrompt(user) {
    let ret = this.isWin ? '[[b;white;]' + this.path.replace(/\//g, '\\') + '> ]' : (user ? ('([[b;#E80000;]' + user + ']:[[;#0F93D2;]') : '[[;0F93D2;]') + this.path + ']) $ ';
    return antSword.noxss(ret);
  }

}

export default Terminal;