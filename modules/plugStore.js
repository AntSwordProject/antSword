/**
 * 应用商店后台模块
 * - 用于进行下载、安装、卸载等后台操作
 * create at: 2016/05/25
 */

let logger;
const fs = require('fs');
const path = require('path');
const CONF = require('./config');
const UNZIP = require('extract-zip');

class PlugStore {

  constructor(electron, app, mainWindow) {
    logger = new electron.Logger('PlugStore');
    this.listenDownload(mainWindow);

    electron.ipcMain
      .on('store-uninstall', (event, plugName) => {
        logger.warn('UnInstall', plugName);
        // 删除目录
        this.rmdir(
          path.join(CONF.plugPath, `${plugName}-master`)
        ).then((ret) => {
          event.returnValue = ret;
          // 重新加载插件列表
          mainWindow.webContents.send('reloadPlug', true);
        });
      })
      .on('store-uninstall-dev', (event, plugPath) => {
        logger.warn('UnInstall.DEV', plugPath);
        // 删除目录
        this.rmdir(plugPath).then((ret) => {
          event.returnValue = ret;
          // 重新加载插件列表
          mainWindow.webContents.send('reloadPlug', true);
        });
      })
      // 获取插件路径
      .on('store-config-plugPath', (event) => {
        event.returnValue = CONF.plugPath;
      })
  }

  /**
   * 监听下载
   * @param  {Object} mainWindow [description]
   * @return {[type]}            [description]
   */
  listenDownload(mainWindow) {
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
      let fileName = item.getFilename().replace(/\-master\.zip$/,'');
      let downLink = item.getURL();
      logger.info('down-store-plug', downLink);
      // 判断是否下载为插件
      if (downLink.indexOf('github.com/asStore') > 0) {
        // 1. 设置插件存储目录
        let savePath = path.join(CONF.tmpPath, `${fileName}.zip`);
        item.setSavePath(savePath);
        webContents.send('store-download-progress', {
          file: fileName,
          type: 'init',
          total: item.getTotalBytes()
        });
        // 2. 插件下载进度更新
        item.on('updated', () => {
          webContents.send('store-download-progress', {
            file: fileName,
            type: 'downloading',
            size: item.getReceivedBytes()
          });
        });
        // 3. 插件下载完毕
        item.on('done', (e, state) => {
          webContents.send('store-download-progress', {
            file: fileName,
            path: savePath,
            type: 'downloaded',
            state: state
          });
          if (state !== 'completed') { return };
          // 解压安装插件
          UNZIP(savePath, {
            dir: CONF.plugPath
          }, (err) => {
            webContents.send('store-download-progress', {
              type: 'installed',
              file: fileName
            });
            logger.info('Installed', fileName);
            // 重新加载插件列表
            mainWindow.webContents.send('reloadPlug', true);
          });
        });
      }
    });
  }

  /**
   * 删除目录
   * @param  {String} dir 目录
   * @return {[type]}     [description]
   */
  rmdir(dir) {
    return new Promise((res, rej) => {
      let ret = true;
      // 循环删除目录
      const _rmdir = (_dir) => {
        if (!fs.existsSync(_dir)) { return }
        fs.readdirSync(_dir).map((_) => {
          // 生成完整路径
          let _path = path.join(dir, _);
          // 如果是目录，则继续循环，否则删除
          if (fs.lstatSync(_path).isDirectory()) {
            return _rmdir(_path);
          }
          fs.unlinkSync(_path);
        });
        fs.rmdirSync(_dir);
      }
      try{
        _rmdir(dir);
      } catch (e) {
        ret = e;
      }
      return res(ret);
    });
  }
}

module.exports = PlugStore;
