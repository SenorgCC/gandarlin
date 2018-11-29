<?php
include('../../../connect.php');
$SP_ID = $_POST['SP_ID'];
$ID=$_POST["ID"];
$RUESW=$_POST["RUESW"];
$MOD=$_POST["MOD"];
$RUESN=$_POST["RUESN"];

$data=array($ID,$SP_ID,$RUESN,$RUESW,$MOD);
$stmt="insert into spieler.ruestung values($1,$2,$3,$4)";
$result = pg_prepare($dbconn,"addrues",$stmt);
$result=pg_execute($dbconn,"addrues",$data);

print json_encode(pg_result_error($result));
pg_close($dbconn);
?>
