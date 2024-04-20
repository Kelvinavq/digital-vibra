<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa."));
    exit();
}

$prospect_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($prospect_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "ID de prospecto no válido."));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Obtener el prospecto con el ID especificado
        $getProspect = "SELECT campaign.*, users.name AS setter_name
                        FROM campaign
                        LEFT JOIN users ON campaign.id_setter = users.id
                        WHERE campaign.id = :prospect_id";

        $stmt = $conexion->prepare($getProspect);
        $stmt->bindParam(':prospect_id', $prospect_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Devolver el prospecto encontrado como respuesta en formato JSON
            http_response_code(200);
            echo json_encode($result);
        } else {
            // No se encontró el prospecto con el ID especificado
            http_response_code(404);
            echo json_encode(array("message" => "No se encontró ningún prospecto con el ID especificado."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener prospecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener el prospecto."));
    }
}
?>
