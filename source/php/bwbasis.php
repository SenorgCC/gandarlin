<?php
include('../../../connect.php');
ini_set('display_errors', 1);
$ID = $_POST['ID'];
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
//$stmt="select * from basiswerte.basis where ID = $1";
$result = pq_prepare($dbconn,"basiswert",'select * from basiswerte.basis where ID = $1');
$result=pg_execute($dbconn,"basiswert",array("1"));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from basiswerte.modifikation where ID = $1";
$result = pq_prepare($dbconn,"mod",'select * from basiswerte.modifikation where ID = $1');
$result=pg_execute($dbconn,"mod",array("1"));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$result=pg_query($dbconn,$stmt);
$row2=pg_fetch_object($result);

//$stmt="select * from basiswerte.final where ID = $1";
$result = pq_prepare($dbconn,"final",'select * from basiswerte.final where ID = $1');
$result=pg_execute($dbconn,"final",array("1"));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$result=pg_query($dbconn,$stmt);
$row3=pg_fetch_object($result);
$erg_array = array($row1,$row2,$row3);

print json_encode($erg_array);
pg_close($dbconn);
?>
