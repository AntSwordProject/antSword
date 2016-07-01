//
// 缓存操作模块
//
'use strict';

class CacheManager {

  constructor(id) {
    this.id = id;
    this.sender = antSword['ipcRenderer'].sendSync;
  }

  // 获取缓存
  get(tag) {
    const ret = this.sender('cache-get', {
      id: this.id,
      tag: tag
    });
    return ret ? ret['cache'] : false;
  }

  // 更新缓存
  set(tag, cache) {
    return this.sender('cache-add', {
      id: this.id,
      tag: tag,
      cache: cache
    });
  }

  // 删除缓存
  del(tag) {
    return this.sender('cache-del', {
      id: this.id,
      tag: tag
    });
  }

  // 清空缓存
  clear() {
    return this.sender('cache-clear', {
      id: this.id
    });
  }

}

module.exports = CacheManager;
