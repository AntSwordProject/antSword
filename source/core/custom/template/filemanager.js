//
// 文件管理模板
//

module.exports = () => ({
  dir: {
    _: 'B',
    'z1': '#{path}'
  },

  delete: {
    _: 'E',
    'z1': '#{path}'
  },

  create_file: {
    _: 'D',
    'z1': '#{path}',
    'z2': '#{content}'
  },

  read_file: {
    _: 'C',
    'z1': '#{path}'
  },

  copy: {
    _: 'H',
    'z1': '#{path}',
    'z2': '#{target}'
  },

  download_file: {
    _: 'F',
    'z1': '#{path}'
  },

  upload_file: {
    _: 'U',
    'z1': '#{path}',
    'z2': '#{hex::content}'
  },

  rename: {
    _: 'I',
    'z1': '#{path}',
    'z2': '#{name}'
  },

  retime: {
    _: 'K',
    'z1': '#{path}',
    'z2': '#{time}'
  },

  mkdir: {
    _: 'J',
    'z1': '#{path}'
  },

  wget: {
    _: 'L',
    'z1': '#{url}',
    'z2': '#{path}'
  }
})
