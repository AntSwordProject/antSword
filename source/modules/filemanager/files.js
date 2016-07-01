//
// 文件管理 模块
//

const LANG_T = antSword['language']['toastr'];
const LANG = antSword['language']['filemanager']['files'];

class Files {

  // 需要参数
  // 1.cell: 左侧layout.cell对象
  // 2.manager 主对象（index.jsx）
  constructor(cell, manager) {
    const self = this;
    cell.setText(`<i class="fa fa-file-o"></i> ${LANG['title']}`);
    // 创建toolbar
    const toolbar = cell.attachToolbar();
    // 加载本地缓存书签栏
    let bookmark = JSON.parse(manager.storage('bookmarks').get('{}'));
    // 重新加载书签
    this.reloadToolbar = () => {
      let bookmark_opts = [{
        id: 'bookmark_add',
        type: 'button',
        icon: 'plus-circle',
        text: LANG['bookmark']['add'],
        enabled: !bookmark[manager.path]
      }];
      if (!$.isEmptyObject(bookmark)) {
        bookmark_opts.push({ type: 'separator' });
      };
      for (let _ in bookmark) {
        bookmark_opts.push({
          id: 'bookmark_' + _,
          text: bookmark[_],
          icon: 'bookmark-o',
          type: 'button',
          enabled: manager.path !== _
        });
      }
      // 添加清除按钮
      if (bookmark_opts.length > 2) {
        bookmark_opts.push({
          type: 'separator'
        });
        bookmark_opts.push({
          id: 'bookmark_remove',
          icon: 'remove',
          text: LANG['bookmark']['del'],
          type: 'button',
          enabled: !!bookmark[manager.path]
        });
        bookmark_opts.push({
          id: 'bookmark_clear',
          icon: 'trash-o',
          text: LANG['bookmark']['clear'],
          type: 'button'
        });
      };

      toolbar.clearAll();
      toolbar.loadStruct([
        {
          id: 'new', type: 'buttonSelect', icon: 'plus-circle', text: LANG['toolbar']['new'], openAll: true,
          options: [
            { id: 'new_folder', icon: 'folder-o', type: 'button', text: LANG['toolbar']['folder'] },
            { id: 'new_file', icon: 'file-o', type: 'button', text: LANG['toolbar']['file'] },
            { type: 'separator' },
            { id: 'new_wget', icon: 'cloud-download', type: 'button', text: LANG['toolbar']['wget'] },
            { id: 'new_upload', icon: 'cloud-upload', type: 'button', text: LANG['toolbar']['upload'] }
         ]
        },
        { type: 'separator' },
        { id: 'up', type: 'button', icon: 'arrow-up', text: LANG['toolbar']['up'] },
        { type: 'separator' },
        { id: 'refresh', type: 'button', icon: 'refresh', text: LANG['toolbar']['refresh'] },
        { type: 'separator' },
        { id: 'home', type: 'button', icon: 'home', text: LANG['toolbar']['home'] },
        { type: 'separator' },
        {
          id: 'bookmark', type: 'buttonSelect', icon: 'bookmark', text: LANG['toolbar']['bookmark'], openAll: true,
          options: bookmark_opts
        },
        { type: 'separator' },
        { id: 'path', width: 300, type: 'buttonInput', value: manager.path || 'loading..' },
        { id: 'read_path', type: 'button', icon: 'arrow-right', text: LANG['toolbar']['read'] },
        { type: 'separator' }
      ]);
    }

    this.reloadToolbar();
    // reloadToolbar();
    // this.reloadToolbar = reloadToolbar;
    // toolbar点击事件
    toolbar.attachEvent('onClick', (id) => {
      switch(id) {
        case 'up':
          self.gotoPath('..');
          break;
        case 'refresh':
          self.refreshPath();
          break;
        case 'read_path':
          let pwd = toolbar.getInput('path').value;
          self.gotoPath(pwd);
          break;
        case 'home':
          self.gotoPath(manager.home);
          break;
        case 'new_folder':
          manager.createFolder();
          break;
        case 'new_file':
          manager.createFile();
          break;
        case 'new_wget':
          manager.wgetFile();
          break;
        case 'new_upload':
          manager.uploadFile();
          break;
        case 'bookmark_add':
          // 添加书签
          layer.prompt({
            value: self.manager.path,
            title: LANG['prompt']['add']['title']
          }, (value, i, e) => {
            bookmark[self.manager.path] = value;
            self.manager.storage('bookmarks').set(JSON.stringify(bookmark));
            toastr.success(LANG['prompt']['add']['success'](self.manager.path), LANG_T['success']);
            self.reloadToolbar();
            layer.close(i);
          });
          break;
        case 'bookmark_remove':
          layer.confirm(
            LANG['prompt']['remove']['confirm']
            , {
              icon: 2, shift: 6,
              title: `<i class="fa fa-remove"></i> ${LANG['prompt']['remove']['title']}`,
            }
            , (_) => {
              // 删除书签并刷新
              delete bookmark[self.manager.path];
              self.manager.storage('bookmarks').set(JSON.stringify(bookmark));
              self.reloadToolbar();
              toastr.success(LANG['prompt']['remove']['success'], LANG_T['success']);
              layer.close(_);
            }
          )
          break;
        case 'bookmark_clear':
          layer.confirm(
            LANG['prompt']['clear']['confirm']
            , {
              icon: 2, shift: 6,
              title: `<i class="fa fa-trash-o"></i> ${LANG['prompt']['clear']['title']}`
            }
            , (_) => {
              bookmark = {};
              self.manager.storage('bookmarks').set('{}');
              self.reloadToolbar();
              toastr.success(LANG['prompt']['clear']['success'], LANG_T['success']);
              layer.close(_);
            }
          )
          break;
        default:
          let arr = id.split('_');
          if (arr.length === 2 && arr[0] === 'bookmark') {
            self.gotoPath(arr[1]);
          };
      }
    });
    toolbar.attachEvent('onEnter', (id, value) => {
      switch(id) {
        case 'path':
          self.gotoPath(value);
          break;
      }
    });
    // 创建grid
    let grid = cell.attachGrid();

    grid.setHeader(`
      &nbsp;,
      ${LANG['grid']['header']['name']},
      ${LANG['grid']['header']['time']},
      ${LANG['grid']['header']['size']},
      ${LANG['grid']['header']['attr']}
    `);
    grid.setColTypes("ro,ro,ro,ro,ro");
    grid.setColSorting('str,str,str,str,str');
    grid.setInitWidths("40,*,150,100,100");
    grid.setColAlign("center,left,left,right,center");
    grid.enableMultiselect(true);
    // grid.enableDragAndDrop(true);
    // grid.enableMultiline(true);

    // grid右键
    // 空白数据右键fix
    $('.objbox').on('contextmenu', (e) => {
      (e.target.nodeName === 'DIV' && grid.callEvent instanceof Function && antSword['tabbar'].getActiveTab().startsWith('tab_filemanager_')) ? grid.callEvent('onRightClick', [-1, -1, e]) : null;
    });
    $('.objbox').on('click', (e) => {
      bmenu.hide();
    });
    grid.attachEvent('onRightClick', function(id, lid, event) {

      // 获取选中ID列表
      let _ids = (this.getSelectedId() || '').split(',');
      // 如果是空白右键
      if (id === -1) {
        _ids = [];
      }
      // 如果没有选中？则选中右键对应选项
      else if (_ids.length === 1) {
        this.selectRowById(id);
        _ids = [id];
      };
      let ids = [];
      _ids.map((_) => {
        ids.push(this.getRowAttribute(_, 'fname'));
      });
      id = ids[0] || '';

      // 获取剪贴板内容
      let _Clipboard = [];
      let _Clipboard_num = 0;
      for (let c in self.Clipboard) {
        _Clipboard.push({
          text: antSword.noxss(c),
          icon: 'fa fa-' + (c.endsWith('/') ? 'folder-o' : 'file-o'),
          action: ( (source, name) => {
            return () => {
              manager.pasteFile(source, name);
            }
          })(self.Clipboard[c], c)
        });
        _Clipboard_num ++;
        if (!(_Clipboard_num % 5)) {
          _Clipboard.push({ divider: true });
        };
      }
      // 清除最后的divider
      // if (_Clipboard.length % 5 && _Clipboard_num > 5) { _Clipboard.pop() };
      // all item
      if (_Clipboard.length > 0) {
        _Clipboard.unshift({ divider: true });
        _Clipboard.unshift({
          text: LANG['grid']['contextmenu']['paste']['all'],
          count: _Clipboard_num,
          icon: 'fa fa-th-list',
          action: () => {
            _Clipboard.map( (c) => {
              if (c['divider'] || c['count'] || c['text'] === LANG['grid']['contextmenu']['paste']['clear']['title']) { return };

              let name = c['text'];
              let source = self.Clipboard[name];

              manager.pasteFile(source, name);

            } );
          }
        });
        // 清空剪贴板
        !(_Clipboard[_Clipboard.length-1].divider) ? _Clipboard.push({ divider: true }) : 0;
        _Clipboard.push({
          text: LANG['grid']['contextmenu']['paste']['clear']['title'],
          icon: 'fa fa-trash-o',
          action: () => {
            self.Clipboard = {};
            toastr.info(LANG['grid']['contextmenu']['paste']['clear']['info'], LANG_T['info']);
          }
        });
      };

      let isFolder = id.endsWith('/');
      // 可编辑文件后缀
      let isEdited = false;
      'php,asp,aspx,jsp,cfm,js,css,html,py,sh,bat,txt,log,ini,conf,sql'.split(',').map(
        (e) => {
          id.toLowerCase().endsWith(`.${e}`) ? isEdited = true : 0;
        }
      );
      // 可预览文件后缀
      let isPreviewed = false;
      'jpg,png,gif,bmp,ico,mp4,mp3,wav,avi,rmvb'.split(',').map(
        (e) => {
          id.toLowerCase().endsWith(`.${e}`) ? isPreviewed = true : 0;
        }
      );

      let menu = [
        { text: LANG['grid']['contextmenu']['refresh'], icon: 'fa fa-refresh', action: () => { self.refreshPath(); } },
        { divider: true },
        { text: LANG['grid']['contextmenu']['wget'], icon: 'fa fa-cloud-download', action: manager.wgetFile.bind(manager) },
        { text: LANG['grid']['contextmenu']['upload'], icon: 'fa fa-upload', action: manager.uploadFile.bind(manager) },
        { text: LANG['grid']['contextmenu']['download'], icon: 'fa fa-download', disabled: isFolder || !id || ids.length > 1, action: () => {
          manager.downloadFile(id, this.getRowAttribute(_ids[0], 'fsize'));
        } },
        { divider: true },
        { text: LANG['grid']['contextmenu']['copy']['title'], icon: 'fa fa-copy', disabled: !id, action: () => {
          // 如果只有一个id，则显示id名称，否则显示ids数量
          ids.map( (id) => {
            let path = manager.path + id;
            // 判断是否已经复制
            if (id in self.Clipboard) {
              return toastr.warning(LANG['grid']['contextmenu']['copy']['warning'](id), LANG_T['warning']);
            };
            self.Clipboard[id] = path;
            toastr.info(LANG['grid']['contextmenu']['copy']['info'](id), LANG_T['info']);
          } );
        } },
        { text: LANG['grid']['contextmenu']['paste']['title'], icon: 'fa fa-paste', disabled: _Clipboard_num === 0, subMenu: _Clipboard },
        // { text: LANG['grid']['contextmenu']['preview'], icon: 'fa fa-eye', disabled: !id || ids.length > 1 || !isPreviewed, action: () => {
        //   manager.previewFile(id);
        // } },
        { divider: true },
        { text: LANG['grid']['contextmenu']['edit'], icon: 'fa fa-edit', disabled: /*!isEdited || */!id || ids.length > 1 || isFolder, action: () => {
          manager.editFile(id);
        } },
        { text: LANG['grid']['contextmenu']['delete'], icon: 'fa fa-trash-o', disabled: !id, action: () => {
          manager.deleteFile(ids);
        } },
        { text: LANG['grid']['contextmenu']['rename'], icon: 'fa fa-font', disabled: !id || ids.length > 1, action: () => {
          manager.renameFile(id);
        } },
        { text: LANG['grid']['contextmenu']['modify'], icon: 'fa fa-clock-o', disabled: !id || ids.length > 1, action: () => {
          // manager.retimeFile(id, this.rowsAr[id]['cells'][2].innerText);
          manager.retimeFile(id, this.getRowAttribute(_ids[0], 'data')[2]);
        } },
        { divider: true },
        { text: LANG['grid']['contextmenu']['create']['title'], icon: 'fa fa-plus-circle', subMenu: [
          { text: LANG['grid']['contextmenu']['create']['folder'], icon: 'fa fa-folder-o', action: manager.createFolder.bind(manager) },
          { text: LANG['grid']['contextmenu']['create']['file'], icon: 'fa fa-file-o', action: manager.createFile.bind(manager) }
        ] }
      ];

      bmenu(menu, event);

      return true;
    });

    // 选择事件
    grid.attachEvent('onRowSelect', (id, lid, event) => {
      bmenu.hide();
    });

    // 双击文件
    // :如果size < 100kb，则进行编辑，否则进行下载
    grid.attachEvent('onRowDblClicked', (id, lid, event) => {
      const fname = grid.getRowAttribute(id, 'fname');
      const fsize = grid.getRowAttribute(id, 'fsize');
      if (!fname.endsWith('/')) {
        // 双击编辑size < 100kb 文件
        fsize <= 100 * 1024 ? manager.editFile(fname) : manager.downloadFile(fname, fsize);
      }else{
        self.gotoPath(fname);
      }
    });

    grid.init();

    this.grid = grid;
    this.cell = cell;
    this.toolbar = toolbar;
    this.manager = manager;

    // 剪贴板
    this.Clipboard = {};

    // 文件拖拽上传
    $(this.cell.cell).on({
      dragleave: (e) => { e.preventDefault() },
      drop: (e) => {
        e.preventDefault();
        let filePaths = [];
        let files = e.originalEvent['dataTransfer']['files'] || {};
        for (let i = 0; i < files.length; i++) {
          let f = files.item(i);
          filePaths.push(f['path']);
        }
        this.manager.uploadFile(filePaths);
      },
      dragenter: (e) => { e.preventDefault() },
      dragover: (e) => { e.preventDefault() }
    });
  }

