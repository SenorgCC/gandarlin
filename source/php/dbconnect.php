<?php
include('../../../connect.php');
ini_set('display_errors', 1);
$stmt="select * from basiswerte.final";
$result=pg_query($dbconn,$stmt);
if (!$result){
    echo "Es ist ein Fehler aufgetreten\n";
    exit;
}
$rows = array();
while ($row=pg_fetch_all($result)){
  $rows[]=$row;
}
print json_encode($rows);
pg_close($dbconn);
?>
