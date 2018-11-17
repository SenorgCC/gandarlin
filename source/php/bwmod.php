<?php
include('../../../connect.php');
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$ID = $_POST['ID'];
$data=array($ID);
$stmt="select * from basiswerte.modifikation where id=$1";
$result = pg_prepare($dbconn,"bwmod",$stmt);
$result=pg_execute($dbconn,"bwmod",$data);
$bw=pg_fetch_object($result);
print json_encode($bw);
pg_close($dbconn);
?>
