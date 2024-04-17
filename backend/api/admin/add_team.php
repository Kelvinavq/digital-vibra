<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(strip_tags($data['name']));

    try {
        // Insertar el nuevo equipo en la base de datos
        $insertTeam = "INSERT INTO teams (name) VALUES (:name)";
        $stmt = $conexion->prepare($insertTeam);
        $stmt->bindParam(':name', $name);

        if ($stmt->execute()) {

            http_response_code(201);
            echo json_encode(array("message" => "Equipo añadido."));
        } else {
            // Error en la inserción
            http_response_code(500);
            echo json_encode(array("message" => "Error al añadir el equipo."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al añadir el equipo: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al añadir el equipo."));
    }
}
