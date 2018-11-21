<?php
include('../../../connect.php');
$ID = $_POST['ID'];
$erg_array = array();
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt= "select beschreibung,b.kampftalent_attacke,b.kampftalent_parade,a.id";
$stmt.= " from spieler.waffen a inner join spieler.waffen_kampftalent b" ;
$stmt.=" on (a.id = b.id) where a.sp_id =$1;";
$result=pg_prepare($dbconn,"spielerwaffenkampftalent",$stmt);
$result=pg_execute($dbconn,"spielerwaffenkampftalent",array($ID));
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
