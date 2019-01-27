<?php
include('../../../connect.php');
ini_set('display_errors', 1);
$ID = $_POST['ID'];
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt1="select Schleichen, Aufmerksamkeit, Robustheit, Willenskraft, ";
$stmt1.="Fingerfertigkeit,Zechen,Taschendiebstahl";
$stmt1.="from koerpertalente.talentwert where ID = $1";
$result=pg_prepare($dbconn,"normalwerte",$stmt1);
$result=pg_execute($dbconn,"normalwerte",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row1=pg_fetch_object($result);

//$stmt="select * from sekundaerwerte.aktuell where ID = $1";

$stmt2="select Schleichen, Aufmerksamkeit, Robustheit, Willenskraft, "
$stmt2.="Fingerfertigkeit,Zechen,Taschendiebstahl"
$stmt2.="from koerpertalente.modifikation where ID = $1"
$result=pg_prepare($dbconn,"mod",$stmt2);
$result=pg_execute($dbconn,"mod",array($ID));
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$row2=pg_fetch_object($result);

$erg_array = array($row1,$row2);

print json_encode($erg_array);
pg_close($dbconn);
?>
