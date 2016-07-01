/**
 * 设置中心::关于
 */

const LANG = antSword['language']['settings']['about'];

class About {

  constructor(sidebar) {
    sidebar.addItem({
      id: 'about',
      selected: true,
      text: `<i class="fa fa-heart-o"></i> ${LANG['title']}`
    });
    const cell = sidebar.cells('about');
    cell.attachHTMLString(`
      <div align="center" class="about">
        <img src="ant-static://imgs/logo.png" />
        <hr/>
        <h2>${LANG['header']}<span> v${antSword['package']['version']}</span></h2>
        <p>
          <a href="https://github.com/antoor/antSword"><i class="fa fa-github-alt"></i> GitHub</a> /
          <a href="http://uyu.us"><i class="fa fa-home"></i> ${LANG['homepage']}</a> /
          <a href="http://doc.uyu.us"><i class="fa fa-book"></i> ${LANG['document']}</a> /
          <a href="http://shang.qq.com/wpa/qunwpa?idkey=51997458a52d534454fd15e901648bf1f2ed799fde954822a595d6794eadc521"><i class="fa fa-qq"></i> ${LANG['qqgroup']}</a>
        </p>
      </div>
    `);

    // 在默认浏览器中打开链接
    $('.about').on('click', 'a', function(e) {
      e.preventDefault();
      antSword['shell'].openExternal(this.href);
    });
  }

}

module.exports = About;
