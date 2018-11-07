<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$MOD=$_POST['INPUTARRAY'];
$Name=$_POST['NAMEARRAY'];
//$stmt="UPDATE spieler.ruestung  SET reiten = $1,";
for ($i=0; $i < count($MOD) ; $i++) {
  $stmt="UPDATE spieler.ruestung set ausruestungsmodifikation= $1 where name_beschreibung=$2 and id=$3;";
  $data=array($MOD[i],$Name[i],$ID);
  $result = pg_prepare($dbconn,"ruestung",$stmt);
  $result=pg_execute($dbconn,"ruestung",$data);
}
pg_close($dbconn);
?>
