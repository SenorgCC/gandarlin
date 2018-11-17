<?php
include('../../../connect.php');
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$ID = $_POST['ID'];
$data=array($ID);
$stmt="select * from basiswerte.modifikation where id=$1";
$result = pg_prepare($dbconn,"bwmod",$stmt);
$result=pg_execute($dbconn,"bwmod",$data);
print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
