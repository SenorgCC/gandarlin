<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$SCH=$_POST['SCH'];
$LED=$_POST['LED'];
$HOL=$_POST['HOL'];
$KOC=$_POST['KOC'];
$LEH=$_POST['LEH'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($SCH,$LED,$HOL,$KOC,$LEH,$ID);

$stmt="UPDATE handwerkstalente.modifikation SET schmieden = $1,";
$stmt.="Lederverarbeitung= $2,";
$stmt.="holzverarbeitung= $3,";
$stmt.="Koch= $4,";
$stmt.="lehren= $5";
$stmt.=" where ID = $6;";
$result = pg_prepare($dbconn,"handwerkstalente",$stmt);
$result=pg_execute($dbconn,"handwerkstalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
