/**
 * 数据库管理模板::postgresql_pdo
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $host=explode(':',$hst)[0];
      $port=explode(':',$hst)[1];
      $arr=array(
        'host'=>$host,
        'port'=>$port,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="select datname FROM pg_database where datistemplate='f';";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['datname']).chr(9));
        }
        $dbh=null;
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
      $host=explode(':',$hst)[0];
      $port=explode(':',$hst)[1];
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['table_name']).chr(9));
        }
        $dbh=null;
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
      $host=explode(':',$hst)[0];
      $port=explode(':',$hst)[1];
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="SELECT column_name,udt_name,character_maximum_length FROM information_schema.COLUMNS WHERE TABLE_NAME = '{$tab}';";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          $len=$res['character_maximum_length'] ? $res['character_maximum_length']:"0";
          echo(trim($res['column_name'])." ({$res['udt_name']}({$len}))".chr(9));
        }
        $dbh = null;
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
      $host=explode(':',$hst)[0];
      $port=explode(':',$hst)[1];
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $result=$dbh->prepare($sql);
        if(!$result->execute()){
          echo("Status\t|\t\r\n");
          $err="";
          foreach(@$result->errorInfo() as $v){
            $err.=$v." ";
          }
          echo(base64_encode("ERROR://".$err)."\t|\t\r\n");
        }else{
          $bool=True;
          while($res=$result->fetch(PDO::FETCH_ASSOC)){
            if($bool){
              foreach($res as $key=>$value){
                echo($key."\t|\t");
              }
              echo "\r\n";
              $bool=False;
            }
            foreach($res as $key=>$value){
              echo(base64_encode($value!==NULL?$value:"NULL")."\t|\t");
            }
            echo "\r\n";
          }
          if($bool){
            if(!$result->columnCount()){
              echo("Affect Rows\t|\t\r\n".base64_encode($result->rowCount())."\t|\t\r\n");
            }else{
              echo("Status\t|\t\r\n");
              echo(base64_encode("ERROR://Table is empty.")."\t|\t\r\n");
            }
          }
        }
        $dbh = null;
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})