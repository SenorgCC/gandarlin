<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$KRA=$_POST['KRA'];
$GEO=$_POST['GEO'];
$UEB=$_POST['UEB'];
$ORI=$_POST['ORI'];
$FAE=$_POST['FAE'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($KRA,$GEO,$UEB,$ORI,$FAE,$ID);

$stmt="UPDATE naturtalente.modifikation SET kraeuterkunde = $1,";
$stmt.="geographie= $2,";
$stmt.="ueberleben= $3,";
$stmt.="orientierung= $4,";
$stmt.="faehrtenlesen= $5";
$stmt.=" where ID = $6;";
$result = pg_prepare($dbconn,"naturtalente",$stmt);
$result=pg_execute($dbconn,"naturtalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
