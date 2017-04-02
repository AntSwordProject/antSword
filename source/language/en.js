//
// language::en
//
module.exports = {
  toastr: {
    info: 'Info',
    error: 'Error',
    warning: 'Warning',
    success: 'Success'
  },
  menubar: {
    main: {
      title: 'AntSword',
      about: 'About',
      pluginStore: 'Plugin Store',
      settings: 'System setting',
      language: 'Language setting',
      aproxy: 'Proxy setting',
      update: 'Check update',
      quit: 'Quit'
    },
    edit: {
      title: 'Edit',
      undo: 'Undo',
      redo: 'Redo',
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      selectall: 'SelectAll'
    },
    window: {
      title: 'Window',
      next: 'Next window',
      prev: 'Prev window',
      close: 'Close window'
    },
    debug: {
      title: 'Debug',
      restart: 'Restart APP',
      devtools: 'Developer Tools'
    },
    tray: {
      tip: 'AntSword',
      show: 'Show',
      hide: 'Hide',
      settings: 'System setting',
      about: 'About',
      quit: 'Quit'
    }
  },
  shellmanager: {
    title: 'ShellManager',
    contextmenu: {
      terminal: 'Terminal',
      filemanager: 'FileManager',
      database: 'Database',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      move: 'Move',
      search: 'Search',
      plugin: 'Plugins',
      pluginDefault: 'Default',
      pluginStore: 'Plugin Store',
      clearCache: 'Clear cache',
      clearAllCache: 'Clear all cache',
      viewsite: 'View Site'
    },
    category: {
      title: 'Category',
      default: 'Default',
      toolbar: {
        add: 'Add',
        del: 'Del',
        rename: 'Rename'
      },
      add: {
        title: 'Add category'
      },
      del: {
        title: 'Delete category',
        confirm: 'Are you sure to delete this category?',
        success: (category) => antSword.noxss(`Delete category(${category}) success!`),
        error: (category, err) => antSword.noxss(`Delete category(${category}failed!\n${err}`)
      },
      rename: {
        title: 'Rename category',
        disable: 'Prohibited category name!',
        exists: 'This category name already exists!',
        success: 'Successful rename!',
        error: 'Rename category failed!'
      }
    },
    list: {
      title: 'Shell Lists',
      grid: {
        url: 'URL',
        ip: 'IP',
        addr: 'ADDR',
        note: 'NOTE',
        ctime: 'CTIME',
        utime: 'UTIME'
      },
      add: {
        title: 'Add shell',
        toolbar: {
          add: 'Add',
          clear: 'Clear'
        },
        form: {
          url: 'Shell url',
          pwd: 'Shell pwd',
          note: 'Note',
          encode: 'Encode',
          type: 'Shell type',
          encoder: 'Encoder'
        },
        warning: 'Please enter the full!',
        success: 'Add shell success!',
        error: (err) => antSword.noxss(`Add shell failed!\n${err}`)
      },
      edit: {
        title: (url) => antSword.noxss(`Edit shell(${url})`),
        toolbar: {
          save: 'Save',
          clear: 'Clear'
        },
        form: {
          url: 'Shell url',
          pwd: 'Shell pwd',
          note: 'Note',
          encode: 'Encode',
          type: 'Shell type',
          encoder: 'Encoder'
        },
        warning: 'Please enter the full!',
        success: 'Update shell success!',
        error: (err) => antSword.noxss(`Update shell failed!\n${err}`)
      },
      del: {
        title: 'Delete shell',
        confirm: (len) => antSword.noxss(`Are you sure to delete ${len} shells?`),
        success: (len) => antSword.noxss(`Delete ${len} shells success!`),
        error: (err) => antSword.noxss(`Delete failed!\n${err}`)
      },
      move: {
        success: (num) => antSword.noxss(`Move ${num}datas success!`),
        error: (err) => antSword.noxss(`Move data failed!\n${err}`)
      },
      clearCache: {
        title: 'Clear cache',
        confirm: 'Are you sure to clear this cache?',
        success: 'Clear cache success!',
        error: (err) => antSword.noxss(`Clear cache failed!\n${err}`)
      },
      clearAllCache: {
        title: 'Clear all cache',
        confirm: 'Are you sure to clear all the cache?',
        success: 'Clear all cache success!',
        error: (err) => antSword.noxss(`Clear all cache failed!\n${err}`)
      },
      accordion: {
        base: 'Base',
        http: 'HTTP',
        other: 'Other'
      },
      otherConf: {
        nohttps: 'Ignore HTTPS certificate',
        terminalCache: "Use the terminal's cache",
        requestTimeout: 'Request timeout',
        commandPath: 'Custom terminal-execPath'
      }
    }
  },
  terminal: {
    title: 'Terminal',
    banner: {
      title: 'Infomations',
      drive: 'Drive   List',
      system: 'System  Info',
      user: 'Current User',
      path: 'Current Path'
    }
  },
  filemanager: {
    title: 'FileManager',
    delete: {
      title: 'Delete',
      confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number' ? num + ' files' : num} ?`),
      success: (path) => antSword.noxss(`Delete file [${path}] success!`),
      error: (path, err) => antSword.noxss(`Delete file [${path}] failed!${err ? '\n' + err : ''}`)
    },
    paste: {
      success: (path) => antSword.noxss(`Paste file success!\n${path}`),
      error: (path, err) => antSword.noxss(`Paste file [${path}] failed!${err ? '\n' + err : ''}`)
    },
    rename: {
      title: 'Rename',
      success: 'Rename success!',
      error: (err) => antSword.noxss(`Rename failed!${err ? '\n' + err : ''}`)
    },
    createFolder: {
      title: 'Create Folder',
      value: 'New Folder',
      success: (path) => antSword.noxss(`Create folder success!\n${path}`),
      error: (path, err) => antSword.noxss(`Create folder [${path}] failed!${err ? '\n' + err : ''}`)
    },
    createFile: {
      title: 'Create File',
      value: 'New File.txt',
      success: (path) => antSword.noxss(`Create file success!\n${path}`),
      error: (path, err) => antSword.noxss(`Create file [${path}] failed!${err ? '\n' + err : ''}`)
    },
    retime: {
      title: 'Retime File',
      success: (path) => antSword.noxss(`Retime file success!\n${path}`),
      error: (path, err) => antSword.noxss(`Retime file [${path}] failed!${err ? '\n' + err : ''}`)
    },
    wget: {
      title: 'Wget File',
      check: 'URL is not correct!',
      task: {
        name: 'WGET',
        start: 'Start to wget file..',
        success: 'Wget success!',
        failed: (ret) => antSword.noxss(`Failed:${ret}`),
        error: (err) => antSword.noxss(`Error:${err}`)
      }
    },
    upload: {
      task: {
        name: 'Upload',
        failed: (err) => antSword.noxss(`Failed:${err}`),
        error: (err) => antSword.noxss(`Error:${err}`)
      },
      success: (path) => antSword.noxss(`Upload file success!\n${path}`),
      error: (path, err) => antSword.noxss(`Upload file [${path}] failed!${err}`),
    },
    folder: {
      title: 'Folders'
    },
    files: {
      title: 'Files',
      bookmark: {
        add: 'Add bookmark',
        del: 'Remove this bookmark',
        clear: 'Clear all bookmarks'
      },
      toolbar: {
        new: 'New',
        folder: 'Folder',
        file: 'File',
        wget: 'Wget File',
        upload: 'Upload File',
        up: 'UP',
        refresh: 'Refresh',
        home: 'Home',
        bookmark: 'Bookmark',
        read: 'Read'
      },
      prompt: {
        add: {
          title: 'Add to bookmark',
          success: (path) => antSword.noxss(`Add to bookmark success!\n${path}`),
        },
        remove: {
          title: 'Remove bookmark',
          confirm: 'Remove this bookmark ?',
          success: 'Remove bookmark success!'
        },
        clear: {
          title: 'Clear all bookmarks',
          confirm: 'Clear all bookmarks ?',
          success: 'Clear all bookmark success!'
        }
      },
      grid: {
        header: {
          name: 'Name',
          time: 'Time',
          size: 'Size',
          attr: 'Attr'
        },
        contextmenu: {
          paste: {
            title: 'Paste',
            all: 'All items',
            clear: {
              title: 'Clear items',
              info: 'Clear all Clipboard.'
            }
          },
          preview: 'Preview',
          edit: 'Edit',
          delete: 'Delete',
          rename: 'Rename',
          refresh: 'Refresh',
          wget: 'WGET',
          upload: 'Upload',
          download: 'Download',
          modify: 'Modify the file time',
          copy: {
            title: 'Copy',
            warning: (id) => antSword.noxss(`Already add to clipboard!\n${id}`),
            info: (id) => antSword.noxss(`Add file to the clipboard.\n${id}`)
          },
          create: {
            title: 'Create',
            folder: 'Folder',
            file: 'File'
          }
        }
      }
    },
    editor: {
      title: (path) => antSword.noxss(`Edit: ${path}`),
      toolbar: {
        save: 'Save',
        mode: 'Mode',
        encode: 'Encode'
      },
      loadErr: (err) => antSword.noxss(`Load file error!\n${err}`),
      success: (path) => antSword.noxss(`Save the file success!\n${path}`),
      error: (path, err) => antSword.noxss(`Save the file [${path}] failed!${err}`)
    },
    tasks: {
      title: 'Tasks',
      grid: {
        header: {
          name: 'Name',
          desc: 'Description',
          status: 'Status',
          stime: 'StartTime',
          etime: 'EndTime'
        }
      }
    },
    download: {
      title: 'Download File',
      task: {
        name: 'Download',
        wait: 'Wait to download',
        cancel: 'Cancel download',
        start: 'Start to download',
        success: 'Download success!',
        error: (err) => antSword.noxss(`Error:${err}`)
      },
      error: (name, err) => antSword.noxss(`Download file [${name}]error!\n${err}`),
      success: (name) => antSword.noxss(`Download file [${name}] success!`)
    }
  },
  database: {
    list: {
      title: 'Config list',
      add: 'Add',
      del: 'Del',
      edit: 'Edit',
      menu: {
        add: 'Add conf',
        del: 'Del conf',
        edit: 'Edit conf'
      }
    },
    query: {
      title: 'Exec SQL',
      exec: 'Run',
      clear: 'Clear'
    },
    result: {
      title: 'Result',
      warning: 'Execution is completed, but no results return!',
      error: {
        database: (err) => antSword.noxss(`Failed to obtain a list of databases!\n${err}`),
        table: (err) => antSword.noxss(`Get table data failed!\n${err}`),
        column: (err) => antSword.noxss(`Failed to obtain field list!\n${err}`),
        query: (err) => antSword.noxss(`Failure to execute SQL!\n${err}`),
        parse: 'Return data format is incorrect!',
        noresult: 'No query results!'
      }
    },
    form: {
      title: 'Add conf',
      toolbar: {
        add: 'Add',
        clear: 'Clear',
        edit: 'Edit'
      },
      conn: 'Connection String',
      type: 'Database type',
      encode: 'Database encode',
      host: 'Host',
      user: 'User',
      passwd: 'Password',
      warning: 'Please fill in the complete!',
      success: 'Successful add configuration!',
      del: {
        title: 'Delete configuration',
        confirm: 'Determine delete this configuration?',
        success: 'Delete configuration success!',
        error: (err) => antSword.noxss(`Delete configuration failed!\n${err}`)
      }
    }
  },
  settings: {
    about: {
      title: 'About',
      header: 'AntSword',
      homepage: 'Home',
      document: 'Document',
      qqgroup: 'QQ Group'
    },
    language: {
      title: 'Language setting',
      toolbar: {
        save: 'Save'
      },
      form: {
        label: 'Select language'
      },
      success: 'Setting language success!',
      confirm: {
        content: 'Restart the application?',
        title: 'Setting language'
      }
    },
    update: {
      title: 'Check update',
      current: 'Current version',
      toolbar: {
        check: 'Check'
      },
      check: {
        ing: 'Check for updates..',
        fail: (err) => `Check for update failed!\n${err}`,
        none: (ver) => `After examination, no update![v${ver}]`,
        found: (ver) => `Found a new version [v${ver}]`
      },
      prompt: {
        btns: {
          ok: 'Update',
          no: 'Cancel'
        },
        title: 'Update to version',
        changelog: 'Change Logs: ',
        sources: 'Download source: ',
        fail: {
          md5: 'File MD5 value check failed!',
          unzip: (err) => `Unzip the file failed! [${err}]`
        }
      },
      message: {
        ing: 'Downloading..',
        fail: (err) => `Update failed! [${err}]`,
        success: 'Update success! Please manually restart the application later!'
      }
    },
    aproxy: {
      title: 'Proxy setting',
      toolbar: {
        save: 'Save',
        test: 'Test connect'
      },
      form: {
        label: 'Configure proxy for access to the Internet',
        mode:{
          noproxy: 'Do not use agent',
          manualproxy: 'Manually set the proxy'
        },
        proxy: {
          protocol: 'Agency agreement',
          server: 'Proxy server',
          port: 'Port',
          username: 'AuthUser',
          password: 'Password',
          authtip: 'If there is no authentication if'
        }
      },
      success: 'Save proxy settings successfully!',
      error: 'Failed to save the proxy settings!',
      confirm: {
        content: 'Restart the application to take effect, whether to restart?',
        title: 'Change proxy settings'
      },
      prompt:{
        title: 'Enter the Test-URL',
        success: 'Connect to proxy server successfully',
        error: 'Failed to connect to the proxy server'
      }
    }
  },
  aproxy: {
    title: 'Proxy Configuration',
    toolbar: {
      save: 'Save',
      test: 'Test Connection'
    },
    form: {
      label: 'Configuring proxy access to the Internet',
      mode:{
        noproxy: 'No Proxy',
        manualproxy: 'Set the proxy manually'
      },
      proxy: {
        protocol: 'Protocol',
        server: 'Server',
        port: 'Port',
        username: 'Username',
        password: 'Password',
        authtip: 'Leave blank if no authentication'
      }
    },
    success: 'Successfully save the Proxy Configuration!',
    error: 'Failed to save the Proxy Configuration!',
    confirm: {
      content: 'Restart the application?',
      title: 'Proxy Configuration'
    },
    prompt:{
      title: 'Input the target URL',
      success: 'Successfully connect to the proxy server',
      error: 'Failed to connect to the proxy server'
    }
  },
  plugin: {
    error: (err) => antSword.noxss(`Load Plugin Store failed!\n${err}`)
  },
  update: {
    title: 'Found updates',
    body: (ver) => `New version: ${ver}`
  },
  viewsite: {
    toolbar: {
      save: 'Save',
      view: 'View'
    },
    saveSuccess: 'Save cookie configuration is successful!',
    saveFailed: (err) => `Save cookie configuration failed!\n${err}`
  }
}
