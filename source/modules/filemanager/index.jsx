// 
// 文件管理模块
// 

import Files from './files';
import Tasks from './tasks';
import Folder from './folder';
import ENCODES from '../../base/encodes';

const fs = global.require('fs');
const iconv = global.require('iconv-lite');
const crypto = global.require('crypto');
const remote = global.require('remote');
const dialog = remote.require('dialog');

// 加载语言模板
const LANG = antSword['language']['filemanager'];
const LANG_T = antSword['language']['toastr'];

class FileManager {

  constructor(opts) {
    const tabbar = antSword['tabbar'];
    const hash = String(Math.random()).substr(2, 10);

    tabbar.addTab(
      `tab_filemanager_${hash}`,
      // `<i class="fa fa-folder-o"></i> ${LANG['title']} \/\/ ${opts['ip']}`,
      `<i class="fa fa-folder-o"></i> ${opts['ip']}`,
      null, null, true, true
    );

    // 创建框架
    const cell = tabbar.cells(`tab_filemanager_${hash}`);

    this.isWin = true;
    this.path = '/';
    this.home = '/';
    this.devices = [];
    // this.cache = {};
    this.cell = cell;
    this.opts = opts;
    this.cache = new antSword['CacheManager'](opts['_id']);
    this.core = new antSword['core'][opts['type']](opts);
    this.win = new dhtmlXWindows();
    this.win.attachViewportTo(this.cell.cell);

    // 获取基本信息
    const cache_info = this.cache.get('info');
    if (cache_info) {
      this.initUI(cache_info);
    }else{
      this.cell.progressOn();
      this.core.base.info((ret) => {
        this.initUI(ret);
        this.cell.progressOff();
      }, (err) => {
        this.cell.progressOff();
        this.cell.close();
        toastr.error((typeof(err) === 'object') ? JSON.stringify(err) : String(err), LANG_T['error']);
      });
    }
  }

  // 初始化UI
  initUI(ret) {
    // 判断获取数据是否正确
    let info = ret.split('\t');
    if (!info.length >= 2) {
      toastr.error('Loading infomations failed!<br/>' + ret, LANG_T['error']);
      this.cache.del('info');
      return this.cell.close();
    };
    let info_path = info[0].replace(/\\/g, '/').replace(/\.$/, '');
    let info_drive = info[1];

    // 判断是否为linux
    if (info_path.substr(0, 1) === '/') {
      this.isWin = false;
    };
    this.path = info_path;
    this.home = info_path;
    info_drive.split(':').map((_) => {
      if (!_) { return };
      this.devices.push(_ === '/' ? _ : _ + ':/');
    });

    // 模块对象
    const layout = this.cell.attachLayout('3L');
    this.folder = new Folder(layout.cells('a'), this);
    this.files = new Files(layout.cells('b'), this);
    this.tasks = new Tasks(layout.cells('c'), this);

    this.folder.cell.progressOn();
    this.files.cell.progressOn();
    this.getFiles(this.path, (files) => {
      this.folder.parse(files);
      this.files.parse(files);
    });
  }

  // 本地存储
  // storage('save_key').get('{}')
  // storage('save_key').set('{a:123}')
  storage(key) {
    let md5 = crypto.createHash('md5');
    md5.update(this.opts['url']);
    const k = `${md5.digest('hex').substr(0, 11)}_${key}`
    return {
      get: (def) => localStorage.getItem(k) || def,
      set: (val) => localStorage.setItem(k, val)
    }
  }

  // 获取目录文件列表
  getFiles(p, callback) {

    let self = this;
    let path = this.changePath(p);
    let cache;

    if (!path.endsWith('/')) { path += '/' };
    this.path = path;
    let cache_tag = 'filemanager-files-' + new Buffer(this.path).toString('base64');

    // 判断是否有缓存
    // if (cache = this.cache[path]) {
    //   return callback(cache);
    // };
    if (cache = this.cache.get(cache_tag)) {
      return callback(JSON.parse(cache));
    };

    this.core.filemanager.dir({
      path: path
    }, (ret) => {
      // 判断是否出错
      if (ret.startsWith('ERROR://')) {
        callback([]);
        return toastr.error(ret.substr(9), LANG_T['error']);
      };
      let tmp = ret.split('\n');

      tmp.sort();

      let folders = [];
      let files = [];

      tmp.map( (t) => {
        let _ = t.split('\t');
        let d = {
          name: _[0],
          time: _[1],
          size: _[2],
          attr: _[3]
        }
        if (_[0].endsWith('/')) {
          folders.push(d);
        }else{
          files.push(d);
        }
      } );

      let data = folders.concat(files);
      callback(data);

      // 增加缓存
      // self.cache[path] = data;
      this.cache.set(cache_tag, JSON.stringify(data));
    }, (err) => {
      toastr.error((err instanceof Object) ? JSON.stringify(err) : String(err), LANG_T['error']);
    });
  }

