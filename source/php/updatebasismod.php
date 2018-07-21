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
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data_ar=array($ID);
$data=$data_ar;
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="UPDATE basiswerte.modifikation SET KL = 1, GEW= 2, GSK= 3, CHA= 4, mut= 5, kon= 6, kk= 7, int= 8 where ID = 1";
$result = pg_prepare($dbconn,"basiswert",$stmt);
$result=pg_execute($dbconn,"basiswert",$data);
pg_set_error_verbosity($dbconn, PGSQL_ERRORS_VERBOSE);
$res1 = pg_get_result($dbconn);
print json_encode(pg_result_error($res1));
pg_close($dbconn);
?>
