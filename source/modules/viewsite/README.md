## 浏览网站模块
> 用于浏览目标站点，从而进行一些登陆操作（自动设置cookie等登陆信息    

## 实现思路

1. 打开一个浏览窗口，访问站点域名
2. 创建一个tabbar，用于管理cookie
3. 关闭浏览窗口，tabbar会随时刷新cookie的改动，然后显示到UI中
4. 保存cookie，关闭tabbar（将会把Cookie内容设置为请求的Header.Cookie
