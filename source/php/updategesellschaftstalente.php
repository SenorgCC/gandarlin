<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$FEI=$_POST['FEI'];
$UEB=$_POST['UEB'];
$BET=$_POST['BET'];
$ETI=$_POST['ETI'];
$MEN=$_POST['MEN'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($FEI,$UEB,$BET,$ETI,$MEN,$ID);

$stmt="UPDATE gesellschaftstalente.modifikation SET feilschen = $1,";
$stmt.="ueberreden= $2,";
$stmt.="betoeren= $3,";
$stmt.="etikette= $4,";
$stmt.="menschenkenntnis= $5";
$stmt.=" where ID = $6;";
$result = pg_prepare($dbconn,"naturtalente",$stmt);
$result=pg_execute($dbconn,"naturtalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
