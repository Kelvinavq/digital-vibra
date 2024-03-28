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
    // Consultar la base de datos para obtener el total de mensajes enviados
    $query = "SELECT COUNT(*) AS total_mensajes_enviados FROM prospects WHERE id_setter = '$user_id'";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $total_mensajes_enviados = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($total_mensajes_enviados);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener el total de mensajes enviados.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
