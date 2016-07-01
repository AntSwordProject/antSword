# 更新日志
> 有空会补补BUG、添添新功能。    
> 同时也欢迎大家的参与！感谢各位朋友的支持！ .TAT.

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
