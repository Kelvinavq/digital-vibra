<?php
include ("../../cors.php");
include ("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si hay una sesión activa
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa."));
    exit();
}
$id_setter = $_SESSION['user_id'];

try {
    // Consultar la base de datos para obtener la lista de plataformas
    $query = "SELECT * FROM prospects WHERE id_setter = :id_setter ORDER BY created_at DESC";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':id_setter', $id_setter);
    $stmt->execute();

    $prospects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($prospects);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener la lista de prospectos.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
