<?php
include('../../../connect.php');
//$ID = $_POST['ID'];
//$MOD=$_POST['INPUTARRAY'];
//$Name=$_POST['NAMEARRAY'];
//$stmt="UPDATE spieler.ruestung  SET reiten = $1,";
//for ($i=0; $i < 2 ; $i++) {

  $data=array(42,'Hakta',1);
  $stmt="UPDATE spieler.ruestung set ausruestungsmodifikation= $1";
  $stmt.="where name_beschreibung=$2";
  $stmt.="and id=$3";
  $result = pg_prepare($dbconn,"test",$stmt);
  $result=pg_execute($dbconn,"test",$data);
//}
pg_last_error();
pg_close($dbconn);
?>
