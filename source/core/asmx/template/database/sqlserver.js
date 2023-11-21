/**
 * ASPX::sqlserver数据库驱动代码模板
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `var Conn=new ActiveXObject("Adodb.connection");
      Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::conn}")));
      var Rs=new ActiveXObject("ADODB.Recordset");
      Rs.Open("SELECT [name] FROM master.dbo.sysdatabases ORDER BY 1",Conn,1,1);
      while(!Rs.EOF && !Rs.BOF){
        Response.Write(Rs.Fields(0).Value+"\\t");
        Rs.MoveNext();
      }
      Rs.Close();
      Conn.Close();`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `var Conn=new ActiveXObject("Adodb.connection");
      Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::conn}")));
      var Rs=new ActiveXObject("ADODB.Recordset");
      Rs.Open("USE ["+"#{dbname}"+"];
      SELECT [name] FROM sysobjects WHERE (xtype=\'U\') ORDER BY 1",Conn,1,1);
      while(!Rs.EOF && !Rs.BOF){
        Response.Write(Rs.Fields(0).Value+"\\t");
        Rs.MoveNext();
      }
      Rs.Close();
      Conn.Close();`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `var Conn=new ActiveXObject("Adodb.connection");
      Conn.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::conn}")));
      var Rs=new ActiveXObject("ADODB.Recordset");
      Rs.Open(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::table}")),Conn,1,1);
      var CO:String="\\t";
      var i:Int32=Rs.Fields.Count,c:Int32;
      for(c=0;c<i;c++){
        Response.Write(Rs.Fields(c).Name+CO)
      }
      Rs.Close();
      Conn.Close();`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `var Conn=new ActiveXObject("Adodb.connection");
      var strSQL:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::sql}"));
      Conn.ConnectionString=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{base64::conn}"));
      Conn.ConnectionTimeout=10;
      Conn.Open();
      var CO:String="\\t|\\t",RN:String="\\r\\n",Dat:String;
      Conn.DefaultDatabase="#{dbname}";
      var Rs=Conn.Execute(strSQL);
      var i:Int32=Rs.Fields.Count,c:Int32;
      for(c=0;c<i;c++){
        Response.Write(Rs.Fields(c).Name+CO);
      }
      Response.Write(RN);
      while(!Rs.EOF && !Rs.BOF){
        for(c=0;c<i;c++){
          Dat=Rs.Fields(c).Value;
          Response.Write(Dat);
          Response.Write(CO);
        }
        Response.Write(RN);
        Rs.MoveNext();
      }
      Conn.Close();`.replace(/\n\s+/g, ''),
  }
})
