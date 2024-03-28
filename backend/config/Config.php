<?php

function obtenerConexion() {
    $host = 'localhost';
    $dbname = 'u211881118_vibra';
    $username = 'u211881118_vibra';
    $password = 'Vibradigital2023.';

    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
    } catch (PDOException $e) {
        echo "Error de conexión: " . $e->getMessage();
    }
}