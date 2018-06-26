<?php
include('../../../connect.php');
ini_set('display_errors', 1);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt="select * from sekundaerwerte.normalwerte";
$result=pg_query($dbconn,$stmt);
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

$stmt="select * from sekundaerwerte.aktuell";
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$result=pg_query($dbconn,$stmt);
$row2=pg_fetch_object($result);

$erg_array = array($row1,$row2);

print json_encode($erg_array);
pg_close($dbconn);
?>
