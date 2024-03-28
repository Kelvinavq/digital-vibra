<?php
include ("../../cors.php");
include ("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Obtener el ID del equipo desde la consulta GET
$teamId = isset($_GET['teamId']) ? $_GET['teamId'] : null;

try {
    // Consultar la base de datos para obtener los proyectos asociados a un equipo
    $query = "SELECT * FROM projects WHERE id_setter IN (SELECT id FROM users WHERE team = :teamId)";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':teamId', $teamId);
    $stmt->execute();

    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($projects);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los proyectos del equipo.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
