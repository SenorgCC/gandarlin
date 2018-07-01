<?php
include('../../../connect.php');
$ID = $_POST['ID'];
//$stmt="select * from einhandwaffen.basis union all select * from einhandwaffen.modifikation union all select * from einhandwaffen.final";
//$stmt="select * from einhandwaffen.basis where ID = $1";
$result = pg_prepare($dbconn,"basiswert",'select * from einhandwaffen.basis where ID = $1');
$result=pg_execute($dbconn,"basiswert",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from einhandwaffen.modifikation where ID = $1";
$result = pg_prepare($dbconn,"mod",'select * from einhandwaffen.modifikation where ID = $1');
$result=pg_execute($dbconn,"mod",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

//
//$stmt="select * from einhandwaffen.final where ID = $1";
$result = pg_prepare($dbconn,"final",'select * from einhandwaffen.final where ID = $1');
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
