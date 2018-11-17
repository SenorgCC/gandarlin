<?php
include('../../../connect.php');
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$ID = $_POST['ID'];
$data=array($ID);
$stmt="select name from spieler.namen where id = $1;";
$result = pg_prepare($dbconn,"spielernamen",$stmt);
$result=pg_execute($dbconn,"spielernamen",$data);
$name=pg_fetch_object($result);
print json_encode($name);
pg_close($dbconn);
?>
