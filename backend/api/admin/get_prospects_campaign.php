<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Obtener los prospectos de la tabla campaign
        $getProspects = "SELECT campaign.*, users.name AS setter_name
        FROM campaign
        LEFT JOIN users ON campaign.id_setter = users.id
        ORDER BY campaign.id DESC";


        $stmt = $conexion->prepare($getProspects);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            // Devolver los prospectos como respuesta en formato JSON
            http_response_code(200);
            echo json_encode($result);
        } else {
            // No hay prospectos registrados
            http_response_code(404);
            echo json_encode(array("message" => "No hay prospectos registrados en este momento."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener prospectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener los prospectos."));
    }
}
?>