  // 刷新当前目录
  // 如果传递路径参数，则刷新该路径下的文件，不跳转，否则刷新&&跳转
  refreshPath(p) {
    let path = p || this.manager.path;
    // delete this.manager.cache[path];
    this.manager.cache.del('filemanager-files-' + new Buffer(path).toString('base64'));
    // 删除文件夹缓存
    for (let _ in this.manager.folder.cache) {
      if (_.indexOf(path) === 0 && _ != path) {
        delete this.manager.folder.cache[_];
      }
    }
    if (!p) { this.gotoPath('.') };
  }

  // 跳转目录
  gotoPath(path) {
    let self = this;
    this.cell.progressOn();
    try{
      this.manager.getFiles(path, (files) => {
        self.parse(files);
        self.manager.folder.parse(files);
        // self.cell.progressOff();
      });
    }catch(e) {
      toastr.error(e, LANG_T['error']);
      self.cell.progressOff();
    }
  }

  // 解析数据
  parse(files) {

    let data = [];
    let self = this;
    let _id = 1;
    files.map( (file) => {
      if (!file['name'] || ['./', '../'].indexOf(file['name']) != -1) {return};
      data.push({
        id: _id,
        fname: file['name'],
        fsize: parseInt(file['size']),
        // 如果是可执行文件（exe、dll..），则设置为红色字体
        style: /\.exe$|\.dll$|\.bat$|\.sh$|\.com$/.test(file['name']) ? 'color:red' : '',
        data: [
          self.fileIcon(file['name']),
          antSword.noxss(file['name'].replace(/\/$/, '')),
          antSword.noxss(file['time']),
          antSword.noxss(self.fileSize(parseInt(file['size']))),
          antSword.noxss(file['attr'])
        ]
      });
      _id ++;
    } );


    this.cell.setText(`<i class="fa fa-file-o"></i> ${LANG['title']} (${data.length})`);
    this.grid.clearAll();
    this.grid.parse({
        'rows': data
    }, 'json');

    // 设置path路径
    this.toolbar.getInput('path').value = this.manager.path;

    this.cell.progressOff();
    this.reloadToolbar();
  }

