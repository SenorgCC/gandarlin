<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$ZWS=$_POST['ZWS'];
$AEX=$_POST['AEX'];
$KOL=$_POST['KOL'];
$STA=$_POST['STA'];
$SGN=$_POST['SGN'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($ZWS,$AEX,$KOL,$STA,$SGN,$ID);

$stmt="UPDATE zweihandwaffen.modifikation SET schwerter = $1,";
$stmt.="aexte= $2,";
$stmt.="kolben= $3,";
$stmt.="staeb= $4,";
$stmt.="stangenwaffen= $5";
$stmt.=" where ID = $6;";
$result = pg_prepare($dbconn,"zweihandwaffen",$stmt);
$result=pg_execute($dbconn,"zweihandwaffen",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
