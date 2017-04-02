//
// language::zh
//
module.exports = {
  title: '中国蚁剑',
  toastr: {
    info: '提示',
    error: '错误',
    warning: '警告',
    success: '成功'
  },
  menubar: {
    main: {
      title: 'AntSword',
      about: '关于程序',
      pluginStore: '插件市场',
      settings: '系统设置',
      language: '语言设置',
      aproxy: '代理设置',
      update: '检查更新',
      quit: '退出程序'
    },
    edit: {
      title: '编辑',
      undo: '撤销',
      redo: '重做',
      cut: '剪切',
      copy: '复制',
      paste: '粘贴',
      selectall: '全选'
    },
    window: {
      title: '窗口',
      next: '下个窗口',
      prev: '上个窗口',
      close: '关闭窗口'
    },
    debug: {
      title: '调试',
      restart: '重启应用',
      devtools: '开发者工具'
    },
    tray: {
      tip: '中国蚁剑',
      show: '显示',
      hide: '隐藏',
      settings: '系统设置',
      about: '关于蚁剑',
      quit: '退出'
    }
  },
  shellmanager: {
    title: '列表管理',
    contextmenu: {
      terminal: '虚拟终端',
      filemanager: '文件管理',
      database: '数据操作',
      add: '添加数据',
      edit: '编辑数据',
      delete: '删除数据',
      move: '移动数据',
      search: '搜索数据',
      plugin: '加载插件',
      pluginDefault: '默认分类',
      pluginStore: '插件市场',
      clearCache: '清空缓存',
      clearAllCache: '清空所有缓存',
      viewsite: '浏览网站'
    },
    category: {
      title: '分类目录',
      default: '默认分类',
      toolbar: {
        add: '添加',
        del: '删除',
        rename: '重命名'
      },
      add: {
        title: '添加分类'
      },
      del: {
        title: '删除分类',
        confirm: '确定删除此分类吗？（数据将清空）',
        success: (category) => antSword.noxss(`成功删除分类（${category}）！`),
        error: (category, err) => antSword.noxss(`删除分类（${category}）失败！\n${err}`)
      },
      rename: {
        title: '重命名分类',
        disable: '禁止的分类名称！',
        exists: '此分类名已经存在！',
        success: '重命名分类成功！',
        error: '重命名分类失败！'
      }
    },
    list: {
      title: '数据管理',
      grid: {
        url: 'URL地址',
        ip: 'IP地址',
        addr: '物理位置',
        note: '网站备注',
        ctime: '创建时间',
        utime: '更新时间'
      },
      add: {
        title: '添加数据',
        toolbar: {
          add: '添加',
          clear: '清空'
        },
        form: {
          url: 'URL地址',
          pwd: '连接密码',
          note: '网站备注',
          encode: '编码设置',
          type: '连接类型',
          encoder: '编码器'
        },
        warning: '请输入完整！',
        success: '添加数据成功！',
        error: (err) => antSword.noxss(`添加数据失败！\n${err}`)
      },
      edit: {
        title: (url) => antSword.noxss(`编辑数据（${url}）`),
        toolbar: {
          save: '保存',
          clear: '清空'
        },
        form: {
          url: 'URL地址',
          pwd: '连接密码',
          note: '网站备注',
          encode: '编码设置',
          type: '连接类型',
          encoder: '编码器'
        },
        warning: '请输入完整！',
        success: '更新数据成功！',
        error: (err) => antSword.noxss(`更新数据失败！\n${err}`)
      },
      del: {
        title: '删除数据',
        confirm: (len) => antSword.noxss(`确定删除选中的${len}条数据吗？`),
        success: (len) => antSword.noxss(`成功删除${len}条数据！`),
        error: (err) => antSword.noxss(`删除失败！\n${err}`)
      },
      move: {
        success: (num) => antSword.noxss(`成功移动${num}条数据！`),
        error: (err) => antSword.noxss(`移动数据失败！\n${err}`)
      },
      clearCache: {
        title: '清空缓存',
        confirm: '确定清空此缓存吗？',
        success: '清空缓存完毕！',
        error: (err) => antSword.noxss(`清空缓存失败！\n${err}`)
      },
      clearAllCache: {
        title: '清空缓存',
        confirm: '确定清空所有缓存数据吗？',
        success: '清空全部缓存完毕！',
        error: (err) => antSword.noxss(`清空全部缓存失败！\n${err}`)
      },
      accordion: {
        base: '基础配置',
        http: '请求信息',
        other: '其他设置'
      },
      otherConf: {
        nohttps: '忽略HTTPS证书',
        terminalCache: '虚拟终端使用缓存',
        requestTimeout: '请求超时',
        commandPath: '自定义终端执行路径'
      }
    }
  },
  terminal: {
    title: '虚拟终端',
    banner: {
      title: '基础信息',
      drive: '磁盘列表',
      system: '系统信息',
      user: '当前用户',
      path: '当前路径'
    }
  },
  filemanager: {
    title: '文件管理',
    delete: {
      title: '删除文件',
      confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number' ? num + ' 个文件' : num} 吗？`),
      success: (path) => antSword.noxss(`删除文件成功！\n${path}`),
      error: (path, err) => antSword.noxss(`删除文件 [${path}] 失败！${err ? '\n' + err : ''}`)
    },
    paste: {
      success: (path) => antSword.noxss(`粘贴文件成功！\n${path}`),
      error: (path, err) => antSword.noxss(`粘贴文件 [${path}] 失败！${err ? '\n' + err : ''}`)
    },
    rename: {
      title: '重命名',
      success: '重命名文件成功！',
      error: (err) => antSword.noxss(`重命名文件失败！${err ? '\n' + err : ''}`)
    },
    createFolder: {
      title: '新建目录',
      value: '新目录',
      success: (path) => antSword.noxss(`新建目录成功！\n${path}`),
      error: (path, err) => antSword.noxss(`新建目录 [${path}] 失败！${err ? '\n' + err : ''}`)
    },
    createFile: {
      title: '新建文件',
      value: '新文件.txt',
      success: (path) => antSword.noxss(`新建文件成功！\n${path}`),
      error: (path, err) => antSword.noxss(`新建文件 [${path}] 失败！${err ? '\n' + err : ''}`)
    },
    retime: {
      title: '更改时间',
      success: (path) => antSword.noxss(`更改文件时间成功！\n${path}`),
      error: (path, err) => antSword.noxss(`更改文件时间 [${path}] 失败！${err ? '\n' + err : ''}`)
    },
    wget: {
      title: 'Wget下载文件',
      check: 'URL地址不正确！',
      task: {
        name: 'WGET下载',
        start: '开始下载..',
        success: '下载成功！',
        failed: (ret) => antSword.noxss(`失败:${ret}`),
        error: (err) => antSword.noxss(`错误:${err}`)
      }
    },
    upload: {
      task: {
        name: '上传',
        failed: (err) => antSword.noxss(`失败:${err}`),
        error: (err) => antSword.noxss(`出错:${err}`)
      },
      success: (path) => antSword.noxss(`上传文件成功！\n${path}`),
      error: (path, err) => antSword.noxss(`上传文件 [${path}] 失败！${err}`),
    },
    folder: {
      title: '目录列表'
    },
    files: {
      title: '文件列表',
      bookmark: {
        add: '添加书签',
        del: '移除书签',
        clear: '清空书签'
      },
      toolbar: {
        new: '新建',
        folder: '目录',
        file: '文件',
        wget: 'Wget下载',
        upload: '上传文件',
        up: '上层',
        refresh: '刷新',
        home: '主目录',
        bookmark: '书签',
        read: '读取'
      },
      prompt: {
        add: {
          title: '添加到书签',
          success: (path) => antSword.noxss(`添加书签成功！\n${path}`),
        },
        remove: {
          title: '移除书签',
          confirm: '确定移除此书签吗？',
          success: '移除书签成功！'
        },
        clear: {
          title: '清空书签',
          confirm: '确定清空所有书签吗？',
          success: '清空所有书签成功！'
        }
      },
      grid: {
        header: {
          name: '名称',
          time: '日期',
          size: '大小',
          attr: '属性'
        },
        contextmenu: {
          paste: {
            title: '粘贴文件',
            all: '所有列表',
            clear: {
              title: '清空列表',
              info: '清空剪贴板'
            }
          },
          preview: '预览文件',
          edit: '编辑文件',
          delete: '删除文件',
          rename: '重命名文件',
          refresh: '刷新目录',
          wget: 'WGET下载',
          upload: '上传文件',
          download: '下载文件',
          modify: '更改文件时间',
          copy: {
            title: '复制文件',
            warning: (id) => antSword.noxss(`已经添加到剪贴板！\n${id}`),
            info: (id) => antSword.noxss(`添加文件到剪贴板\n${id}`)
          },
          create: {
            title: '新建',
            folder: '目录',
            file: '文件'
          }
        }
      }
    },
    editor: {
      title: (path) => antSword.noxss(`编辑: ${path}`),
      toolbar: {
        save: '保存',
        mode: '高亮',
        encode: '编码'
      },
      loadErr: (err) => antSword.noxss(`加载文件出错！\n${err}`),
      success: (path) => antSword.noxss(`保存文件成功！\n${path}`),
      error: (path, err) => antSword.noxss(`保存文件 [${path}] 失败！${err}`)
    },
    tasks: {
      title: '任务列表',
      grid: {
        header: {
          name: '名称',
          desc: '简介',
          status: '状态',
          stime: '创建时间',
          etime: '完成时间'
        }
      }
    },
    download: {
      title: '下载文件',
      task: {
        name: '下载',
        wait: '准备下载',
        cancel: '取消下载',
        start: '开始下载',
        success: '下载成功',
        error: (err) => antSword.noxss(`出错:${err}`)
      },
      error: (name, err) => antSword.noxss(`下载文件[${name}]出错！\n${err}`),
      success: (name) => antSword.noxss(`下载文件[${name}]成功！`)
    }
  },
  database: {
    list: {
      title: '配置列表',
      add: '添加',
      del: '删除',
      edit: '编辑',
      menu: {
        add: '添加配置',
        del: '删除配置',
        edit: '编辑配置'
      }
    },
    query: {
      title: '执行SQL',
      exec: '执行',
      clear: '清空'
    },
    result: {
      title: '执行结果',
      warning: '操作完毕，但没有结果返回！',
      error: {
        database: (err) => antSword.noxss(`获取数据库列表失败！\n${err}`),
        table: (err) => antSword.noxss(`获取表数据失败！\n${err}`),
        column: (err) => antSword.noxss(`获取字段列表失败！\n${err}`),
        query: (err) => antSword.noxss(`执行SQL失败！\n${err}`),
        parse: '返回数据格式不正确！',
        noresult: '没有查询结果！'
      }
    },
    form: {
      title: '添加配置',
      toolbar: {
        add: '添加',
        clear: '清空',
        edit: '编辑'
      },
      conn: '连接字符串',
      type: '数据库类型',
      encode: '数据库编码',
      host: '数据库地址',
      user: '连接用户',
      passwd: '连接密码',
      warning: '请填写完整！',
      success: '成功添加配置！',
      del: {
        title: '删除配置',
        confirm: '确定删除此配置吗？',
        success: '删除配置成功！',
        error: (err) => antSword.noxss(`删除配置失败！\n${err}`)
      }
    }
  },
  settings: {
    about: {
      title: '关于程序',
      header: '中国蚁剑',
      homepage: '主页',
      document: '文档',
      qqgroup: 'Q群'
    },
    language: {
      title: '语言设置',
      toolbar: {
        save: '保存'
      },
      form: {
        label: '选择显示语言'
      },
      success: '保存语言设置成功！',
      confirm: {
        content: '重启应用生效，是否重启？',
        title: '更改语言'
      }
    },
    update: {
      title: '检查更新',
      current: '当前版本',
      toolbar: {
        check: '检查'
      },
      check: {
        ing: '检查更新中。。',
        fail: (err) => `检查更新失败！\n${err}`,
        none: (ver) => `检查完毕，暂无更新！【v${ver}】`,
        found: (ver) => `发现新版本【v${ver}】`
      },
      prompt: {
        btns: {
          ok: '更新',
          no: '取消'
        },
        title: '版本更新',
        changelog: '更新日志：',
        sources: '更新来源：',
        fail: {
          md5: '文件MD5值校验失败！',
          unzip: (err) => `解压文件失败！【${err}】`
        }
      },
      message: {
        ing: '努力更新中。。',
        fail: (err) => `更新失败！【${err}】`,
        success: '更新成功！请稍后手动重启应用！'
      }
    },
    aproxy: {
      title: '代理设置',
      toolbar: {
        save: '保存',
        test: '测试连接'
      },
      form: {
        label: '配置访问互联网的代理',
        mode:{
          noproxy: '不使用代理',
          manualproxy: '手动设置代理'
        },
        proxy: {
          protocol: '代理协议',
          server: '代理服务器',
          port: '端口',
          username: '用户名',
          password: '密码',
          authtip: '如果无认证方式请留空'
        }
      },
      success: '保存代理设置成功！',
      error: '保存代理设置失败！',
      confirm: {
        content: '重启应用生效，是否重启？',
        title: '更改代理设置'
      },
      prompt:{
        title: '输入测试的 URL',
        success: '连接到代理服务器成功',
        error: '连接到代理服务器失败'
      }
    }
  },
  plugin: {
    error: (err) => antSword.noxss(`加载插件中心失败！\n${err}`)
  },
  update: {
    title: '发现更新',
    body: (ver) => `新的版本：${ver}`
  },
  viewsite: {
    toolbar: {
      save: '保存',
      view: '浏览'
    },
    saveSuccess: '保存Cookie成功！',
    saveFailed: (err) => `保存Cookie失败！\n${err}`
  }
}
