/**
 * Shell数据库管理模块
 * 更新：2016/06/28
 */

'use strict';

const fs = require('fs'),
  dns = require('dns'),
  path = require('path'),
  CONF = require('./config'),
  Datastore = require('nedb'),
  qqwry = require("geoips").info();

var logger;

class Database {

  /**
   * 初始化数据库
   * @param  {electron} electron electron对象
   * @return {[type]}          [description]
   */
  constructor(electron) {
    logger = new electron.Logger('Database');
    this.cursor = new Datastore({
      filename: CONF.dataPath,
      autoload: true
    });
    // 监听事件
    electron.ipcMain
      .on('shell-add', this.addShell.bind(this))
      .on('shell-del', this.delShell.bind(this))
      .on('shell-edit', this.editShell.bind(this))
      .on('shell-move', this.moveShell.bind(this))
      .on('shell-find', this.findShell.bind(this))
      .on('shell-clear', this.clearShell.bind(this))
      .on('shell-findOne', this.findOneShell.bind(this))
      .on('shell-addDataConf', this.addDataConf.bind(this))
      .on('shell-editDataConf', this.editDataConf.bind(this))
      .on('shell-delDataConf', this.delDataConf.bind(this))
      .on('shell-getDataConf', this.getDataConf.bind(this))
      .on('shell-renameCategory', this.renameShellCategory.bind(this))
      .on('shell-updateHttpConf', this.updateHttpConf.bind(this));
  }

  /**
   * 查询shell数据
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  查询配置
   * @return {[type]}       [description]
   */
  findShell(event, opts = {}) {
    logger.debug('findShell', opts);
    this.cursor
      .find(opts)
      .sort({
        utime: -1
      })
      .exec((err, ret) => {
        event.returnValue = ret || [];
      });
  }

  /**
   * 查询单一shell数据
   * @param  {Object} event ipcMain对象
   * @param  {String} opts  shell id
   * @return {[type]}       [description]
   */
  findOneShell(event, opts) {
    logger.debug('findOneShell', opts);
    this.cursor.findOne({
      _id: opts
    }, (err, ret) => {
      event.returnValue = err || ret;
    });
  }


  /**
   * 根据URL解析出IP&&地理位置
   * @param  {String} url URL地址
   * @return {Promise}     ip, addr
   */
  _url2ip(url) {
    return new Promise((res, rej) => {
      // 解析domain
      const urlArr = url.match(/(\w+):\/\/([\w\.\-]+)[:]?([\d]*)([\s\S]*)/i);
      // 无效url
      if (!urlArr || urlArr.length < 3) {
        return rej('Unable to resolve domain name from URL');
      }
      // 获取IP
      const domain = urlArr[2];
      dns.lookup(domain, (err, ip) => {
        if (err) {
          return rej(err.toString());
        }
        // 获取地理位置
        const _addr = qqwry.searchIP(ip);
        return res({
          ip: ip,
          addr: `${_addr.Country} ${_addr.Area}`
        });
      })
    })
  }

  /**
   * 添加shell数据
   * @param {Object} event ipcMain对象
   * @param {Object} opts  数据（url,category,pwd,type,encode,encoder
   */
  addShell(event, opts) {
    logger.info('addShell', opts);

    this._url2ip(opts.base['url'])
      .then((ret) => {
        this.cursor.insert({
          category: opts.base['category'] || 'default',
          url: opts.base['url'],
          pwd: opts.base['pwd'],
          type: opts.base['type'],
          ip: ret['ip'],
          addr: ret['addr'],
          encode: opts.base['encode'],
          encoder: opts.base['encoder'],
          httpConf: opts.http,
          otherConf: opts.other,
          ctime: +new Date,
          utime: +new Date
        }, (_err, _ret) => {
          event.returnValue = _err || _ret;
        });
      })
      .catch((_err) => {
        event.returnValue = _err;
      })
  }

  /**
   * 编辑shell数据
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  数据（old,new
   * @return {[type]}       [description]
   */
  editShell(event, opts) {
    logger.warn('editShell', opts);

    const _new = opts.new;
    const _old = opts.old;

    this._url2ip(_new.base['url'])
      .then((ret) => {
        this.cursor.update({
          _id: _old['_id']
        }, {
          $set: {
            ip: ret['ip'],
            addr: ret['addr'],
            url: _new.base['url'],
            pwd: _new.base['pwd'],
            type: _new.base['type'],
            encode: _new.base['encode'],
            encoder: _new.base['encoder'],
            httpConf: _new.http,
            otherConf: _new.other,
            utime: +new Date
          }
        }, (_err, _ret) => {
          event.returnValue = _err || _ret;
        })
      })
      .catch((_err) => {
        event.returnValue = _err;
      });
  }

