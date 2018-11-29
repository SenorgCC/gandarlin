<?php
include('../../../connect.php');
$SP_ID = $_POST['SP_ID'];
$WP_ID=$_POST['WP_ID'];
$WNAME=$_POST['WNAME'];
$WAFRT=$_POST['WAFRT'];
$WAFEXO=$_POST['WAFEXO'];
$BESCH=$_POST['BESCH'];
$WUESCHADEN=$_POST['WUESCHADEN'];
$ZSCHADEN=$_POST['ZSCHADEN'];
$ATBONUS=$_POST['ATBONUS'];
$PABONUS=$_POST['PABONUS'];
$WARTNAME=$_POST['WARTNAME'];

$data=array($BESCH,$WUESCHADEN,$ZSCHADEN,$ATBONUS,$PABONUS,$WP_ID,$SP_ID);
$stmt="UPDATE spieler.waffen set";
$stmt+=" beschreibung = \\\'$1\\\',";
$stmt+=" schaden_wuerfel = \\\'$2\\\',";
$stmt+=" schaden = $3,";
$stmt+=" attackebonus = $4,";
$stmt+=" paradebonus = $5";
$stmt+=" where id = $6 and sp_id = $7;";
$result=pg_prepare($dbconn,"upspwaffe",$stmt);
$result=pg_execute($dbconn,"upspwaffe",$data);

$data3=array($WNAME,$WARTNAME,$WAFRT,$WAFEXO,$WP_ID);
$stmt3="update spieler.waffenart set";
$stmt3+=" name = \\\'$1\\\',";
$stmt3+=" art = \\\'$2\\\',";
$stmt3+=" art_id = $3,";
$stmt3+=" exotisch = \\\'$4\\\'";
$stmt3+=" where id =$5;";
$result=pg_prepare($dbconn,"uptspwart",$stmt3);
$result=pg_execute($dbconn,"uptspwart",$data3);

print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
