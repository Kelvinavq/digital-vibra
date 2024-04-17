<?php
include '../../cors.php';
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Validar y escapar los datos para prevenir SQL injection
        $nameProject = htmlspecialchars(strip_tags($data->nameProject));
        $setterId = intval($data->setterId);
        $Team = intval($data->Team);
        $prospectId = intval($data->prospectId);
        $budget = floatval($data->budget);
        $commission = floatval($data->commission);
        $attended = $data->attended;
        $status = $data->status;
        $paymentMethod = htmlspecialchars(strip_tags($data->paymentMethod));
        $Note = htmlspecialchars(strip_tags($data->Note));

        $registeredDate = date('Y-m-d');
        $registeredTime = date('H:i:s');


        // Preparar la consulta SQL para insertar el proyecto en la base de datos
        $sql = "INSERT INTO projects (id_setter, id_prospect, budget, commission, note, attended, status, registered_date, registered_time, team, payment_type, project_name)
          VALUES (:setterId, :prospectId, :budget, :commission, :note, :attended, :status, :registered_date, :registered_time, :team, :paymentMethod, :nameProject)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':setterId', $setterId);
        $stmt->bindParam(':prospectId', $prospectId);
        $stmt->bindParam(':budget', $budget);
        $stmt->bindParam(':commission', $commission);
        $stmt->bindParam(':note', $Note);
        $stmt->bindParam(':attended', $attended);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':registered_date', $registeredDate);
        $stmt->bindParam(':registered_time', $registeredTime);
        $stmt->bindParam(':team', $Team, PDO::PARAM_INT);
        $stmt->bindParam(':paymentMethod', $paymentMethod);
        $stmt->bindParam(':nameProject', $nameProject);

        // Ejecutar la consulta SQL
        if ($stmt->execute()) {
            // Si la consulta se ejecutó con éxito, enviar una respuesta exitosa
            http_response_code(200);
            echo json_encode(array("message" => "Proyecto registrado exitosamente"));
        } else {
            // Si hubo un error al ejecutar la consulta, enviar un mensaje de error
            http_response_code(500);
            echo json_encode(array("error" => "Hubo un error al registrar el proyecto"));
        }
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error interno del servidor"));
    } finally {
        // Cerrar la conexión después de usarla
        $conexion = null;
    }
}
