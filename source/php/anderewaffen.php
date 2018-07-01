<?php
include('../../../connect.php');
$ID = $_POST['ID'];
//$stmt="select * from anderekampftalente.basis union all select * from anderekampftalente.modifikation union all select * from anderekampftalente.final";
//$stmt="select * from anderekampftalente.basis where ID = $1";
$result = pg_prepare($dbconn,"basiswert",'select * from anderekampftalente.talentwert where ID = $1');
$result=pg_execute($dbconn,"basiswert",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from anderekampftalente.modifikation where ID = $1";
$result = pg_prepare($dbconn,"mod",'select * from anderekampftalente.modifikation where ID = $1');
$result=pg_execute($dbconn,"mod",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

//
//$stmt="select * from anderekampftalente.final where ID = $1";
$result = pg_prepare($dbconn,"final",'select * from anderekampftalente.final where ID = $1');
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
