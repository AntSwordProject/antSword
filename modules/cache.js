/**
 * 缓存管理模块
 * 更新：2016/04/28
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

const fs = require('fs'),
  path = require('path'),
  CONF = require('./config'),
  Datastore = require('nedb');

var logger;

class Cache {

  /**
   * 初始化监听事件
   * @param  {Object} electron electron对象
   * @return {[type]}          [description]
   */
  constructor(electron) {
    logger = new electron.Logger('Cache');
    electron.ipcMain
      .on('cache-add', this.addCache.bind(this))
      .on('cache-set', this.setCache.bind(this))
      .on('cache-get', this.getCache.bind(this))
      .on('cache-del', this.delCache.bind(this))
      .on('cache-clear', this.clearCache.bind(this))
      .on('cache-clearAll', this.clearAllCache.bind(this));
  }

  /**
   * 创建nedb数据库文件
   * @param  {String} id 数据存储文件名
   * @return {[type]}    [description]
   */
  createDB(id = String(+new Date)) {
    return new Datastore({
      filename: path.join(CONF.cachePath, id),
      autoload: true
    });
  }

  /**
   * 添加缓存数据
   * @param {Object} event ipcMain对象
   * @param {Object} opts  缓存配置（id,tag,cache
   */
  addCache(event, opts) {
    logger.debug('addCache', opts);
    this.createDB(opts['id']).insert({
      tag: opts['tag'],
      cache: opts['cache']
    }, (err, ret) => {
      event.returnValue = err || ret;
    });
  }

  /**
   * 设置缓存数据
   * @param {Object} event ipcMain对象
   * @param {Object} opts  缓存配置（id,tag,cache
   */
  setCache(event, opts) {
    logger.debug('setCache', opts);
    this.createDB(opts['id']).update({
      tag: opts['tag']
    }, {
      $set: {
        cache: opts['cache']
      }
    }, (err, ret) => {
      event.returnValue = err || ret;
    });
  }

  /**
   * 获取缓存数据
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  缓存配置(id,tag)
   * @return {[type]}       [description]
   */
  getCache(event, opts) {
    logger.debug('getCache', opts);
    this.createDB(opts['id']).findOne({
      tag: opts['tag']
    }, (err, ret) => {
      event.returnValue = err || ret;
    })
  }

  /**
   * 删除缓存
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  缓存配置(id,tag)
   * @return {[type]}       [description]
   */
  delCache(event, opts) {
    logger.warn('delCache', opts);
    this.createDB(opts['id']).remove({
      tag: opts['tag']
    }, (err, ret) => {
      event.returnValue = err || ret;
    });
  }

  /**
   * 清空缓存数据
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  缓存配置(id)
   * @return {[type]}       [description]
   */
  clearCache(event, opts) {
    logger.fatal('clearCache', opts);
    try{
      fs.unlinkSync(path.join(CONF.cachePath, opts['id']));
      event.returnValue = true;
    }catch(e) {
      event.returnValue = e;
    }
  }

  /**
   * 清空所有缓存数据
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  缓存配置(null)
   * @return {[type]}       [description]
   */
  clearAllCache(event, opts) {
    logger.fatal('clearAllCache', opts);
    try{
      fs.readdirSync(CONF.cachePath).map((_) => {
        fs.unlinkSync(path.join(CONF.cachePath, _));
      });
      event.returnValue = true;
    }catch(e) {
      event.returnValue = e;
    }
  }
}

module.exports = Cache;
