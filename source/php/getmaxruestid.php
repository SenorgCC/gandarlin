<?php
include('../../../connect.php');
//$stmt="select * from basiswerte.basis union all select * from basiswerte.modifikation union all select * from basiswerte.final";
$stmt="select max(id)+1 as id from spieler.ruestung";
$result = pg_query($dbconn,$stmt);
while ($row = pg_fetch_row($result)) {
  $name=$row[0];
}
print json_encode($name);
pg_close($dbconn);
?>
