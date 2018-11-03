<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$REI=$_POST['REI'];
$SCH=$_POST['SCH'];
$KLE=$_POST['KLE'];
$GAU=$_POST['GAU'];
$SEE=$_POST['SEE'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($REI,$SCH,$KLE,$GAU,$SEE,$ID);

$stmt="UPDATE spezialetalente.modifikation SET reiten = $1,";
$stmt.="schwimmen= $2,";
$stmt.="klettern= $3,";
$stmt.="gaukeleien= $4,";
$stmt.="seefahrt= $5";
$stmt.=" where ID = $6;";
$result = pg_prepare($dbconn,"spezialtalente",$stmt);
$result=pg_execute($dbconn,"spezialtalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
