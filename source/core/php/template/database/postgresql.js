/**
 * 数据库管理模板::postgresql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $arr=array(
        'host'=>explode(':',$hst)[0],
        'port'=>explode(':',$hst)[1],
        'user'=>$usr,
        'password'=>$pwd,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT datname FROM pg_database where datistemplate='f';");
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            echo(trim($rs[0]).chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
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
      $arr=array(
        'host'=>explode(':',$hst)[0],
        'port'=>explode(':',$hst)[1],
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');");
        if(!q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            echo(trim($rs[0]).chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
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
      $arr=array(
        'host'=>explode(':',$hst)[0],
        'port'=>explode(':',$hst)[1],
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT column_name,udt_name,character_maximum_length FROM information_schema. COLUMNS WHERE TABLE_NAME = '{$tab}';");
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            $len=$rs[2]?$rs[2]:"0";
            echo(trim($rs[0])." ({$rs[1]}({$len}))".chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
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
      $encode=$m?stripslashes($_POST["${arg6}"]):$_POST["${arg6}"];
      $arr=array(
        'host'=>explode(':',$hst)[0],
        'port'=>explode(':',$hst)[1],
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
      }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T, $sql);
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          $n=@pg_num_fields($q);
          if($n===NULL){
            echo("Status\t|\t\r\n");
            echo(base64_encode("ERROR://".@pg_last_error())."\t|\t\r\n");
          }elseif($n===0){
            echo("Affect Rows\t|\t\r\n".base64_encode(@pg_affected_rows($q))."\t|\t\r\n");
          }else{
            for($i=0;$i<$n;$i++){
              echo(@pg_field_name($q,$i)."\t|\t");
            }
            echo "\r\n";
            while($row=@pg_fetch_row($q)){
              for($i=0;$i<$n;$i++){
                echo(base64_encode($row[$i]!==NULL?$row[$i]:"NULL")."\t|\t");
              }
              echo "\r\n";
            }
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})