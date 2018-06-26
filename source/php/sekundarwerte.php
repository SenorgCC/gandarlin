<?php
include('../../../connect.php');
ini_set('display_errors', 1);
$ID = $_POST['ID'];
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$result=pg_prepare($dbconn,"normalwerte",'select * from sekundaerwerte.normalwerte where ID = $1');
$result=pg_execute($dbconn,"normalwerte",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

$stmt="select * from sekundaerwerte.aktuell where ID = $1";
$result=pg_prepare($dbconn,"aktuell",'select * from sekundaerwerte.aktuell where ID = $1');
$result=pg_execute($dbconn,"aktuell",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

$erg_array = array($row1,$row2);

print json_encode($erg_array);
pg_close($dbconn);
?>
