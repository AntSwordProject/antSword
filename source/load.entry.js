/**
 * 中国蚁剑::前端加载模块
 * 开写: 2016/04/23
 * 更新: 2016/05/10
 * 作者: 蚁逅 <https://github.com/antoor>
 */

'use strict';

// 添加源码目录到全局模块加载变量，以提供后边加载
const path = require('path');
const Module = require('module').Module;
const {remote} = require('electron');
Module.globalPaths.push(path.join(remote.process.env.AS_WORKDIR, 'source'));

// 开始加载时间
let APP_START_TIME = +new Date;

window.addEventListener('load', () => {
  /**
   * 时间格式化函数
   * @param  {String} format 格式化字符串，如yyyy/mm/dd hh:ii:ss
   * @return {String}        格式化完毕的字符串
   */
  Date.prototype.format = function(format) {
    let o = {
      "M+" : this.getMonth()+1,
      "d+" : this.getDate(),
      "h+" : this.getHours(),
      "m+" : this.getMinutes(),
      "s+" : this.getSeconds(),
      "q+" : Math.floor((this.getMonth()+3)/3),
      "S" : this.getMilliseconds()
    }
    if(/(y+)/.test(format)) {
      format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4- RegExp.$1.length))
    };
    for(let k in o) {
      if(new RegExp("("+ k +")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      }
    }
    return format;
  }


  /**
   * 加载JS函数
   * @param  {String}   js js地址
   * @return {Promise}     返回Promise操作对象
   */
  function loadJS(js) {
    return new Promise((res, rej) => {
      let script = document.createElement('script');
      script.src = js;
      script.onload = res;
      document.head.appendChild(script);
    });
  }

  /**
   * 加载CSS函数
   * @param  {String}   css css地址
   * @return {Promise}      返回Promise操作对象
   */
  function loadCSS(css) {
    return new Promise((res, rej) => {
      let style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = css;
      style.onload = res;
      document.head.appendChild(style);
    });
  }

  // 开始加载css
  loadCSS('ant-static://libs/bmenu/bmenu.css')
    .then(() => loadCSS('ant-static://libs/toastr/toastr.min.css'))
    .then(() => loadCSS('ant-static://libs/layer/src/skin/layer.css'))
    .then(() => loadCSS('ant-static://libs/layer/src/skin/layer.ext.css'))
    .then(() => loadCSS('ant-static://libs/laydate/need/laydate.css'))
    .then(() => loadCSS('ant-static://libs/laydate/skins/default/laydate.css'))
    .then(() => loadCSS('ant-static://libs/terminal/css/jquery.terminal-1.1.1.css'))
    .then(() => loadCSS('ant-static://libs/font-awesome/css/font-awesome.min.css'))
    .then(() => loadCSS('ant-static://libs/dhtmlx/codebase/dhtmlx.css'))
    .then(() => loadCSS('ant-static://libs/dhtmlx/skins/mytheme/dhtmlx.css'))
    .then(() => loadCSS('ant-static://css/index.css'));

  // 加载js资源
  loadJS('ant-static://libs/jquery/jquery.js')
    .then(() => loadJS('ant-static://libs/ace/ace.js'))
    .then(() => loadJS('ant-static://libs/ace/ext-language_tools.js'))
    .then(() => loadJS('ant-static://libs/bmenu/bmenu.js'))
    .then(() => loadJS('ant-static://libs/toastr/toastr.js'))
    .then(() => loadJS('ant-static://libs/layer/src/layer.js'))
    .then(() => loadJS('ant-static://libs/laydate/laydate.js'))
    .then(() => loadJS('ant-static://libs/terminal/js/jquery.terminal-min-1.1.1.js'))
    .then(() => loadJS('ant-static://libs/dhtmlx/codebase/dhtmlx.js'))
    .then(() => {
      /**
       * 配置layer弹出层
       * @param  {[type]} {extend: 'extend/layer.ext.js'} [description]
       * @return {[type]}          [description]
       */
      layer.config({extend: 'extend/layer.ext.js'});
      // 加载程序入口
      require('app.entry');
      // LOGO
      console.group('LOGO');
      console.log(
  `%c
          _____     _   _____                 _
         |  _  |___| |_|   __|_ _ _ ___ ___ _| |
         |     |   |  _|__   | | | | . |  _| . |
         |__|__|_|_|_| |_____|_____|___|_| |___|%c

     ->| Ver: %c${antSword.package.version}%c
   -+=>| Git: %c${antSword.package.repository['url']}%c
     -*| End: %c${+new Date - APP_START_TIME}%c/ms

  `,
      'color: #F44336;', 'color: #9E9E9E;',
      'color: #4CAF50;', 'color: #9E9E9E;',
      'color: #2196F3;', 'color: #9E9E9E;',
      'color: #FF9800;', 'color: #9E9E9E;'
      );
      APP_START_TIME = null;
      console.groupEnd();
    });
});
