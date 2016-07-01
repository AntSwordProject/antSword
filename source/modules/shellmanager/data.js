/**
 * shell数据操作模块
 */

module.exports = {
  /**
   * 获取Shell数据
   * @param  {Object} arg 查询参数
   * @return {[type]}     [description]
   */
  get: (arg = {}) => {
    const ret = antSword['ipcRenderer'].sendSync('shell-find', arg);
    // 解析数据
    let data = [];
    let category = {};
    ret.map((_) => {
      let _c = _['category'] || 'default';
      category[_c] = category[_c] || 0;
      category[_c] ++;
      if ((arg instanceof Object) && arg['category'] && arg['category'] !== _['category']) {
        return;
      };
      if (!arg && _['category'] !== 'default') {
        return;
      };
      data.push({
        id: _['_id'],
        data: [
          _['url'], _['ip'], _['addr'],
          new Date(_['ctime']).format('yyyy/MM/dd hh:mm:ss'),
          new Date(_['utime']).format('yyyy/MM/dd hh:mm:ss')
        ]
      });
    });
    // 如果分类没数据
    if ((arg instanceof Object) && arg['category'] && !category[arg['category']]) {
      category[arg['category']] = 0;
    };
    if (typeof(category['default']) === 'object') {
      category['default'] = 0;
    };
    return {
      data: data,
      category: category
    }
  }
}
