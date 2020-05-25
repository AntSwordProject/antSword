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
      encoders: '编码设置',
      aproxy: '代理设置',
      display: '显示设置',
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
      selectall: '全选',
      search: '查找数据'
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
      copy: '创建副本',
      search: '搜索数据',
      plugin: '加载插件',
      pluginDefault: '默认分类',
      pluginStore: '插件市场',
      clearCache: '清空缓存',
      clearAllCache: '清空所有缓存',
      viewsite: '浏览网站',
      copyurl: '复制URL'
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
        success: (category) => `成功删除分类（${category}）！`,
        error: (category, err) => `删除分类（${category}）失败！\n${err}`
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
      not_recommended: '不推荐',
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
          test: '测试连接',
          add: '添加',
          clear: '清空'
        },
        form: {
          url: 'URL地址',
          pwd: '连接密码',
          note: '网站备注',
          encode: '编码设置',
          type: '连接类型',
          encoder: '编码器',
          decoder: '解码器'
        },
        test_success: '连接成功!',
        test_warning: '返回数据为空',
        warning: '请输入完整！',
        success: '添加数据成功！',
        error: (err) => `添加数据失败！\n${err}`
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
        error: (err) => `更新数据失败！\n${err}`
      },
      del: {
        title: '删除数据',
        confirm: (len) => antSword.noxss(`确定删除选中的${len}条数据吗？`),
        success: (len) => `成功删除${len}条数据！`,
        error: (err) => `删除失败！\n${err}`
      },
      move: {
        success: (num) => `成功移动${num}条数据！`,
        error: (err) => `移动数据失败！\n${err}`
      },
      clearCache: {
        title: '清空缓存',
        confirm: '确定清空此缓存吗？',
        success: '清空缓存完毕！',
        error: (err) => `清空缓存失败！\n${err}`
      },
      clearAllCache: {
        title: '清空缓存',
        confirm: '确定清空所有缓存数据吗？',
        success: '清空全部缓存完毕！',
        error: (err) => `清空全部缓存失败！\n${err}`
      },
      accordion: {
        base: '基础配置',
        http: '请求信息',
        other: '其他设置'
      },
      otherConf: {
        nohttps: '忽略HTTPS证书',
        usemultipart: '使用 Multipart 发包',
        userandomvariable: '使用随机英文单词变量',
        addMassData: '增加垃圾数据',
        randomPrefix: '随机前缀长度',
        chunk: {
          title: '分块传输(实验性功能)',
          usechunk: '开启分块传输发包',
          min: '最小分块',
          max: '最大分块',
          exphint: '该功能目前为实验性功能, 无法与 Multipart 同时使用,部分类型的服务端可能不支持Chunked传输。此外,建议超时时长设置30s以上,避免网速不好的情' +
            '况下影响数据传输。'
        },
        terminalCache: '虚拟终端使用缓存',
        filemanagerCache: '文件管理使用缓存',
        uploadFragment: '上传文件分片大小',
        requestTimeout: '请求超时',
        commandPath: '自定义终端执行路径',
        customDatatag: {
          title: '数据分割符',
          usecustomdatatag: '开启自定义数据分割符',
          tags: '开始标记',
          tage: '结束标记',
          exphint: '数据分割符请避免和页面中其它不相关的字符相同',
          valideq: '开始标记与结束标记不能相同'
        },
      }
    },
    toolbar: {
      select: '至少选择一个 webshell 吧',
      setting: {
        text: '设置',
        title: '设置你要添加到工具栏的插件'
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
    },
    ascmd: {
      help: '输入 ashelp 查看本地命令',
      ashelp: `使用帮助:
 asenv [Key=Value]\t\t设置或显示环境变量, eg: asenv AAA=BBB
 ascmd [file]\t\t指定file来执行命令, eg: ascmd /bin/bash
 aslistcmd\t\t列出可使用的命令解释器
 aspowershell [on|off]\t\t启用/关闭PowerShell模式, eg: aspowershell on
 aswinmode [on|off]\t\t强制启用/关闭为Windows模式(针对识别出错的情况), eg: aswinmode on
 quit\t\t关闭终端
 exit\t\t关闭终端

快捷键:
 Ctrl =\t\t放大字体
 Ctrl -\t\t缩小字体
 Ctrl L\t\t清屏
 Ctrl U\t\t清除当前行
 Ctrl A\t\t光标到行首
 Ctrl E\t\t光标到行尾
 Ctrl F/B\t\t前进后退(相当于左右方向键)
 Ctrl P\t\t上一条命令
 Ctrl R\t\t搜索命令历史
 Ctrl D\t\t删除当前光标的字符
 Ctrl H\t\t删除光标之前的字符
 Ctrl W\t\t删除光标之前的单词
 Ctrl K\t\t删除到文本末尾
 Ctrl T\t\t交换光标处文本
`,
      ascmd: (cmd) => antSword.noxss(`将使用 ${cmd} 执行命令.`),
      aspowershell: {
        on: "已启用Powershell模式",
        off: "已关闭Powershell模式"
      }
    }
  },
  filemanager: {
    title: '文件管理',
    delete: {
      title: '删除文件',
      confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
        ? num + ' 个文件'
        : num} 吗？`),
      success: (path) => `删除文件成功！\n${path}`,
      error: (path, err) => `删除文件 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    paste: {
      success: (path) => `粘贴文件成功！\n${path}`,
      error: (path, err) => `粘贴文件 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    rename: {
      title: '重命名',
      success: '重命名文件成功！',
      error: (err) => `重命名文件失败！${err
        ? '\n' + err
        : ''}`
    },
    createFolder: {
      title: '新建目录',
      value: '新目录',
      success: (path) => `新建目录成功！\n${path}`,
      error: (path, err) => `新建目录 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    createFile: {
      title: '新建文件',
      value: '新文件.txt',
      success: (path) => `新建文件成功！\n${path}`,
      error: (path, err) => `新建文件 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    retime: {
      title: '更改时间',
      success: (path) => `更改文件时间成功！\n${path}`,
      error: (path, err) => `更改文件时间 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    chmod: {
      title: '更改权限',
      check: "输入应为八进制数表示的权限, eg: 0644",
      success: (path) => `更改文件权限成功！\n${path}`,
      error: (path, err) => `更改文件权限 [${path}] 失败！${err
        ? '\n' + err
        : ''}`
    },
    wget: {
      title: 'Wget下载文件',
      check: 'URL地址不正确！',
      task: {
        name: 'WGET下载',
        start: '开始下载..',
        success: '下载成功！',
        failed: (ret) => `失败:${ret}`,
        error: (err) => `错误:${err}`
      }
    },
    upload: {
      task: {
        name: '上传',
        success: '上传成功',
        httperr_413: '请将上传文件分片大小设置调低',
        httperr_etime: '请求超时,请将超时时间调大',
        httperr_econnrefused: '连接被拒绝,检查目标或代理是否开启',
        failed: (err) => `失败:${err}`,
        error: (err) => `出错:${err}`
      },
      success: (path) => `上传文件成功！\n${path}`,
      error: (path, err) => `上传文件 [${path}] 失败！${err}`
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
          success: (path) => `添加书签成功！\n${path}`
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
          edit: {
            title: '编辑文件',
            openwindow: '窗口打开',
            opentab: '标签打开'
          },
          delete: '删除文件',
          rename: '重命名文件',
          refresh: '刷新目录',
          wget: 'WGET下载',
          upload: '上传文件',
          download: '下载文件',
          modify: '更改文件时间',
          chmod: '更改权限',
          copy: {
            title: '复制文件',
            copyname: '复制文件名',
            copypath: '复制文件路径',
            copysuccess: '复制到剪贴板成功!',
            copyfail: '复制到剪贴板失败!',
            warning: (id) => `已经添加到剪贴板！\n${id}`,
            info: (id) => `添加文件到剪贴板\n${id}`
          },
          create: {
            title: '新建',
            folder: '目录',
            file: '文件'
          },
          terminal: '在此处打开终端'
        }
      }
    },
    editor: {
      title: (path) => `编辑: ${path}`,
      toolbar: {
        refresh: '刷新',
        save: '保存',
        mode: '高亮',
        encode: '用此编码打开'
      },
      loadErr: (err) => `加载文件出错！\n${err}`,
      success: (path) => `保存文件成功！\n${path}`,
      error: (path, err) => `保存文件 [${path}] 失败！${err}`
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
        error: (err) => `出错:${err}`
      },
      error: (name, err) => `下载文件[${name}]出错！\n${err}`,
      success: (name) => `下载文件[${name}]成功！`
    }
  },
  database: {
    list: {
      title: '配置列表',
      add: '添加',
      del: '删除',
      edit: '编辑',
      check: '检测',
      menu: {
        add: '添加配置',
        del: '删除配置',
        edit: '编辑配置',
        adddb: '新建数据库',
        editdb: '编辑数据库',
        deldb: '删除数据库',
        addtable: '新建表',
        edittable: '编辑表名',
        deltable: '删除表',
        showcreatetable: '建表语句',
        desctable: '查看表结构',
        addcolumn: '添加列',
        editcolumn: '编辑列名',
        delcolumn: '删除列'
      }
    },
    query: {
      title: '执行SQL',
      exec: '执行',
      clear: '清空',
      bookmark: {
        title: '书签',
        add: '添加书签',
        del: '移除书签',
        clear: '清空书签'
      },
      prompt: {
        add: {
          title: '添加SQL书签',
          success: (sql) => `添加书签成功!\nSQL: ${sql}`
        },
        remove: {
          title: '移除书签',
          confirm: '确定移除此书签?',
          success: '移除书签成功'
        },
        clear: {
          title: '清空书签',
          confirm: '确定清空所有书签吗?',
          success: '清空书签成功'
        }
      }
    },
    result: {
      title: '执行结果',
      warning: '操作完毕，但没有结果返回！',
      error: {
        database: (err) => `获取数据库列表失败！\n${err}`,
        table: (err) => `获取表数据失败！\n${err}`,
        column: (err) => `获取字段列表失败！\n${err}`,
        query: (err) => `执行SQL失败！\n${err}`,
        parse: '返回数据格式不正确！',
        noresult: '没有查询结果！'
      },
      dump: {
        title: "导出查询结果",
        success: "导出成功"
      }
    },
    notsupport: '该功能暂不支持当前类型数据库',
    form: {
      title: '添加配置',
      toolbar: {
        add: '添加',
        clear: '清空',
        edit: '编辑',
        test: '测试连接'
      },
      conn: '连接字符串',
      type: '数据库类型',
      encode: '数据库编码',
      host: '数据库地址',
      user: '连接用户',
      passwd: '连接密码',
      warning: '请填写完整！',
      success: '成功添加配置！',
      test_success: '连接成功!',
      test_warning: '返回数据为空',
      del: {
        title: '删除配置',
        confirm: '确定删除此配置吗？',
        success: '删除配置成功！',
        error: (err) => `删除配置失败！\n${err}`
      },
      adddb: {
        title: '新建数据库',
        dbname: '名称',
        characterset: '字符集',
        charactercollation: '字符集排序',
        createbtn: '创建',
        cancelbtn: '取消',
        success: '创建数据库成功',
        error: '创建数据库失败'
      },
      editdb: {
        title: '修改数据库',
        dbname: '名称(只读)',
        characterset: '字符集',
        charactercollation: '字符集排序',
        updatebtn: '修改',
        cancelbtn: '取消',
        success: '修改数据库成功',
        error: '修改数据库失败'
      },
      deldb: {
        title: '删除数据库',
        confirm: (name) => antSword.noxss(`确定要删除数据库 ${name} 吗?`),
        success: '删除数据库成功',
        error: '删除数据库失败'
      },
      addtable: {
        title: '新建表',
        add: '新增字段',
        delete: '删除字段',
        save: '保存',
        gridheader: "名称,类型,长度,不为空,主键,自增长",
        delete_not_select: "请先选中要删除的行",
        save_row_is_null: "行数为空",
        cell_valid_error: (i, j) => `数据格式校验失败(${i + 1}行,${j + 1}列)`,
        confirmtitle: "输入新表名",
        invalid_tablename: "表名不能带有特殊符号",
        success: '新建表成功',
        error: '新建表失败'
      },
      edittable: {
        title: "输入新表名",
        invalid_tablename: "表名不能带有特殊符号",
        success: '修改表名成功',
        error: '修改表名失败'
      },
      deltable: {
        title: '删除表',
        confirm: (name) => antSword.noxss(`确定要删除表 ${name} 吗?`),
        success: '删除表成功',
        error: '删除表失败'
      },
      addcolumn: {},
      editcolumn: {
        title: "输入新列名",
        invalid_tablename: "列名不能带有特殊符号",
        get_column_type_error: "获取列属性失败",
        success: '修改列名成功',
        error: '修改列名失败'
      },
      delcolumn: {
        title: '删除列',
        confirm: (name) => antSword.noxss(`确定要删除列 ${name} 吗?`),
        success: '删除列成功',
        error: '删除列失败'
      }
    },
    probedb: {
      title: '检测数据库函数支持',
      success: '检测完毕',
      coltype: '连接类型',
      issupport: '状态'
    }
  },
  settings: {
    about: {
      title: '关于程序',
      header: '中国蚁剑',
      homepage: '主页',
      document: '文档',
      qqgroup: 'Q群',
      discord: '在线交流',
      securityreport: '报告漏洞',
      wechat: '关注微信公众号'
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
          ok: '立即更新',
          no: '下次再说',
          changelog: '更新日志'
        },
        body: (ver) => `发现新版本 v${ver}, 是否更新?`,
        loader_body: (ver) => `加载器新版本 v${ver} 已经发布,当前使用的加载器即将不能使用, 是否退出程序并前往下载最新版加载器?`,
        title: '版本更新',
        changelog: '更新日志：',
        sources: '更新来源：',
        fail: {
          md5: '文件MD5值校验失败！',
          unzip: (err) => `解压文件失败！【${err}】`
        }
      },
      message: {
        githint: (workdir) => `当前源码为Git管理，请关闭程序并前往 ${workdir} 手动更新`,
        prepare: "连接更新服务器...",
        dling: (progress) => `正在下载更新包...${progress}%`,
        dlingnp: (size) => `正在下载更新包...${size}`,
        dlend: "下载完毕",
        extract: "正在解压, 请勿关闭程序",
        ing: '努力更新中。。',
        fail: (err) => `更新失败！【${err}】`,
        success: '更新成功！请稍后手动重启应用！'
      }
    },
    encoders: {
      title: '编码管理',
      encoder: "编码器",
      decoder: "解码器",
      toolbar: {
        new: "新建编码器",
        new_decoder: "新建解码器",
        edit: "编辑",
        delete: "删除",
        help: "帮助",
        save: "保存",
        rsa: "RSA配置",
        more: "获取更多",
        generate: "生成"
      },
      grid: {
        ename: "名称",
        etype: "Shell类型",
        edtype: {
          title: "类型",
          encoder: "编码器",
          decoder: "解码器"
        }
      },
      form: {
        public_key: "公钥",
        private_key: "私钥",
        php_code: "PHP 代码"
      },
      rsa_config_win_title: "RSA编码器配置",
      edit_win_title: "编辑",
      delete_title: "删除",
      message: {
        ename_duplicate: "名称不能重复",
        rename_success: "重命名成功",
        etype_error: "类型错误",
        retype_success: "类型修改成功",
        create_success: "新增成功",
        edit_not_select: "请先选中要编辑的行",
        edit_only_single: "只能编辑一个",
        edit_null_value: "内容不能为空",
        edit_save_success: "保存成功",
        delete_not_select: "请先选中要删除的行",
        delete_success: "删除成功",
        ename_invalid: "名称只能包含数字、字母、下划线",
        rsa_save_success: "生成 RSA 密钥对成功",
        rsa_save_error: "生成 RSA 密钥对错误"
      },
      prompt: {
        create_encoder: "创建编码器",
        create_decoder: "创建解码器"
      },
      confirm: {
        generate: '你确定要重新生成?',
        delete: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
          ? num + ' 个编码器'
          : num + " "}吗？`)
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
        mode: {
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
      prompt: {
        title: '输入测试的 URL',
        success: '连接到代理服务器成功',
        error: '连接到代理服务器失败'
      }
    },
    display: {
      title: '显示设置',
      success: '保存显示设置成功！',
      error: '保存显示设置失败！',
      confirm: {
        content: '重启应用生效，是否重启？',
        title: '更改显示设置'
      },
      toolbar: {
        save: '保存'
      },
      form: {
        shellmanager: {
          title: '数据管理',
          hiddencolumns: {
            title: '隐藏选中列',
            url: 'URL地址',
            ip: 'IP地址',
            addr: '物理位置',
            note: '网站备注',
            ctime: '创建时间',
            utime: '更新时间'
          }
        }
      }
    },
    adefault: {
      title: '默认设置',
      success: '保存成功',
      error: '保存失败！',
      confirm: {
        content: '重启应用生效，是否重启？',
        title: '更改默认设置'
      },
      toolbar: {
        save: '保存'
      },
      filemanager: {
        title: '文件管理',
        openfileintab: {
          title: '文件打开方式',
          window: '窗口打开',
          tab: '标签打开'
        },
        bookmark: {
          title: '全局书签',
          nodata: '当前暂无数据, 请单击鼠标右键添加',
          grid: {
            name: '名称',
            path: '目录'
          },
          bmenu: {
            add: '添加书签',
            del: '删除书签'
          },
          add: {
            title: '添加全局书签',
            success: '添加成功',
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            addbtn: '确定'
          },
          del: {
            title: '删除书签',
            confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
              ? num + ' 个书签'
              : num + " "}吗？`),
            success: '删除成功'
          },
          edit: {
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            success: '更新成功'
          }
        }
      },
      database: {
        title: '数据操作',
        bookmark: {
          title: '全局书签',
          nodata: '当前暂无数据, 请单击鼠标右键添加',
          grid: {
            name: '名称',
            path: 'SQL'
          },
          bmenu: {
            add: '添加书签',
            del: '删除书签'
          },
          add: {
            title: '添加全局SQL书签',
            success: '添加成功',
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            addbtn: '确定'
          },
          del: {
            title: '删除书签',
            confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
              ? num + ' 个书签'
              : num + " "}吗？`),
            success: '删除成功'
          },
          edit: {
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            success: '更新成功'
          }
        }
      },
      shellmanager: {
        title: '数据管理',
        header: {
          title: '默认请求头',
          nodata: '暂无全局请求头, 请单击右键添加',
          grid: {
            name: '名称',
            value: '值'
          },
          bmenu: {
            add: '添加请求头',
            del: '删除请求头'
          },
          add: {
            title: '添加默认请求头',
            success: '添加成功',
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            addbtn: '确定'
          },
          del: {
            title: '删除默认请求头',
            confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
              ? num + ' 个请求头'
              : num + " "}吗？`),
            success: '删除成功'
          },
          edit: {
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            success: '更新成功'
          }
        },
        body: {
          title: '默认请求 Body',
          nodata: '暂无默认Body, 请单击右键添加',
          grid: {
            name: '名称',
            value: '值'
          },
          bmenu: {
            add: '添加Body',
            del: '删除Body'
          },
          add: {
            title: '添加默认请求Body',
            success: '添加成功',
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            addbtn: '确定'
          },
          del: {
            title: '删除默认请求头Body',
            confirm: (num) => antSword.noxss(`你确定要删除 ${typeof(num) === 'number'
              ? num + ' 个请求Body'
              : num + " "}吗？`),
            success: '删除成功'
          },
          edit: {
            namedup: '名称不能重复',
            name_invalid: '名称不合法',
            success: '更新成功'
          }
        },
        other: {
          nohttps: '忽略HTTPS证书',
          userandomvariable: '使用随机英文单词变量',
          requestTimeout: '请求超时'
        }
      },
      terminal: {
        title: '虚拟终端',
        size: '缩放'
      }
    }
  },
  plugin: {
    error: (err) => `加载插件中心失败！\n${err}`
  },
  update: {
    title: '发现更新',
    body: (ver) => `新的版本：${ver}, 查看更新日志`
  },
  viewsite: {
    toolbar: {
      useproxy: (s) => `代理: ${s
        ? '开'
        : '关'}`,
      save: '保存',
      view: '浏览'
    },
    saveSuccess: '保存Cookie成功！',
    saveFailed: (err) => `保存Cookie失败！\n${err}`
  }
}