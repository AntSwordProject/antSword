/**
 * 中国蚁剑::核心模块
 * 开写：2016/04/12
 * 更新：-
 * 作者：蚁逅 <https://github.com/antoor>
 */
'use strict';

class Core {
  /**
   * AntSword Core init
   * @return {object} 子模块操作对象
   */
  constructor() {
    // 加载子模块列表
    let cores = {};
    ['php', 'asp', 'aspx', 'custom'].map((_) => {
      cores[_] = require(`./${_}/index`);
    });
    // 返回子模块对象
    return cores;
  }
}

module.exports = new Core();
