const CM = {
  /**
   * Cookie操作对象
   * @type {object}
   */
  cookies: antSword.remote.session.defaultSession.cookies,
  /**
   * 获取Cookie
   * @param  {Object} opt = {} 查询条件{url, name, domain, path, secure, session}
   * @docLink http://electron.atom.io/docs/api/session/#cookiesgetfilter-callback
   * @return {Promise}     [description]
   */
  get: (opt = {}) => {
    return new Promise((res, rej) => {
      CM.cookies.get(opt, (err, _cookies) => {
        if (err) { return rej(err) }
        return res(_cookies);
      })
    })
  },
  /**
   * 获取Cookie字符串
   * @param  {object} opt = {}
   * @return {[type]}     [description]
   */
  getStr: (opt = {}) => {
    return new Promise((res, rej) => {
      CM.cookies.get(opt, (err, _cookies) => {
        if (err) { return rej(err) }
        let _cs = [];
        _cookies.map((_) => {
          _cs.push(
            _['name'] + '=' + _['value']
          )
        });
        return res(_cs.join('; '));
      })
    })
  }
}

module.exports = CM;
