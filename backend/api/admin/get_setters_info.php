<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT COUNT(*) AS total_setters, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activos FROM users WHERE role = 'setter'";

        $stmt = $conexion->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($result);
    } catch (Exception $e) {
        error_log("Excepción al obtener información de Setters: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener información de Setters."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
