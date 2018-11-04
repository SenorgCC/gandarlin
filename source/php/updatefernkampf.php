<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$WUR=$_POST['WUR'];
$BOE=$_POST['BOE'];
$ARM=$_POST['ARM'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($WUR,$BOE,$ARM,$ID);

$stmt="UPDATE fernkampf.modifikation SET wurfwaffen = $1,";
$stmt.="boegen= $2,";
$stmt.="armbrueste= $3";
$stmt.=" where ID = $4;";
$result = pg_prepare($dbconn,"fernkampf",$stmt);
$result=pg_execute($dbconn,"fernkampf",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
