<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$erg_array = array();
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt="select * from spieler.waffen a";
$stmt.=" inner join spieler.waffen_final b on (a.id = b.waffen_id)";
$stmt.=" inner join spieler.waffenart c on (a.id = c.id)";
$stmt.=" where b.sp_id = $1 order by a.id";
$result=pg_prepare($dbconn,"normalwerte",$stmt);
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
