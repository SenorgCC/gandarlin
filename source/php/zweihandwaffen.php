<?php
include('../../../connect.php');
$ID = $_POST['ID'];
//$stmt="select * from zweihandwaffen.basis union all select * from zweihandwaffen.modifikation union all select * from zweihandwaffen.final";
//$stmt="select * from zweihandwaffen.basis where ID = $1";
$result = pg_prepare($dbconn,"basiswert",'select * from zweihandwaffen.talentwert where ID = $1');
$result=pg_execute($dbconn,"basiswert",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from zweihandwaffen.modifikation where ID = $1";
$result = pg_prepare($dbconn,"mod",'select * from zweihandwaffen.modifikation where ID = $1');
$result=pg_execute($dbconn,"mod",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

//
//$stmt="select * from zweihandwaffen.final where ID = $1";
$result = pg_prepare($dbconn,"final",'select * from zweihandwaffen.final where ID = $1');
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
