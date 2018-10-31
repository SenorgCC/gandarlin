<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$GAS=$_POST['SCH'];
$WEL=$_POST['BEI'];
$SPR=$_POST['FLE'];
$ANA=$_POST['DOL'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($SCH,$BEI,$FLE,$DOL,$ID);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="UPDATE einhandwaffen.modifikation SET schwerter = $1,";
$stmt.="Beile= $2,";
$stmt.="flegel= $3,";
$stmt.="dolche= $4";
$stmt.=" where ID = $5;";
$result = pg_prepare($dbconn,"einhandwaffen",$stmt);
$result=pg_execute($dbconn,"einhandwaffen",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
