<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$SCH=$_POST['SCH'];
$EXO=$_POST['EXO'];
$UNB=$_POST['UNB'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($SCH,$EXO,$UNB,$ID);

$stmt="UPDATE anderekampftalente.modifikation SET schilde = $1,";
$stmt.="exotische_waffen= $2,";
$stmt.="unbewaffnet =$3"
$stmt.=" where ID = $4;";
$result = pg_prepare($dbconn,"exotische",$stmt);
$result=pg_execute($dbconn,"exotische",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
