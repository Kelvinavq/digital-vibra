<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si hay una sesión activa
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa."));
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Consultar la base de datos para obtener la lista de usuarios
    $query = "SELECT u.id, u.team, t.name as team_name FROM users u LEFT JOIN teams t ON u.team = t.id WHERE u.id = '$user_id'";
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    $usuarios = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($usuarios);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener la lista de usuarios.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
