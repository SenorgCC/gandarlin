<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$KL = $_POST['KL'];
$GEW = $_POST['GEW'];
$GSK = $_POST['GSK'];
$CHA = $_POST['CHA'];
$MUT = $_POST['MUT'];
$KON = $_POST['KON'];
$KK = $_POST['KK'];
$INT = $_POST['INT'];
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
$result = pg_prepare($dbconn,"basiswert",'UPDATE basiswerte.modifikation SET kl = $2, gew= $3, gsk= $4, cha= $5, mut= $6, kon= $7, kk= $8, int= $9 where ID = $1');
$result=pg_execute($dbconn,"basiswert",array($ID,$KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT));

print json_encode($result);
pg_close($dbconn);
?>