  /**
   * 更新httpConf配置信息（包含body&&headers
   * @param  {[type]} event [description]
   * @param  {[type]} opt  = {} [description]
   * @return {[type]}       [description]
   */
  updateHttpConf(event, opt = {}) {
    logger.warn('updateHttpConf', opt);

    this.cursor.update({
      _id: opt._id
    }, {
      $set: {
        httpConf: opt.conf,
        utime: +new Date
      }
    }, (_err, _ret) => {
      event.returnValue = _err || _ret;
    });
  }

  /**
   * 删除shell数据
   * @param  {Object} event ipcMain对象
   * @param  {Array}  opts  要删除的shell-id列表
   * @return {[type]}       [description]
   */
  delShell(event, opts) {
    logger.warn('delShell', opts);
    this.cursor.remove({
      _id: {
        $in: opts
      }
    }, {
      multi: true
    }, (err, num) => {
      event.returnValue = err || num;
    })
  }

  /**
   * 删除分类shell数据
   * @param  {Object} event ipcMain对象
   * @param  {String} opts  shell分类名
   * @return {[type]}       [description]
   */
  clearShell(event, opts) {
    logger.fatal('clearShell', opts);
    this.cursor.remove({
      category: opts
    }, {
      multi: true
    }, (err, num) => {
      event.returnValue = err || num;
    })
  }

  /**
   * 重命名shell分类
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  配置（oldName,newName
   * @return {[type]}       [description]
   */
  renameShellCategory(event, opts) {
    logger.warn('renameShellCategory', opts);
    this.cursor.update({
      category: opts['oldName']
    }, {
      $set: {
        category: opts['newName']
      }
    }, {
      multi: true
    }, (err, num) => {
      event.returnValue = err || num;
    })
  }

  /**
   * 移动shell数据分类
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  配置（ids,category
   * @return {[type]}       [description]
   */
  moveShell(event, opts) {
    logger.info('moveShell', opts);
    this.cursor.update({
      _id: {
        $in: opts['ids'] || []
      }
    }, {
      $set: {
        category: opts['category'] || 'default',
        utime: +new Date
      }
    }, {
      multi: true
    }, (err, num) => {
      event.returnValue = err || num;
    })
  }

  /**
   * 添加数据库配置
   * @param {Object} event ipcMain对象
   * @param {Object} opts  配置（_id,data
   */
  addDataConf(event, opts) {
    logger.info('addDataConf', opts);
    // 1. 获取原配置列表
    this.cursor.findOne({
      _id: opts['_id']
    }, (err, ret) => {
      let confs = ret['database'] || {};
      // 随机Id（顺序增长
      const random_id = parseInt(+new Date + Math.random() * 1000).toString(16);
      // 添加到配置
      confs[random_id] = opts['data'];
      // 更新数据库
      this.cursor.update({
        _id: opts['_id']
      }, {
        $set: {
          database: confs,
          utime: +new Date
        }
      }, (_err, _ret) => {
        event.returnValue = random_id;
      });
    });
  }

  /**
   * 修改数据库配置
   * @param {Object} event ipcMain对象
   * @param {Object} opts  配置（_id,id,data
   */
  editDataConf(event, opts) {
    logger.info('editDataConf', opts);
    // 1. 获取原配置列表
    this.cursor.findOne({
      _id: opts['_id']
    }, (err, ret) => {
      let confs = ret['database'] || {};
      // 添加到配置
      confs[opts['id']] = opts['data'];
      // 更新数据库
      this.cursor.update({
        _id: opts['_id']
      }, {
        $set: {
          database: confs,
          utime: +new Date
        }
      }, (_err, _ret) => {
        event.returnValue = opts['id'];
      });
    });
  }

  /**
   * 删除数据库配置
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  配置（_id,id
   * @return {[type]}       [description]
   */
  delDataConf(event, opts) {
    logger.info('delDataConf', opts);
    // 1. 获取原配置
    this.cursor.findOne({
      _id: opts['_id']
    }, (err, ret) => {
      let confs = ret['database'] || {};
      // 2. 删除配置
      delete confs[opts['id']];
      // 3. 更新数据库
      this.cursor.update({
        _id: opts['_id']
      }, {
        $set: {
          database: confs,
          utime: +new Date
        }
      }, (_err, _ret) => {
        event.returnValue = _err || _ret;
      });
    })
  }

  /**
   * 获取单个数据库配置
   * @param  {Object} event ipcMain对象
   * @param  {Object} opts  配置（_id,id
   * @return {[type]}       [description]
   */
  getDataConf(event, opts) {
    logger.info('getDatConf', opts);
    this.cursor.findOne({
      _id: opts['_id']
    }, (err, ret) => {
      const confs = ret['database'] || {};
      event.returnValue = err || confs[opts['id']];
    });
  }
}

module.exports = Database;
