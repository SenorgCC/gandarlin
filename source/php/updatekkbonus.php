<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$KKB=$_POST['KKB'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($KKB,$ID);

$stmt="UPDATE spieler.waffen SET kk_bonus = $1";
$stmt.=" where sp_id = $2;";
$result = pg_prepare($dbconn,"updatekk",$stmt);
$result=pg_execute($dbconn,"updatekk",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
