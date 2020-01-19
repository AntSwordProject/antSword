//
// 命令执行模板
//

module.exports = () => ({
  exec: {
    _: 'M',
    'z1': '#{bin}',
    'z2': '#{cmd}',
    'z3': '#{env}'
  },
  listcmd: {
    _: 'Y',
    'z1': '#{binarr}'
  }
})