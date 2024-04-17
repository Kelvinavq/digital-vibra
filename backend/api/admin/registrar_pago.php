<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener datos del cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->setter_id) &&
    isset($data->prospect_id) &&
    isset($data->project_id) &&
    isset($data->amount)
) {
    $setter_id = intval($data->setter_id);
    $prospect_id = intval($data->prospect_id);
    $project_id = intval($data->project_id);
    $amount = floatval($data->amount);

    $conexion = obtenerConexion();

    try {
        // Preparar la consulta para insertar el pago en la tabla payments
        $query = "INSERT INTO payments (project_id, prospect_id, amount, setter_id, payment_date, payment_time) VALUES (:project_id, :prospect_id, :amount, :setter_id, CURDATE(), CURTIME())";
        $stmt = $conexion->prepare($query);
        $stmt->bindParam(':project_id', $project_id, PDO::PARAM_INT);
        $stmt->bindParam(':prospect_id', $prospect_id, PDO::PARAM_INT);
        $stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
        $stmt->bindParam(':setter_id', $setter_id, PDO::PARAM_INT);
        $stmt->execute();

        // Verificar si se insertó correctamente el pago
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Pago registrado correctamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al registrar el pago."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al registrar el pago: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al registrar el pago."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Se requieren los parámetros setter_id, prospect_id, project_id y amount."));
}
?>
