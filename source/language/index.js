/**
 * 中国蚁剑::语言模板
 */
'use strict';

const languages = {
  'en': 'English',
  'zh': '简体中文'
}

// 获取本地设置语言（如若没有，则获取浏览器语言
let lang = antSword['storage']('language',
  false,
  navigator.language.substr(0,2)
);

// 判断本地设置语言是否符合语言模板
lang = languages[lang] ? lang : 'en';

// 返回语言模板
let langModule = require(`./${lang}`);
langModule.__languages__ = languages;

module.exports = langModule;
