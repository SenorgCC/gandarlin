<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$HEI=$_POST['HEI'];
$GIF=$_POST['GIF'];
$SCH=$_POST['SCH'];
$MAG=$_POST['MAG'];
$GAS=$_POST['GAS'];
$WEL=$_POST['WEL'];
$SPR=$_POST['SPR'];
$ANA=$_POST['ANA'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($HEI,$GIF,$SCH,$MAG,$GAS,$WEL,$SPR,$ANA,$ID);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="UPDATE wissenstalente.modifikation SET heilung = $1,";
$stmt.="gifte= $2,";
$stmt.="schriften= $3,";
$stmt.="magie= $4,";
$stmt.="gassenwissen= $5,";
$stmt.="weltenkenntnis= $6,";
$stmt.="sprachen= $7,";
$stmt.="anatomie= $8";
$stmt.=" where ID = $9;";
$result = pg_prepare($dbconn,"wissenstalente",$stmt);
$result=pg_execute($dbconn,"wissenstalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
