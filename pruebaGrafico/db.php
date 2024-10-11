<?php
$servername = "localhost";
$username = "root"; // Cambia según tu configuración
$password = ""; // Cambia según tu configuración
$dbname = "graficos"; // Cambia por el nombre de tu base de datos


/* $servername = "db-mysql-dev.unap.cl"
$username = "yandrades"
$password = "4f.P3v=37qKP"
$dbname = "UNAP" */

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>

