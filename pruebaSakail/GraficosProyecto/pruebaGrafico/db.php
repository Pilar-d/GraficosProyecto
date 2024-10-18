<?php

$servername = "sakaionline.unap.cl";
$username = "sakail";
$password = "sakailIwija6iq2023/";
$dbname = "sakail";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>

