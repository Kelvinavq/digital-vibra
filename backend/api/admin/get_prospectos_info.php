<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT COUNT(*) AS total_prospectos, SUM(CASE WHEN schedule = 'si' AND response = 'si' THEN 1 ELSE 0 END) AS activos FROM prospects";

        $stmt = $conexion->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($result);
    } catch (Exception $e) {
        error_log("Excepción al obtener información de Prospectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener información de Prospectos."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
