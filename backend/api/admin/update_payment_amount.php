<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener el ID del pago y el nuevo monto del cuerpo de la solicitud
        $pagoId = htmlspecialchars($data['pagoId']);
        $newAmount = htmlspecialchars($data['newAmount']);

        // Actualizar el monto del pago en la base de datos
        $query = "UPDATE payments SET amount = :newAmount WHERE id = :pagoId";
        $stmt = $conexion->prepare($query);
        $stmt->bindParam(':newAmount', $newAmount);
        $stmt->bindParam(':pagoId', $pagoId);
        $stmt->execute();

        // Verificar si se actualizó correctamente
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Monto actualizado correctamente"));
        } else {
            // El pago no se encontró o no se actualizó
            http_response_code(404);
            echo json_encode(array("message" => "El pago no se encontró o no se actualizó"));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar el monto del pago: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar el monto del pago."));
    }
}
?>
