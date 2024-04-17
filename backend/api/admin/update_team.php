<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = htmlspecialchars(strip_tags($data['id']));
    $name = htmlspecialchars(strip_tags($data['name']));

    try {
        // Actualizar el nombre del equipo en la base de datos
        $updateTeam = "UPDATE teams SET name = :name WHERE id = :id";

        $stmt = $conexion->prepare($updateTeam);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Nombre del equipo actualizado con éxito."));
        } else {
            // Error en la actualización
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar el nombre del equipo."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar el nombre del equipo: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar el nombre del equipo."));
    }
}
?>
