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
      plugin: 'Plugin center',
      settings: 'System setting',
      language: 'Language setting',
      update: 'Check update',
      quit: 'Quit'
    },
    shell: {
      title: 'Data',
      add: 'Add data',
      search: 'Search data',
      dump: 'Dump data',
      import: 'Import data',
      clear: 'Clear all data'
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
      pluginCenter: 'Plugin center',
      clearCache: 'Clear cache',
      clearAllCache: 'Clear all cache'
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
        error: (category, err) => antSword.noxss(`Delete category(${category}failed!<br/>${err}`)
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
          encode: 'Encode',
          type: 'Shell type',
          encoder: 'Encoder'
        },
        warning: 'Please enter the full!',
        success: 'Add shell success!',
        error: (err) => antSword.noxss(`Add shell failed!<br/>${err}`)
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
          encode: 'Encode',
          type: 'Shell type',
          encoder: 'Encoder'
        },
        warning: 'Please enter the full!',
        success: 'Update shell success!',
        error: (err) => antSword.noxss(`Update shell failed!<br/>${err}`)
      },
      del: {
        title: 'Delete shell',
        confirm: (len) => antSword.noxss(`Are you sure to delete ${len} shells?`),
        success: (len) => antSword.noxss(`Delete ${len} shells success!`),
        error: (err) => antSword.noxss(`Delete failed!<br/>${err}`)
      },
      move: {
        success: (num) => antSword.noxss(`Move ${num}datas success!`),
        error: (err) => antSword.noxss(`Move data failed!<br/>${err}`)
      },
      clearCache: {
        title: 'Clear cache',
        confirm: 'Are you sure to clear this cache?',
        success: 'Clear cache success!',
        error: (err) => antSword.noxss(`Clear cache failed!<br/>${err}`)
      },
      clearAllCache: {
        title: 'Clear all cache',
        confirm: 'Are you sure to clear all the cache?',
        success: 'Clear all cache success!',
        error: (err) => antSword.noxss(`Clear all cache failed!<br/>${err}`)
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
      error: (path, err) => antSword.noxss(`Delete file [${path}] failed!${err ? '<br/>' + err : ''}`)
    },
    paste: {
      success: (path) => antSword.noxss(`Paste file success!<br/>${path}`),
      error: (path, err) => antSword.noxss(`Paste file [${path}] failed!${err ? '<br/>' + err : ''}`)
    },
    rename: {
      title: 'Rename',
      success: 'Rename success!',
      error: (err) => antSword.noxss(`Rename failed!${err ? '<br/>' + err : ''}`)
    },
    createFolder: {
      title: 'Create Folder',
      value: 'New Folder',
      success: (path) => antSword.noxss(`Create folder success!<br/>${path}`),
      error: (path, err) => antSword.noxss(`Create folder [${path}] failed!${err ? '<br/>' + err : ''}`)
    },
    createFile: {
      title: 'Create File',
      value: 'New File.txt',
      success: (path) => antSword.noxss(`Create file success!<br/>${path}`),
      error: (path, err) => antSword.noxss(`Create file [${path}] failed!${err ? '<br/>' + err : ''}`)
    },
    retime: {
      title: 'Retime File',
      success: (path) => antSword.noxss(`Retime file success!<br/>${path}`),
      error: (path, err) => antSword.noxss(`Retime file [${path}] failed!${err ? '<br/>' + err : ''}`)
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
      success: (path) => antSword.noxss(`Upload file success!<br/>${path}`),
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
          success: (path) => antSword.noxss(`Add to bookmark success!<br/>${path}`),
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
            warning: (id) => antSword.noxss(`Already add to clipboard!<br/>${id}`),
            info: (id) => antSword.noxss(`Add file to the clipboard.<br/>${id}`)
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
      loadErr: (err) => antSword.noxss(`Load file error!<br/>${err}`),
      success: (path) => antSword.noxss(`Save the file success!<br/>${path}`),
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
      error: (name, err) => antSword.noxss(`Download file [${name}]error!<br/>${err}`),
      success: (name) => antSword.noxss(`Download file [${name}] success!`)
    }
  },
  database: {
    list: {
      title: 'Config list',
      add: 'Add',
      del: 'Del',
      menu: {
        add: 'Add conf',
        del: 'Del conf'
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
        database: (err) => antSword.noxss(`Failed to obtain a list of databases!<br/>${err}`),
        table: (err) => antSword.noxss(`Get table data failed!<br/>${err}`),
        column: (err) => antSword.noxss(`Failed to obtain field list!<br/>${err}`),
        query: (err) => antSword.noxss(`Failure to execute SQL!<br/>${err}`),
        parse: 'Return data format is incorrect!',
        noresult: 'No query results!'
      }
    },
    form: {
      title: 'Add conf',
      toolbar: {
        add: 'Add',
        clear: 'Clear'
      },
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
        error: (err) => antSword.noxss(`Delete configuration failed!<br/>${err}`)
      }
    }
  },
  settings: {
    about: {
      title: 'About'
    },
    language: {
      title: 'Language setting',
      toolbar: {
        save: 'Save'
      },
      form: {
        label: 'Select language',
        zh: '简体中文',
        en: 'English'
      },
      success: 'Setting language success!',
      confirm: {
        content: 'Restart the application?',
        title: 'Setting language'
      }
    },
    update: {
      title: 'Check update',
      toolbar: {
        check: 'Check'
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
    error: (err) => antSword.noxss(`Load plugin center failed!<br/>${err}`)
  }
}
