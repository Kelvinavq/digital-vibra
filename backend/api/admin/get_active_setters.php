<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT * FROM users WHERE status = 'active' AND role = 'setter'";
        $stmt = $conexion->prepare($query);
        $stmt->execute();
        $setters = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($setters);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener setters activos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener setters activos."));
    }
}
