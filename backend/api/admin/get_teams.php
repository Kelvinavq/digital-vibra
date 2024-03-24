<?php
include ("../../cors.php");
include ("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();


try {
    // Consultar la base de datos para obtener la lista de plataformas
    $query = "SELECT * FROM teams WHERE status = 'active' ORDER BY id DESC";
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($teams);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener la lista de teams.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
