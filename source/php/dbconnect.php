<?
$dbconn = pg_connect ("dbname=gandarlin") or die("Konnte keine Verbindung aufbauen");
$stat = pg_connection_status($dbconn);
if ($stat === PGSQL_CONNECTION_OK) {
    echo 'Verbindungsstatus ok';
} else {
    echo 'Verbindungsstatus bad';
}
?>
