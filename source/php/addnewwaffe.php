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
$KKBONUS=$_POST['KKBONUS'];
$WARTNAME=$_POST['WARTNAME'];

$data=array($WP_ID,$SP_ID,$WAFRT,$BESCH,$WUESCHADEN,$ZSCHADEN,$KKBONUS,$ATBONUS,$PABONUS);
$stmt="insert into spieler.waffen values($1,$2,$3,$4,$5,$6,$7,$8,$9)";
$result = pg_prepare($dbconn,"spielerwaffe",$stmt);
$result=pg_execute($dbconn,"spielerwaffe",$data);

$stmt2="insert into spieler.waffen_kampftalent values($1,$2,$3,$4,$5)";
$data2=array($WP_ID,$SP_ID,$WAFRT,0,0);
$result=pg_prepare($dbconn,"spielerwaffenkt",$stmt2);
$result=pg_execute($dbconn,"spielerwaffenkt",$data2);

$stmt3="insert into spieler.waffenart values($1,$2,$3,$4,$5)";
$data3=array($WP_ID,$WNAME,$WAFRT,$WARTNAME,$WAFEXO);
$result=pg_prepare($dbconn,"spielerwaffart",$stmt3);
$result=pg_execute($dbconn,"spielerwaffart",$data3);

print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