  // 更改目录，返回最终绝对路径
  changePath(path) {
    if (!this.path.endsWith('/')) {
      this.path += '/';
    };
    if (!path.endsWith('/')) {
      path += '/';
    };
    // 如果是当前目录，返回
    if (path === './') {
      return this.path;
    // 如果是上级目录，则判断是否为最后一级？返回最后一级：返回上一级
    }else if (path === '../') {
      let _ = this.path.split('/');
      if (_.length === 2) {
        return _.join('/');
      }else if (_.length > 2) {
        _.pop();
        _.pop();
        _.length === 1 ? _.push('') : 0;
        return _.join('/');
      }else{
        return this.path;
      }
    // 如果是根目录，返回
    }else if (path.startsWith('/') || path.substr(1, 2) === ':/') {
      return path;
    // 如果是相对路径，返回绝对全路径
    }else{
      return this.path + path;
    }
  }

  // 删除文件/目录
  deleteFile(files) {

    let self = this;

    layer.confirm(
      LANG['delete']['confirm'](files.length > 1 ? files.length : files[0]),
      {
        icon: 2,
        shift: 6,
        //skin: 'layui-layer-molv',
        title: `<i class="fa fa-trash"></i> ${LANG['delete']['title']}`,
      },
      (_) => {
        layer.close(_);

        files.map((p) => {
          ((p) => {
            const path = this.path + p;
            this.files.cell.progressOn();
            this.core.filemanager.delete({
              path: path
            }, (ret) => {
              this.files.cell.progressOff();
              if (ret === '1') {
                toastr.success(LANG['delete']['success'](path), LANG_T['success']);
                this.files.refreshPath();
              }else{
                toastr.error(LANG['delete']['error'](path, ret === '0' ? false : ret), LANG_T['error']);
              }
            }, (err) => {
              this.files.cell.progressOff();
              toastr.error(LANG['delete']['error'](path, err), LANG_T['error']);
            })
          })(p);
        });
      }
    )

  }

  // 粘贴文件/文件夹
  // source: 复制源文件/目录
  // name: 复制文件/目录名
  pasteFile(source, name) {

    const target = this.path + name;

    this.files.cell.progressOn();
    this.core.filemanager.copy({
      path: source,
      target: target
    }, (ret) => {
      this.files.cell.progressOff();
      if (ret === '1') {
        // 刷新目录
        this.files.refreshPath();
        // 删除缓存
        delete this.files.Clipboard[name];
        toastr.success(LANG['paste']['success'](name), LANG_T['success']);
      }else{
        toastr.error(LANG['paste']['error'](name, ret === '0' ? false : ret), LANG_T['error']);
      }
    }, (err) => {
      toastr.error(LANG['paste']['error'](name, err), LANG_T['error']);
    });
  }

  // 重命名
  renameFile(name) {
    const isDir = name.endsWith('/');
    layer.prompt({
      value: antSword.noxss(name.replace(/\/$/, '')),
      title: `<i class="fa fa-fa fa-font"></i> ${LANG['rename']['title']} (${antSword.noxss(name)})`
    }, (value, index, elem) => {
      this.files.cell.progressOn();
      this.core.filemanager.rename({
        path: this.path + name,
        name: this.path + value + ((isDir && !value.endsWith('/')) ? '/' : '')
      }, (ret) => {
        this.files.cell.progressOff();
        if (ret === '1') {
          this.files.refreshPath();
          toastr.success(LANG['rename']['success'], LANG_T['success']);
        }else{
          toastr.error(LANG['rename']['error'](ret === '0' ? false : ret), LANG_T['error']);
        }
      }, (err) => {
        toastr.error(LANG['rename']['error'](err), LANG_T['error']);
      });
      layer.close(index);
    });
  }

  // 新建目录
  createFolder() {
    layer.prompt({
      value: LANG['createFolder']['value'],
      title: `<i class="fa fa-folder"></i> ${LANG['createFolder']['title']}`
    }, (value, i, e) => {
      this.files.cell.progressOn();
      this.core.filemanager.mkdir({
        path: this.path + value
      }, (ret) => {
        this.files.cell.progressOff();
        if (ret === '1') {
          this.files.refreshPath();
          toastr.success(LANG['createFolder']['success'](value), LANG_T['success']);
        }else{
          toastr.error(LANG['createFolder']['error'](value, ret === '0' ? false : ret), LANG_T['error']);
        }
      }, (err) => {
        toastr.error(LANG['createFolder']['error'](value, err), LANG_T['error']);
      });
      layer.close(i);
    });
  }

