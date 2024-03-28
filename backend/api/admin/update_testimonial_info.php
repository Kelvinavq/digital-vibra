<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = htmlspecialchars(strip_tags($data['id']));
    $name = htmlspecialchars(strip_tags($data['name']));
    $testimonio = htmlspecialchars(strip_tags($data['testimonio']));
    $status = isset($data['status']) ? htmlspecialchars(strip_tags($data['status'])) : null;

    try {
        // Actualizar la información del testimonio en la base de datos
        $updateTestimonial = "UPDATE testimonials 
                            SET name = :name, 
                                testimonial = :testimonial, 
                                status = :status 
                            WHERE id = :id";

        $stmt = $conexion->prepare($updateTestimonial);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':testimonial', $testimonio);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Información del testimonio actualizada con éxito."));
        } else {
            // Error en la actualización
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar la información del testimonio."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar la información del testimonio: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar la información del testimonio."));
    }
}
?>