  // 文件大小计算
  fileSize(t) {
    let i = false;
    let b = ["b","Kb","Mb","Gb","Tb","Pb","Eb"];
    for (let q=0; q<b.length; q++) if (t > 1024) t = t / 1024; else if (i === false) i = q;
    if (i === false) i = b.length-1;
    return Math.round(t*100)/100+" "+b[i];
  }

  // 返回文件图标
  fileIcon(name) {
    let icons = {};
    const _icons = {
      'exe,dll': 'file',
      'jpg,png,gif,ico,bmp': 'file-image-o',
      'mp4,mpeg,avi,rm,rmvb': 'file-movie-o',
      'mp3,mid,wav': 'file-sound-o',
      'pdf': 'file-pdf-o',
      'ppt': 'file-powerpoint-o',
      'xls,xlsx': 'file-excel-o',
      'doc,docx': 'file-word-o',
      'zip,tar,7z,gz,rar': 'file-archive-o',
      'txt,ttf,tiff,ini,log,chm,conf,cfg': 'file-text-o',
      'php,asp,jsp,sql,cfm,aspx,html,js,py,rb,pl,go,css,less,jsx,sass,xml,sh,bat,h,cpp,c,m': 'file-code-o'
    }
    for (let _ in _icons) {
      let _arr = _.split(',');
      _arr.map( (a) => {
        icons[a] = _icons[_];
      });
    }
    // 默认图标
    let icon = 'file-o';
    // 判断是否为文件夹
    if (name.endsWith('/')) {
      icon = 'folder-o';
    }else{
      let _ = name.split('.');
      let ext = _[_.length - 1].toLowerCase();
      icon = icons[ext] || icon;
    };
    return `<i class="fa fa-${icon} fa-lg"></i>`;
  }

}

// export default Files;
module.exports = Files;
