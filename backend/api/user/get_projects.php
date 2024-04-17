<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $userId = isset($_GET['prospecto']) ? $_GET['prospecto'] : null;

        // Construir la consulta SQL para obtener los proyectos
        $query = "SELECT * FROM projects";
        if ($userId) {
            $query .= " WHERE id_prospect = :userId";
        }
        $query .= " ORDER BY id DESC";

        $stmt = $conexion->prepare($query);

        if ($userId) {
            $stmt->bindParam(':userId', $userId);
        }

        $stmt->execute();
        $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Enviar la respuesta como JSON
        http_response_code(200);
        echo json_encode($proyectos);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener proyectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener proyectos."));
    }
}
?>
