<?php
ini_set('display_errors', 1);
$dbconn = pg_connect ("host=localhost port=5432 dbname=gandarlin user=readonly password='readuser'") or die("Konnte keine Verbindung aufbauen");
$stat = pg_connection_status($dbconn);
if ($stat === PGSQL_CONNECTION_OK) {
    echo 'Verbindungsstatus ok';
} else {
    echo 'Verbindungsstatus bad';
}
$response="1";
echo "Test11";
?>
