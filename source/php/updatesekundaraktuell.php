<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$HP=$_POST['HP'];
$AUSD=$_POST['AUSD'];
$EE=$_POST['EE'];
$AUSW=$_POST['AUSW'];
$RUE=$_POST['RUE'];
$INIT=$_POST['INIT'];
$ATKB=$_POST['ATKB'];
$PAB=$_POST['PAB'];
$LR=$_POST['LR'];
$WR=$_POST['WR'];
$ER=$_POST['ER'];
$LEBR=$_POST['LEBR'];
$FR=$_POST['FR'];
$EISR=$_POST['EISR'];
$MR=$_POST['MR'];
$DTR=$_POST['DTR'];
//$data_ar=array($KL,$GEW,$GSK,$CHA,$MUT,$KON,$KK,$INT,$ID);
$data=array($HP,$AUSD,$EE,$AUSW,$RUE,$INIT,$LR,$WR,$ER,$LEBR,$FR,$EISR,$MR,$DTR,$ATKB,$PAB,$ID);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
//$stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2, GSK= $3, CHA= $4, mut= $5, kon= $6, kk= $7, int= $8 where ID = $9";
$stmt="UPDATE sekundarwerte.aktuell SET lebenspunkte = $1,
              ausdauer= $2,
              ee= $3,
              ausweichen= $4,
              ruestung = $5,
              initiative= $6,
              luftresistenz= $7,
              wasserresistenz= $8,
              erdresistenz =$9,
              das_lebenderesistenz =$10,
              feuerresistenz = $11,
              eisresistenz= $12,
              metallresistenz = $13,
              das_toteresistenz =$14,
              attacke_basis =$15,
              parade_basis = 16
              where ID = $17;";
$result = pg_prepare($dbconn,"sekundaraktuell",$stmt);
$result=pg_execute($dbconn,"sekundaraktuell",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
