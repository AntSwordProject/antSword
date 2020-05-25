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
      encoders: 'Encoders manager',
      aproxy: 'Proxy setting',
      display: 'Display setting',
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
      selectall: 'SelectAll',
      search: 'Search'
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
      copy: 'Copy',
      search: 'Search',
      plugin: 'Plugins',
      pluginDefault: 'Default',
      pluginStore: 'Plugin Store',
      clearCache: 'Clear cache',
      clearAllCache: 'Clear all cache',
      viewsite: 'View Site',
      copyurl: 'Copy URL'
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
        success: (category) => `Delete category(${category}) success!`,
        error: (category, err) => `Delete category(${category}failed!\n${err}`
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
      not_recommended: 'Not recommended',
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
          test: 'Test Connection',
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
        test_success: 'Connection Successful!',
        test_warning: 'Response is null!',
        warning: 'Please enter the full!',
        success: 'Add shell success!',
        error: (err) => `Add shell failed!\n${err}`
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
        error: (err) => `Update shell failed!\n${err}`
      },
      del: {
        title: 'Delete shell',
        confirm: (len) => antSword.noxss(`Are you sure to delete ${len} shells?`),
        success: (len) => `Delete ${len} shells success!`,
        error: (err) => `Delete failed!\n${err}`
      },
      move: {
        success: (num) => `Move ${num}datas success!`,
        error: (err) => `Move data failed!\n${err}`
      },
      clearCache: {
        title: 'Clear cache',
        confirm: 'Are you sure to clear this cache?',
        success: 'Clear cache success!',
        error: (err) => `Clear cache failed!\n${err}`
      },
      clearAllCache: {
        title: 'Clear all cache',
        confirm: 'Are you sure to clear all the cache?',
        success: 'Clear all cache success!',
        error: (err) => `Clear all cache failed!\n${err}`
      },
      accordion: {
        base: 'Base',
        http: 'HTTP',
        other: 'Other'
      },
      otherConf: {
        nohttps: 'Ignore HTTPS certificate',
        usemultipart: 'Use Multipart send payload',
        addMassData: 'Add garbage data in payload',
        randomPrefix: 'Random prefix length',
        userandomvariable: 'Use random English word variables',
        chunk: {
          title: 'Chunked Transfer (Experimentally)',
          usechunk: 'Use Chunked send payload.',
          min: 'Min Block',
          max: 'Max Block',
          exphint: 'This feature is currently experimental and cannot be used with Multipart. Some t' +
            'ypes of servers may not support Chunked transfers. In addition, it is recommende' +
            'd to set the timeout period to 30s or more to avoid data transmission when the n' +
            'etwork speed is not good.'
        },
        terminalCache: "Use the terminal's cache",
        filemanagerCache: "Use the filemanager's cache",
        uploadFragment: "Upload File Fragmentation Size",
        requestTimeout: 'Request timeout',
        commandPath: 'Custom terminal-execPath',
        customDatatag: {
          title: 'Data separator',
          usecustomdatatag: 'Use custom data separator',
          tags: 'Start tag',
          tage: 'End tag',
          exphint: 'The data separator should be the same as other unrelated characters on the page',
          valideq: 'Start tag and End tag cannot be the same'
        },
      }
    },
    toolbar: {
      select: 'Please select at least one shell',
      setting: {
        text: 'Setting',
        title: 'Setting pligins which you want to show'
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
    },
    ascmd: {
      help: 'Enter ashelp to view local commands',
      ashelp: `Usage:
 asenv [Key=Value]\t\tSet or Display Environment Variables, eg: asenv AAA=BBB
 ascmd [file]\t\tExecute the command with file, eg: ascmd /bin/bash
 aslistcmd\t\tList available command interpreters
 aspowershell [on|off]\t\tEnable/Disable PowerShell mode, eg: aspowershell on
 aswinmode [on|off]\t\tEnable/Disable Windows mode(for recognition errors), eg: aswinmode on
 quit\t\tClose terminal
 exit\t\tClose terminal

Hot Keys:
 Ctrl =\t\tIncrease font
 Ctrl -\t\tDecrease font
 Ctrl L\t\tClean screen
 Ctrl U\t\tClear the current line
 Ctrl A\t\tMove cursor to the beginning of the line
 Ctrl E\t\tMove cursor to the end of the line
 Ctrl F/B\t\tForward and backward (equivalent to the left and right direction keys)
 Ctrl P\t\tPrevious command
 Ctrl R\t\tSearch command history
 Ctrl D\t\tDelete the character of the current cursor
 Ctrl H\t\tDeletes the character before the cursor
 Ctrl W\t\tDelete the word before the cursor
 Ctrl K\t\tDelete to the end of the text
 Ctrl T\t\tExchange text at the cursor
 `,
      ascmd: (cmd) => antSword.noxss(`Will execute the command with ${cmd}.`),
      aspowershell: {
        on: "Powershell mode enabled",
        off: "Powershell mode disabled"
      }
    }
  },
  filemanager: {
    title: 'FileManager',
    delete: {
      title: 'Delete',
      confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
        ? num + ' files'
        : num} ?`),
      success: (path) => `Delete file [${path}] success!`,
      error: (path, err) => `Delete file [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    paste: {
      success: (path) => `Paste file success!\n${path}`,
      error: (path, err) => `Paste file [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    rename: {
      title: 'Rename',
      success: 'Rename success!',
      error: (err) => `Rename failed!${err
        ? '\n' + err
        : ''}`
    },
    createFolder: {
      title: 'Create Folder',
      value: 'New Folder',
      success: (path) => `Create folder success!\n${path}`,
      error: (path, err) => `Create folder [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    createFile: {
      title: 'Create File',
      value: 'New File.txt',
      success: (path) => `Create file success!\n${path}`,
      error: (path, err) => `Create file [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    retime: {
      title: 'Retime File',
      success: (path) => `Retime file success!\n${path}`,
      error: (path, err) => `Retime file [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    chmod: {
      title: 'Chmod File',
      check: 'Input should be octal numbers, eg: 0644',
      success: (path) => `Chmod file success!\n${path}`,
      error: (path, err) => `Chmod file [${path}] failed!${err
        ? '\n' + err
        : ''}`
    },
    wget: {
      title: 'Wget File',
      check: 'URL is not correct!',
      task: {
        name: 'WGET',
        start: 'Start to wget file..',
        success: 'Wget success!',
        failed: (ret) => `Failed:${ret}`,
        error: (err) => `Error:${err}`
      }
    },
    upload: {
      task: {
        name: 'Upload',
        success: 'Upload success!',
        httperr_413: 'Please lower the upload file shard size setting.',
        httperr_etime: 'Request timeout, please increase the timeout period.',
        httperr_econnrefused: 'Connection refused, check target or proxy is enabled.',
        failed: (err) => `Failed:${err}`,
        error: (err) => `Error:${err}`
      },
      success: (path) => `Upload file success!\n${path}`,
      error: (path, err) => `Upload file [${path}] failed!${err}`
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
          success: (path) => `Add to bookmark success!\n${path}`
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
          edit: {
            title: 'Edit',
            openwindow: 'Open in Window',
            opentab: 'Open in Tab'
          },
          delete: 'Delete',
          rename: 'Rename',
          refresh: 'Refresh',
          wget: 'WGET',
          upload: 'Upload',
          download: 'Download',
          modify: 'Modify the file time',
          chmod: 'Chmod',
          copy: {
            title: 'Copy',
            copyname: 'Copy FileName',
            copypath: 'Copy FilePath',
            copysuccess: 'Copy to clipboard successfully!',
            copyfail: 'Copy to clipboard failed!',
            warning: (id) => `Already add to clipboard!\n${id}`,
            info: (id) => `Add file to the clipboard.\n${id}`
          },
          create: {
            title: 'Create',
            folder: 'Folder',
            file: 'File'
          },
          terminal: 'Open Terminal Here'
        }
      }
    },
    editor: {
      title: (path) => antSword.noxss(`Edit: ${path}`),
      toolbar: {
        refresh: 'Refresh',
        save: 'Save',
        mode: 'Mode',
        encode: 'Open with Encoding'
      },
      loadErr: (err) => `Load file error!\n${err}`,
      success: (path) => `Save the file success!\n${path}`,
      error: (path, err) => `Save the file [${path}] failed!${err}`
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
        error: (err) => `Error:${err}`
      },
      error: (name, err) => `Download file [${name}]error!\n${err}`,
      success: (name) => `Download file [${name}] success!`
    }
  },
  database: {
    list: {
      title: 'Config list',
      add: 'Add',
      del: 'Del',
      edit: 'Edit',
      check: 'Check',
      menu: {
        add: 'Add conf',
        del: 'Del conf',
        edit: 'Edit conf',
        adddb: 'New Database',
        editdb: 'Edit Database',
        deldb: 'Del Database',
        addtable: 'New Table',
        edittable: 'Edit TableName',
        desctable: 'Desc Table',
        showcreatetable: 'Create Table SQL',
        deltable: 'Del Table',
        addcolumn: 'New Column',
        editcolumn: 'Edit ColumnName',
        delcolumn: 'Del Column'
      }
    },
    query: {
      title: 'Exec SQL',
      exec: 'Run',
      clear: 'Clear',
      bookmark: {
        title: 'Bookmark',
        add: 'Add bookmark',
        del: 'Remove this bookmark',
        clear: 'Clear all bookmarks'
      },
      prompt: {
        add: {
          title: 'Add to bookmark',
          success: (path) => `Add to bookmark success!\n${path}`
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
      }
    },
    result: {
      title: 'Result',
      warning: 'Execution is completed, but no results return!',
      error: {
        database: (err) => `Failed to obtain a list of databases!\n${err}`,
        table: (err) => `Get table data failed!\n${err}`,
        column: (err) => `Failed to obtain field list!\n${err}`,
        query: (err) => `Failure to execute SQL!\n${err}`,
        parse: 'Return data format is incorrect!',
        noresult: 'No query results!'
      },
      dump: {
        title: "Export Data",
        success: "Export success"
      }
    },
    notsupport: 'Not support the current database type',
    form: {
      title: 'Add conf',
      toolbar: {
        add: 'Add',
        clear: 'Clear',
        edit: 'Edit',
        test: 'Test connect'
      },
      conn: 'Connection String',
      type: 'Database type',
      encode: 'Database encode',
      host: 'Host',
      user: 'User',
      passwd: 'Password',
      warning: 'Please fill in the complete!',
      success: 'Successful add configuration!',
      test_success: 'Connection Successful!',
      test_warning: 'Response is null!',
      del: {
        title: 'Delete configuration',
        confirm: 'Determine delete this configuration?',
        success: 'Delete configuration success!',
        error: (err) => `Delete configuration failed!\n${err}`
      },
      adddb: {
        title: 'New Database',
        dbname: 'Name',
        characterset: 'Character Set',
        charactercollation: 'Collation',
        createbtn: 'OK',
        cancelbtn: 'Cancel',
        success: 'Create database successfully',
        error: 'Failed to create database'
      },
      editdb: {
        title: 'Database Properties',
        dbname: 'Name(readonly)',
        characterset: 'Character Set',
        charactercollation: 'Collation',
        updatebtn: 'OK',
        cancelbtn: 'Cancel',
        success: 'Edit database successfully',
        error: 'Failed to edit database'
      },
      deldb: {
        title: 'Delete Database',
        confirm: (name) => antSword.noxss(`Are you sure you want to delete database ${name} ?`),
        success: 'Delete database successfully',
        error: 'Failed to delete database'
      },
      addtable: {
        title: 'New Table',
        add: 'New Column',
        delete: 'Delete Column',
        save: 'Save',
        gridheader: "Name,Type,Length,Not Null,Key,Auto Increment",
        delete_not_select: "Please select the row you want to delete first",
        save_row_is_null: "The number of rows is empty",
        cell_valid_error: (i, j) => `Data format validation failed(row ${i + 1}, col ${j + 1})`,
        confirmtitle: "New table name",
        invalid_tablename: "Table names should not contain special symbols",
        success: 'Create table successfully',
        error: 'Failed to create table'
      },
      edittable: {
        title: "New table name",
        invalid_tablename: "Table names should not contain special symbols",
        success: 'Update table name successfully',
        error: 'Failed to update table'
      },
      deltable: {
        title: 'Delete Table',
        confirm: (name) => antSword.noxss(`Are you sure you want to delete table ${name}?`),
        success: 'Delete table successfully',
        error: 'Failed to delete table'
      },
      addcolumn: {},
      editcolumn: {
        title: "New column name",
        invalid_tablename: "Column names should not contain special symbols",
        get_column_type_error: "Get column type error",
        success: 'Update column name successfully',
        error: 'Failed to update column'
      },
      delcolumn: {
        title: 'Delete Column',
        confirm: (name) => antSword.noxss(`Are you sure you want to delete column ${name}?`),
        success: 'Delete column successfully',
        error: 'Failed to delete column'
      }
    },
    probedb: {
      title: 'Detect database function support',
      success: 'Check completed',
      coltype: 'ConnType',
      issupport: 'Support'
    }
  },
  settings: {
    about: {
      title: 'About',
      header: 'AntSword',
      homepage: 'Home',
      document: 'Document',
      qqgroup: 'QQ Group',
      discord: 'Discord',
      securityreport: 'Security Report',
      wechat: 'Fllow us on WeChat'
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
          no: 'Cancel',
          changelog: 'ChangeLog'
        },
        body: (ver) => `Found new version v${ver}, update now?`,
        loader_body: (ver) => `The new version of the Loader v${ver} has been released, the currently used loader will not be available, will you quit the program and go to download the latest version of the Loader?`,
        title: 'Update to version',
        changelog: 'Change Logs: ',
        sources: 'Download source: ',
        fail: {
          md5: 'File MD5 value check failed!',
          unzip: (err) => `Unzip the file failed! [${err}]`
        }
      },
      message: {
        githint: (workdir) => `The current source is Git management, please close the program and go to ${workdir} to manually update`,
        prepare: "Connecte to server...",
        dling: (progress) => `Downloading...${progress}%`,
        dlingnp: (size) => `Downloading...${size}`,
        dlend: "Download completed",
        extract: "Unpacking, don't close AntSword",
        ing: 'Downloading..',
        fail: (err) => `Update failed! [${err}]`,
        success: 'Update success! Please manually restart the application later!'
      }
    },
    encoders: {
      title: 'Encoder Manager',
      encoder: "Encoder",
      decoder: "Decoder",
      toolbar: {
        new: "New Encoder",
        new_decoder: "New Decoder",
        edit: "Edit",
        delete: "Delete",
        help: "Help",
        save: "Save",
        rsa: "RSA Config",
        more: "Get More",
        generate: "Generate"
      },
      grid: {
        ename: "Name",
        etype: "Shell Type",
        edtype: {
          title: "Type",
          encoder: "Encoder",
          decoder: "Decoder"
        }
      },
      form: {
        public_key: "Public Key",
        private_key: "Private Key",
        php_code: "PHP Code"
      },
      rsa_config_win_title: "RSA Encoder Config",
      edit_win_title: "Edit",
      delete_title: "Delete",
      message: {
        ename_duplicate: "The name cannot be duplicated",
        rename_success: "Rename success",
        etype_error: "Type error",
        retype_success: "Modify type success",
        create_success: "Create success",
        edit_not_select: "Please select the row you want to edit first",
        edit_only_single: "You can only edit one",
        edit_null_value: "Content can not be empty",
        edit_save_success: "Save success",
        delete_not_select: "Please select the row you want to delete first",
        delete_success: "Delete success",
        ename_invalid: "Name can only contain numbers, letters, and underlines",
        rsa_save_success: "Generate and save RSA success",
        rsa_save_error: "Generate and save RSA error"
      },
      prompt: {
        create_encoder: "Create Encoder",
        create_decoder: "Create Decoder"
      },
      confirm: {
        generate: 'Are you sure to regemerate RSA?',
        delete: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
          ? num + ' encoders'
          : num}?`)
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
        mode: {
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
      prompt: {
        title: 'Enter the Test-URL',
        success: 'Connect to proxy server successfully',
        error: 'Failed to connect to the proxy server'
      }
    },
    display: {
      title: 'Display setting',
      success: 'Save display settings successfully!',
      error: 'Failed to save the display settings!',
      confirm: {
        content: 'Restart the application to take effect, whether to restart?',
        title: 'Change display settings'
      },
      toolbar: {
        save: 'Save'
      },
      form: {
        shellmanager: {
          title: 'Shell Lists',
          hiddencolumns: {
            title: 'Hide selected columns',
            url: 'URL',
            ip: 'IP',
            addr: 'ADDR',
            note: 'NOTE',
            ctime: 'CTIME',
            utime: 'UTIME'
          }
        }
      }
    },
    adefault: {
      title: 'Default Setting',
      success: 'Save default settings successfully!',
      error: 'Failed to save the default settings!',
      confirm: {
        content: 'Restart the application to take effect, whether to restart?',
        title: 'Change default settings'
      },
      toolbar: {
        save: 'Save'
      },
      filemanager: {
        title: 'FileManager',
        openfileintab: {
          title: 'Open File in',
          window: 'Window',
          tab: 'Tab'
        },
        bookmark: {
          title: 'Global Bookmark',
          nodata: 'No data, click the right mouse button add',
          grid: {
            name: 'Name',
            path: 'Path'
          },
          bmenu: {
            add: 'Add Bookmark',
            del: 'Del Bookmark'
          },
          add: {
            title: 'Add to global bookmark',
            success: 'Add success',
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            addbtn: 'Confirm'
          },
          del: {
            title: 'Delete Bookmark',
            confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
              ? num + ' Bookmarks'
              : num + " "}？`),
            success: 'Delete success'
          },
          edit: {
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            success: 'Edit success'
          }
        }
      },
      database: {
        title: 'Database',
        bookmark: {
          title: 'Global Bookmark',
          nodata: 'No data, click the right mouse button add',
          grid: {
            name: 'Name',
            path: 'SQL'
          },
          bmenu: {
            add: 'Add Bookmark',
            del: 'Del Bookmark'
          },
          add: {
            title: 'Add to global SQL bookmark',
            success: 'Add success',
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            addbtn: 'Confirm'
          },
          del: {
            title: 'Delete Bookmark',
            confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
              ? num + ' Bookmarks'
              : num + " "}？`),
            success: 'Delete success'
          },
          edit: {
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            success: 'Edit success'
          }
        }
      },
      shellmanager: {
        title: 'ShellManager',
        header: {
          title: 'Default HTTP Headers',
          nodata: 'No HTTP Header data, click the right mouse button add',
          grid: {
            name: 'Name',
            value: 'Vaule'
          },
          bmenu: {
            add: 'Add HTTP Header',
            del: 'Del HTTP Header'
          },
          add: {
            title: 'Add HTTP Header',
            success: 'Add success',
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            addbtn: 'Confirm'
          },
          del: {
            title: 'Delete HTTP Header',
            confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
              ? num + ' Headers'
              : num + " "}?`),
            success: 'Delete success'
          },
          edit: {
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            success: 'Edit success'
          }
        },
        body: {
          title: 'Default HTTP Body',
          nodata: 'No HTTP Body data, click the right mouse button add',
          grid: {
            name: 'Name',
            value: 'Value'
          },
          bmenu: {
            add: 'Add HTTP Body',
            del: 'Del HTTP Body'
          },
          add: {
            title: 'Add HTTP Body',
            success: 'Add success',
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            addbtn: 'Confirm'
          },
          del: {
            title: 'Delete HTTP Body',
            confirm: (num) => antSword.noxss(`Are you sure to delete ${typeof(num) === 'number'
              ? num + ' HTTP Body'
              : num + " "}?`),
            success: 'Delete success'
          },
          edit: {
            namedup: 'The name cannot be duplicated',
            name_invalid: 'Name is invalid',
            success: 'Edit success'
          }
        },
        other: {
          nohttps: 'Ignore HTTPS certificate',
          userandomvariable: 'Use random English word variables',
          requestTimeout: 'Request timeout'
        }
      },
      terminal: {
        title: 'Terminal',
        size: 'Scale'
      }
    }
  },
  plugin: {
    error: (err) => `Load Plugin Store failed!\n${err}`
  },
  update: {
    title: 'Found updates',
    body: (ver) => `New version: ${ver}, view changelog`
  },
  viewsite: {
    toolbar: {
      useproxy: (s) => `Proxy: ${s
        ? 'ON'
        : 'OFF'}`,
      save: 'Save',
      view: 'View'
    },
    saveSuccess: 'Save cookie configuration is successful!',
    saveFailed: (err) => `Save cookie configuration failed!\n${err}`
  }
}