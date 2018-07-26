<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$SCHL=$_POST['SCHL'];
$AUF=$_POST['AUF'];
$ROB=$_POST['ROB'];
$FIN=$_POST['FIN'];
$ZEC=$_POST['ZEC'];
$TAS=$_POST['TAS'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($SCHL,$AUF,$ROB,$FIN,$ZEC,$TAS,$ID);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="UPDATE koerpertalente.modifikation SET schleichen = $1,";
$stmt.="aufmerksamkeit= $2,";
$stmt.="robustheit= $3,";
$stmt.="fingerfertigkeit= $4,";
$stmt.="zechen= $5,";
$stmt.="taschendiebstahl= $6,";
$stmt.=" where ID = $7;";
$result = pg_prepare($dbconn,"koerpertalente",$stmt);
$result=pg_execute($dbconn,"koerpertalente",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
