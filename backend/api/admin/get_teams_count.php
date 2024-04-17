<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT t.*, COUNT(u.id) AS memberCount
                  FROM teams t
                  LEFT JOIN users u ON t.id = u.team
                  GROUP BY t.id";

        $stmt = $conexion->prepare($query);
        $stmt->execute();
        $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array("teams" => $teams));
    } catch (Exception $e) {
        error_log("Excepción al obtener equipos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener equipos."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
