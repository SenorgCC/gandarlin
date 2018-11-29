<?php
include('../../../connect.php');
$SP_ID = $_POST['SP_ID'];
$WP_ID=$_POST['WP_ID'];
$WNAME=$_POST['WNAME'];
$RWERT=$_POST['RWERT'];
$MOD=$_POST["MOD"];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($WNAME,$RWERT,$MOD,$WP_ID,$SP_ID);

$stmt="UPDATE spieler.ruestung SET  name_beschreibung= $1,";
$stmt.="ruestungswert= $2,";
$stmt.="ausruestungsmodifikation= $3";
$stmt.=" where ID = $4 and sp_id=$5;";
$result = pg_prepare($dbconn,"fernkampf",$stmt);
$result=pg_execute($dbconn,"fernkampf",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
