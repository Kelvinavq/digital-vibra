<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = htmlspecialchars(strip_tags($data['id']));
    $name = htmlspecialchars(strip_tags($data['name']));
    $link = htmlspecialchars(strip_tags($data['link']));
    $description = htmlspecialchars(strip_tags($data['description']));
    $status = isset($data['status']) ? htmlspecialchars(strip_tags($data['status'])) : null;

    try {
        // Actualizar la información del proyecto en la base de datos
        $updateProject = "UPDATE portfolio 
                            SET name = :name, 
                                link = :link, 
                                description = :description, 
                                status = :status 
                            WHERE id = :id";

        $stmt = $conexion->prepare($updateProject);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':link', $link);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Información del proyecto actualizada con éxito."));
        } else {
            // Error en la actualización
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar la información del proyecto."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar la información del proyecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar la información del proyecto."));
    }
}
