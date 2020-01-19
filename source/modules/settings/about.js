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
          <a href="https://github.com/AntSwordProject/AntSword"><i class="fa fa-github-alt"></i> GitHub</a> /
          <a href="http://doc.u0u.us"><i class="fa fa-book"></i> ${LANG['document']}</a> /
          <a href="https://discord.gg/Uzh5nUf"><i class="fa fa-comments"></i> ${LANG['discord']}</a> /
          <a href="https://forms.gle/HrUMxedsyREeXw4R9"><i class="fa fa-bug"></i> ${LANG['securityreport']}</a>
        </p>
        <div>
          <img src="ant-static://imgs/qrcode.jpg" style="width:100px;"/>
          <p style="color: #795548;transition: all .5s linear;font-size: 14px;">${LANG['wechat']}</p>
        </div>
      </div>
    `);

    // 在默认浏览器中打开链接
    $('.about').on('click', 'a', function (e) {
      e.preventDefault();
      antSword['shell'].openExternal(this.href);
    });
  }

}

module.exports = About;