  // 新建文件
  createFile() {
    layer.prompt({
      value: LANG['createFile']['value'],
      title: `<i class="fa fa-file"></i> ${LANG['createFile']['title']}`
    }, (value, i, e) => {
      this.files.cell.progressOn();
      this.core.filemanager.create_file({
        path: this.path + value,
        content: '\0'
      }, (ret) => {
        this.files.cell.progressOff();
        if (ret === '1') {
          this.files.refreshPath();
          toastr.success(LANG['createFile']['success'](value), LANG_T['success']);
        }else{
          toastr.error(LANG['createFile']['error'](value, ret === '0' ? false : ret), LANG_T['error']);
        }
      }, (err) => {
        toastr.error(LANG['createFile']['error'](value, err), LANG_T['error']);
      });
      layer.close(i);
    })
  }

  // 重命名文件/夹
  retimeFile(name, oldtime) {
    layer.prompt({
      value: oldtime,
      title: `<i class="fa fa-clock-o"></i> ${LANG['retime']['title']} (${antSword.noxss(name)})`,
      content: `<input type="text" class="layui-layer-input" onClick="laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss'});" value="${oldtime}">`
    }, (value, i, e) => {
      this.files.cell.progressOn();
      this.core.filemanager.retime({
        path: this.path + name,
        time: value
      }, (ret) => {
        this.files.cell.progressOff();
        if (ret === '1') {
          this.files.refreshPath();
          toastr.success(LANG['retime']['success'](name), LANG_T['success']);
        }else{
          toastr.error(LANG['retime']['error'](name, ret === '0' ? false : ret), LANG_T['error']);
        }
      }, (err) => {
        toastr.error(LANG['retime']['error'](name, err), LANG_T['error']);
      });
      layer.close(i);
    })
  }

  // 预览文件(图片、视频)
  previewFile(name) {
    const path = this.path + name;
    const win = this.createWin({
      title: 'Preview File: ' + path
    });
    win.cell.lastChild['style']['overflow'] = 'scroll';
    win.cell.lastChild['style']['textAlign'] = 'center';
    let data = 'data:image/png;base64,';
    let buff = '';
    this.core.filemanager.download_file({
      path: path
    }, (ret, buff) => {
      let imgData = new Buffer(buff).toString('base64');
      win.attachHTMLString(`<img src="data:/image/png;base64,${imgData}"/>`);
    }, (err) => {

    }, (chunk) => {
      buff += chunk;
      let imgData = data + new Buffer(buff).toString('base64');
    });
  }

  // 下载文件
  downloadFile(name, size) {
    const path = this.path + name;
    const task = this.tasks.new(LANG['download']['task']['name'], path , LANG['download']['task']['wait']);
    // 获取要保存的路径
    dialog.showSaveDialog({
      title: LANG['download']['title'],
      defaultPath: name
    }, (filePath) => {
      if (!filePath) { return task.end(LANG['download']['task']['cancel']) };
      task.update(LANG['download']['task']['start']);
      // setTimeout(() => {
        let down_size = 0;
        this.core.filemanager.download_file({
          path: path
        }, (ret, buff) => {
          // 保存文件
          // fs.writeFileSync(filePath+'_bak', new global.Buffer(buff));
          // 检测文件大小是否一致
          if (buff.length === size) {
            task.success(LANG['download']['task']['success']);
            toastr.success(LANG['download']['success'](name), LANG_T['success']);
          }else if (buff.length === 21) {
            task.failed(buff.toString());
          }else{
            // task.failed(`FileSize(${buff.length} != ${size}`);
            task.failed(LANG['download']['task']['error'](`SizeErr: ${buff.length} != ${size}`))
          }
        }, (err) => {
          task.failed(LANG['download']['task']['error'](err));
          toastr.error(LANG['download']['error'](name, err), LANG_T['error']);
        }, (chunk) => {
          // 写入文件
          fs.writeFileSync(filePath, new global.Buffer(chunk), {
            flag: 'a'
          });
          // 计算进度百分比
          down_size += chunk.length;
          let down_progress = parseInt(parseFloat(down_size / size).toFixed(2) * 100);

          if (!(down_progress % 5)) {
            task.update(down_progress + '%');
          };
          // task.update(`${parseFloat(down_size/size).toFixed(0) * 100} %`);
        });
      // }, 200);
    });
  }

