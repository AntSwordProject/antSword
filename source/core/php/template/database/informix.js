/**
 * 数据库管理模板::informix
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT username FROM SYSUSERS WHERE usertype='D' ORDER BY username",$T);echo("informix".chr(9));while($rs=@ifx_fetch_row($q)){echo(trim($rs[username]).chr(9));}@ifx_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT tabname FROM systables where owner='{$dbn}' and tabtype='T' ORDER BY tabname",$T);while($rs=@ifx_fetch_row($q)){echo(trim($rs[tabname]).chr(9));}@ifx_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}'
  },
  // 显示表字段
  show_columns: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query("SELECT tabname FROM systables where owner='{$dbn}' and tabtype='T' ORDER BY tabname",$T);while($rs=@ifx_fetch_row($q)){echo(trim($rs[tabname]).chr(9));}@ifx_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{table}'
  },
  // 执行SQL语句
  query: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$sql=base64_decode($_POST["${arg5}"]);$T=(strlen($usr)>0)?@ifx_connect($hst,$usr,$pwd):@ifx_connect($hst);$q=@ifx_query($sql,$T);$i=0;while($rs=@ifx_fetch_row($q)){if($i==0){for(reset($rs);$f=key($rs);next($rs)){echo($f."\t|\t");}echo("\r\n");}for(reset($rs);$f=key($rs);next($rs)){echo(base64_encode(trim($rs[$f])));echo("\t|\t");}echo("\r\n");$i++;}@ifx_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}'
  }
})
