<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$WPID=$_POST['WIDARRAY'];
$AT=$_POST['ATARRAY'];
$PA=$_POST['PAARRAY'];
//$stmt="UPDATE spieler.ruestung  SET reiten = $1,";
for ($i=0; $i < count($WPID); $i++) {
  $data=array($AT[$i],$PA[$i],$WPID[$i],$ID);
  $stmt="UPDATE spieler.waffen_kampftalent set kampftalent_attacke= $1,";
  $stmt.=" kampftalent_parade=$2"
  $stmt.=" where id=$3";
  $stmt.=" and sp_id=$4";
  $result = pg_prepare($dbconn,"UPDKT".$i,$stmt);
  $result=pg_execute($dbconn,"UPDKT".$i,$data);
}
pg_last_error();
pg_close($dbconn);
?>
