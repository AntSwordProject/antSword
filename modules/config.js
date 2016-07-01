/**
 * 中国蚁剑::后端配置模块
 * ? 用于进行一些通用的变量如初始化目录等设置
 * 开写：2016/04/26
 * 更新：2016/04/28
 * 作者：蚁逅 <https://github.com/antoor>
 */

'use strict';

const fs = require('fs'),
  path = require('path');

class Conf {

  constructor() {
    // 旧数据存储目录
    let _oldPath = path.join(
      process.env.HOME || process.env.LOCALAPPPATH || process.cwd() || '.',
      '.antSword',
      'shell.db'
    );
    // 数据存储目录
    this.basePath = path.join(
      process.env.AS_WORKDIR,
      'antData'
    )
    // 初始化目录
    !fs.existsSync(this.basePath) ? fs.mkdirSync(this.basePath) : null;
    // 旧数据搬迁
    if (fs.existsSync(_oldPath) && !fs.existsSync(this.dataPath)) {
      fs.writeFileSync(
        this.dataPath,
        fs.readFileSync(_oldPath)
      )
    }
  }

  /**
   * 获取数据存储路径
   * @return {String} file-path
   */
  get dataPath() {
    return path.join(this.basePath, 'db.ant');
  }

  /**
   * 获取缓存目录
   * @return {String} dir-path
   */
  get cachePath() {
    let _ = path.join(this.basePath, '/cache/');
    // 创建缓存目录
    !fs.existsSync(_) ? fs.mkdirSync(_) : null;
    return _;
  }

  /**
   * 获取插件目录
   * - 当前目录为下载的插件保存目录，而并非开发者的插件目录，同时开发者所设置的插件目录也不应为此
   * @return {String} plug-path
   */
  get plugPath() {
    let _ = path.join(this.basePath, '/plugins/');
    !fs.existsSync(_) ? fs.mkdirSync(_) : null;
    return _;
  }

  /**
   * 获取临时目录
   * - 用户存储下载文件等缓存内容
   * @return {String} temp-path
   */
  get tmpPath() {
    let _ = path.join(this.basePath, '/.temp/');
    !fs.existsSync(_) ? fs.mkdirSync(_) : null;
    return _;
  }

  /**
   * 获取package.json配置信息
   * @return {Object} [description]
   */
  get package() {
    return require('../package.json');
  }

}

module.exports = new Conf();
