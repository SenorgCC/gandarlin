<?php
include('../../../connect.php');
ini_set('display_errors', 1);
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt="select * from basiswerte.basis";
$result=pg_query($dbconn,$stmt);
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row=pg_fetch_all($result);

print json_encode($row);
pg_close($dbconn);
?>