  // wget文件
  wgetFile() {
    let self = this;
    let hash = +new Date();
    // 获取URL
    let _index = layer.prompt({
      title: `<i class="fa fa-cloud-download"></i> ${LANG['wget']['title']}`,
      content: '<input type="text" style="width:300px;" class="layui-layer-input" id="url_' + hash + '" value="http://" placeholder="target url"><p/><input style="width:300px;" type="text" id="path_' + hash + '" class="layui-layer-input" value="' + self.path + '" placeholder="file name">',
      btn: ['wget'],
      yes: (i) => {

        let _url = $(`#url_${hash}`);
        let _path = $(`#path_${hash}`);

        let url = _url.val();
        let path = _path.val();

        if (url.split('/').length < 4) {
          _url.focus();
          return toastr.warning(LANG['wget']['check'], LANG_T['warning']);
        };
        if (path.length < 1) {
          return _path.focus();
        };
        const task = this.tasks.new(LANG['wget']['task']['name'], `${url} -> ${path}`);
        task.update(LANG['wget']['task']['start']);
        this.core.filemanager.wget({
          url: url,
          path: path
        }, (ret) => {
            // 下载成功？当前目录？刷新：删除缓存
            if (ret === '1') {
              task.success(LANG['wget']['task']['success']);
              let _ = path.substr(0, path.lastIndexOf('/') + 1);
              this.files.refreshPath((_ === self.path) ? false : _);
            }else{
              task.failed(LANG['wget']['task']['failed'](ret));
            }
        }, (err) => {
          task.failed(LANG['wget']['task']['error'](err));
        });
        layer.close(i);
      }
    });
    $(`#layui-layer${_index}`).css('width', '400px');
  }

  // 上传文件
  uploadFile() {
    const path = this.path;
    let tasks = {};
    const upload = (filePaths) => {
      if (!filePaths[0]) {
        return false;
      };
      const filePath = filePaths[0];

      let i = 0;
      let buff = [];
      // 数据分段上传，一次上传512kb=1024*512
      let split = 1024 * 512;
      const task = tasks[filePath];
      // 获取文件名
      const fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
      let fileBuff;
      // 读取文件buffer
      try{
        fileBuff = fs.readFileSync(filePath);
      }catch(e) {
        return task.failed(e);
      }

      while (true) {
        const _ = fileBuff.slice(i, i + split);
        i += split;
        if (_.length === 0) { break };
        buff.push(_);
      }

      const all_num = buff.length;
      const upload_func = (arr) => {
        if (!arr[0]) {
          // 上传完毕
          task.success('100%');
          // 刷新目录
          toastr.success(LANG['upload']['success'](fileName), LANG_T['success']);
          // 刷新目录缓存
          this.files.refreshPath(path === this.path ? '' : path);
          return upload(filePaths);
        };
        // 更新进度条
        task.update(`${parseInt((all_num - arr.length) / all_num * 100)}%`);
        // 开始上传分段数据
        this.core.filemanager.upload_file({
          path: path + fileName,
          content: arr[0]
        }, (ret) => {
          if (ret === '1') {
            // 继续上传
            arr.shift();
            upload_func(arr);
          }else{
            task.failed(LANG['upload']['task']['failed'](ret));
            toastr.error(LANG['upload']['error'](fileName, ret === '0' ? '' : '<br/>' + ret), LANG_T['error']);
          }
        }, (err) => {
          task.failed(LANG['upload']['task']['error'](err));
          toastr.error(LANG['upload']['error'](fileName, err), LANG_T['error']);
        });
      }

      upload_func(buff);
      filePaths.shift();
    }
    dialog.showOpenDialog({
      properties: [ 'openFile', 'multiSelections' ]
    }, (filePaths) => {
      if (!filePaths) { return };
      // 逐个文件上传
      filePaths.map((_) => {
        const fileName = _.substr(_.lastIndexOf('/') + 1);
        tasks[_] = this.tasks.new(LANG['upload']['task']['name'], `${fileName} => ${path}`, '准备上传..');
      });
      upload(filePaths);
    });
  }

