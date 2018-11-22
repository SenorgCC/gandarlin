<?php
include('../../../connect.php');
$ID = $_POST['ID'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($ID);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="update sekundaerwerte.aktuell set (id,lebenspunkte,ausdauer,ee,";
$stmt.="ausweichen,ruestung,initiative,luftresistenz,wasserresistenz,";
$stmt.="erdresistenz,das_lebenderesistenz,feuerresistenz,eisresistenz,";
$stmt.="metallresistenz,das_toteresistenz,attacke_basis,parade_basis) ";
$stmt.=" =(select * from sekundaerwerte.normalwerte where id = $1) ";
$stmt.="where id =$1;";
$result = pg_prepare($dbconn,"fullreset",$stmt);
$result=pg_execute($dbconn,"fullrest",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
