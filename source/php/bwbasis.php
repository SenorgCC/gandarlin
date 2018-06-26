<?php
include('../../../connect.php');
ini_set('display_errors', 1);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$erg_array[];
$stmt="select * from basiswerte.basis";
$result=pg_query($dbconn,$stmt);
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row=pg_fetch_all($result);
array_push($erg_array,$row);

$stmt="select * from basiswerte.modifikation";
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$result=pg_query($dbconn,$stmt);
$row=pg_fetch_all($result);
array_push($erg_array,$row);

$stmt="select * from basiswerte.final";
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$result=pg_query($dbconn,$stmt);
$row=pg_fetch_all($result);
array_push($erg_array,$row);

print json_encode($row);
pg_close($dbconn);
?>