  // 编辑文件
  editFile(name) {
    let self = this;
    let path = this.path + name;
    let editor = null;
    let codes = '';
    // 创建窗口
    let win = this.createWin({
      title: LANG['editor']['title'](path),
      width: 800
    });
    win.maximize();
    win.progressOn();

    // 检测文件后缀
    let ext = name.substr(name.lastIndexOf('.') + 1);
    let ext_dict = {
      'php': 'php',
      'c': 'c_cpp',
      'cpp': 'c_cpp',
      'h': 'c_cpp',
      'coffee': 'coffee',
      'cfm': 'coldfusion',
      'css': 'css',
      // 'ejs': 'ejs',
      'go': 'golang',
      'html': 'html',
      'ini': 'ini',
      'conf': 'ini',
      'jade': 'jade',
      'java': 'java',
      'js': 'javascript',
      'json': 'json',
      'jsp': 'jsp',
      'jsx': 'jsx',
      'less': 'less',
      'lua': 'lua',
      'md': 'markdown',
      'sql': 'sql',
      'pl': 'perl',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'sh',
      'txt': 'text',
      'xml': 'xml'
    }
    if (!(ext in ext_dict)) { ext = 'txt' };
    // 创建窗口工具栏
    let toolbar = win.attachToolbar();
    let _options = [];
    for (let _ in ext_dict) {
      let _ext = ext_dict[_];
      let _opt = {
        id: `mode_${_ext}`,
        text: `${_ext} (.${_})`,
        icon: 'code',
        type: 'button'
      };
      (_ === ext) ? _opt['selected'] = true : 0;
      _options.push(_opt);
    }
    toolbar.loadStruct([
      { id: 'save', type: 'button', icon: 'save', text: LANG['editor']['toolbar']['save'] },
      { type: 'separator' },
      { type: 'spacer' },
      {
        id: 'encode', type: 'buttonSelect', icon: 'language', openAll: true,
        text: LANG['editor']['toolbar']['encode'],
        options: (() => {
          let ret = [];
          ENCODES.map((_) => {
            let _opt_ = {
              id: `encode_${_}`,
              text: _,
              icon: 'font',
              type: 'button'
            };
            (_ === self.opts['encode'] ? _opt_['selected'] = true : 0);
            ret.push(_opt_);
          });
          return ret;
        })()
      }, {
        id: 'mode', type: 'buttonSelect', icon: 'th-list', openAll: true,
        text: LANG['editor']['toolbar']['mode'],
        options: _options
      },
    ]);
    toolbar.attachEvent('onClick', (id) => {
      if (id === 'save') {
        // 保存代码
        win.progressOn();
        // self.ajax(
        self.core.filemanager.create_file({
          path: path,
          content: editor.session.getValue() || '\0'
        }, (ret) => {
            win.progressOff();
            if (ret === '1') {
              toastr.success(LANG['editor']['success'](path), LANG_T['success']);
              // 刷新目录（显示更改时间、大小等）
              self.files.refreshPath();
            }else{
              toastr.error(LANG['editor']['error'](path, ret === '0' ? '' : '<br/>' + ret), LANG_T['error']);
            }
          }
        )
      }else if (id.startsWith('mode_')) {
        let mode = id.split('_')[1];
        editor.session.setMode(`ace/mode/${mode}`);
      }else if (id.startsWith('encode_')) {
        let encode = id.split('_')[1];
        editor.session.setValue(iconv.encode(codes, encode).toString());
      }else{
        console.info('toolbar.onClick', id);
      }
    });

    // 获取文件代码
    this.core.filemanager.read_file({
      path: path
    }, (ret) => {
      codes = ret;
      win.progressOff();

      // 初始化编辑器
      editor = ace.edit(win.cell.lastChild);
      editor.$blockScrolling = Infinity;
      editor.setTheme('ace/theme/tomorrow');
      editor.session.setMode(`ace/mode/${ext_dict[ext]}`);
      editor.session.setUseWrapMode(true);
      editor.session.setWrapLimitRange(null, null);

      editor.setOptions({
        fontSize: '14px',
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      // 编辑器快捷键
      editor.commands.addCommand({
        name: 'save',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S'
        },
        exec: () => {
          toolbar.callEvent('onClick', ['save']);
        }
      });

      editor.session.setValue(ret);

      // 定时刷新
      const inter = setInterval(editor::editor.resize, 200);
      win.attachEvent('onClose', () => {
        clearInterval(inter);
        return true;
      });
    }, (err) => {
      toastr.error(LANG['editor']['loadErr'](err), LANG_T['error']);
      win.close();
    });
  }

  // 创建窗口
  createWin(opts) {
    let _id = String(Math.random()).substr(5, 10);
    // 默认配置
    let opt = $.extend({
        title: 'Window:' + _id,
        width: 660,
        height: 550
    }, opts);

    // 创建窗口
    let _win = this.win.createWindow(_id, 0, 0, opt['width'], opt['height']);
    _win.setText(opt['title']);
    _win.centerOnScreen();
    _win.button('minmax').show();
    _win.button('minmax').enable();

    // 返回窗口对象
    return _win;
  }

}

export default FileManager;