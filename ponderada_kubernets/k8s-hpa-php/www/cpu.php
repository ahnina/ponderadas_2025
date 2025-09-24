<?php
$duration = isset($_GET['t']) ? intval($_GET['t']) : 2;
$end = microtime(true) + $duration;
while (microtime(true) < $end) {
    // Trabalho pesado de CPU
    $x = sha1(mt_rand());
}
echo "CPU load gerado por {$duration} segundos\n";
