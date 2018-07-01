<?php
include('../../../connect.php');
$ID = $_POST['ID'];
//$stmt="select * from fernkampf.basis union all select * from fernkampf.modifikation union all select * from fernkampf.final";
//$stmt="select * from fernkampf.basis where ID = $1";
$result = pg_prepare($dbconn,"basiswert",'select * from fernkampf.talentwert where ID = $1');
$result=pg_execute($dbconn,"basiswert",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from fernkampf.modifikation where ID = $1";
$result = pg_prepare($dbconn,"mod",'select * from fernkampf.modifikation where ID = $1');
$result=pg_execute($dbconn,"mod",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

//
//$stmt="select * from fernkampf.final where ID = $1";
$result = pg_prepare($dbconn,"final",'select * from fernkampf.final where ID = $1');
$result=pg_execute($dbconn,"final",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row3=pg_fetch_object($result);

$erg_array = array($row1,$row2,$row3);

print json_encode($erg_array);
pg_close($dbconn);
?>
