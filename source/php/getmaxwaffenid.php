<?php
include('../../../connect.php');
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$data=array($ID);
$stmt="select max(id) as id from spieler.waffen ;";
$result = pg_prepare($dbconn,"spielerwaffen",$stmt);
$result=pg_execute($dbconn,"spielerwaffen",$data);
$name=pg_fetch_object($result);
print json_encode($name);
pg_close($dbconn);
?>
