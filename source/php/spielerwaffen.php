<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$erg_array = array();
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$result=pg_prepare($dbconn,"normalwerte",'select * from spieler.waffen a, spieler.waffen_final b where a.id = b.waffen_id and b.sp_id = $1');
$result=pg_execute($dbconn,"normalwerte",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
//$row1=pg_fetch_all($result);
while ($row = pg_fetch_assoc($result)){
  array_push($erg_array,$row);
}
//$erg_array = array($row1);

print json_encode($erg_array);
pg_close($dbconn);
?>