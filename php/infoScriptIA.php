<?php
$output = null;
$retval = null;

$command = escapeshellcmd('python3 fonction2.py monModele mesDonnees');

exec($command, $output, $retval);

?>
