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
      plugin: '插件中心',
      settings: '系统设置',
      language: '语言设置',
      update: '检查更新',
      quit: '退出程序'
    },
    shell: {
      title: '数据',
      add: '添加数据',
      search: '搜索数据',
      dump: '导出数据',
      import: '导入数据',
      clear: '清空数据'
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
      pluginCenter: '插件中心',
      clearCache: '清空缓存',
      clearAllCache: '清空所有缓存'
    },
    category: {
      title: '分类目录',
      default: '默认分类',
      toolbar: {
        add: '添加',
        del: '删除'
      },
      add: {
        title: '添加分类'
      },
      del: {
        title: '删除分类',
        confirm: '确定删除此分类吗？（数据将清空）',
        success: (category) => antSword.noxss(`成功删除分类（${category}）！`),
        error: (category, err) => antSword.noxss(`删除分类（${category}）失败！<br/>${err}`)
      }
    },
    list: {
      title: '数据管理',
      grid: {
        url: 'URL地址',
        ip: 'IP地址',
        addr: '物理位置',
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
          encode: '编码设置',
          type: '连接类型',
          encoder: '编码器'
        },
        warning: '请输入完整！',
        success: '添加数据成功！',
        error: (err) => antSword.noxss(`添加数据失败！<br/>${err}`)
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
          encode: '编码设置',
          type: '连接类型',
          encoder: '编码器'
        },
        warning: '请输入完整！',
        success: '更新数据成功！',
        error: (err) => antSword.noxss(`更新数据失败！<br/>${err}`)
      },
      del: {
        title: '删除数据',
        confirm: (len) => antSword.noxss(`确定删除选中的${len}条数据吗？`),
        success: (len) => antSword.noxss(`成功删除${len}条数据！`),
        error: (err) => antSword.noxss(`删除失败！<br/>${err}`)
      },
      move: {
        success: (num) => antSword.noxss(`成功移动${num}条数据！`),
        error: (err) => antSword.noxss(`移动数据失败！<br/>${err}`)
      },
      clearCache: {
        title: '清空缓存',
        confirm: '确定清空此缓存吗？',
        success: '清空缓存完毕！',
        error: (err) => antSword.noxss(`清空缓存失败！<br/>${err}`)
      },
      clearAllCache: {
        title: '清空缓存',
        confirm: '确定清空所有缓存数据吗？',
        success: '清空全部缓存完毕！',
        error: (err) => antSword.noxss(`清空全部缓存失败！<br/>${err}`)
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
      success: (path) => antSword.noxss(`删除文件成功！<br/>${path}`),
      error: (path, err) => antSword.noxss(`删除文件 [${path}] 失败！${err ? '<br/>' + err : ''}`)
    },
    paste: {
      success: (path) => antSword.noxss(`粘贴文件成功！<br/>${path}`),
      error: (path, err) => antSword.noxss(`粘贴文件 [${path}] 失败！${err ? '<br/>' + err : ''}`)
    },
    rename: {
      title: '重命名',
      success: '重命名文件成功！',
      error: (err) => antSword.noxss(`重命名文件失败！${err ? '<br/>' + err : ''}`)
    },
    createFolder: {
      title: '新建目录',
      value: '新目录',
      success: (path) => antSword.noxss(`新建目录成功！<br/>${path}`),
      error: (path, err) => antSword.noxss(`新建目录 [${path}] 失败！${err ? '<br/>' + err : ''}`)
    },
    createFile: {
      title: '新建文件',
      value: '新文件.txt',
      success: (path) => antSword.noxss(`新建文件成功！<br/>${path}`),
      error: (path, err) => antSword.noxss(`新建文件 [${path}] 失败！${err ? '<br/>' + err : ''}`)
    },
    retime: {
      title: '更改时间',
      success: (path) => antSword.noxss(`更改文件时间成功！<br/>${path}`),
      error: (path, err) => antSword.noxss(`更改文件时间 [${path}] 失败！${err ? '<br/>' + err : ''}`)
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
      success: (path) => antSword.noxss(`上传文件成功！<br/>${path}`),
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
          success: (path) => antSword.noxss(`添加书签成功！<br/>${path}`),
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
            warning: (id) => antSword.noxss(`已经添加到剪贴板！<br/>${id}`),
            info: (id) => antSword.noxss(`添加文件到剪贴板<br/>${id}`)
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
      loadErr: (err) => antSword.noxss(`加载文件出错！<br/>${err}`),
      success: (path) => antSword.noxss(`保存文件成功！<br/>${path}`),
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
      error: (name, err) => antSword.noxss(`下载文件[${name}]出错！<br/>${err}`),
      success: (name) => antSword.noxss(`下载文件[${name}]成功！`)
    }
  },
  database: {
    list: {
      title: '配置列表',
      add: '添加',
      del: '删除',
      menu: {
        add: '添加配置',
        del: '删除配置'
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
        database: (err) => antSword.noxss(`获取数据库列表失败！<br/>${err}`),
        table: (err) => antSword.noxss(`获取表数据失败！<br/>${err}`),
        column: (err) => antSword.noxss(`获取字段列表失败！<br/>${err}`),
        query: (err) => antSword.noxss(`执行SQL失败！<br/>${err}`),
        parse: '返回数据格式不正确！',
        noresult: '没有查询结果！'
      }
    },
    form: {
      title: '添加配置',
      toolbar: {
        add: '添加',
        clear: '清空'
      },
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
        error: (err) => antSword.noxss(`删除配置失败！<br/>${err}`)
      }
    }
  },
  settings: {
    about: {
      title: '关于程序'
    },
    language: {
      title: '语言设置',
      toolbar: {
        save: '保存'
      },
      form: {
        label: '选择显示语言',
        zh: '简体中文',
        en: 'English'
      },
      success: '保存语言设置成功！',
      confirm: {
        content: '重启应用生效，是否重启？',
        title: '更改语言'
      }
    },
    update: {
      title: '检查更新',
      toolbar: {
        check: '检查'
      }
    }
  },
  plugin: {
    error: (err) => antSword.noxss(`加载插件中心失败！<br/>${err}`)
  }
}