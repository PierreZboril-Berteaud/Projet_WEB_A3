<?php
$output = null;
$retval = null;

$command = escapeshellcmd('python3 main_fonc_2.py monModele mesDonnees');

exec($command, $output, $retval);

?>
