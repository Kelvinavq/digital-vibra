<?php
include('../../config/Config.php');
include('../../cors.php');

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa."));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

// Obtener datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

// Validar que se hayan enviado todos los campos necesarios
if (
    !isset($data->id) ||
    !isset($data->budget) ||
    !isset($data->commission) ||
    !isset($data->note) ||
    !isset($data->attended) ||
    !isset($data->status)
) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "Todos los campos son obligatorios."));
    exit();
}

// Asignar datos a variables
$id = $data->id;
$budget = $data->budget;
$commission = $data->commission;
$note = $data->note;
$attended = $data->attended;
$status = $data->status;

try {
    // Preparar consulta SQL para actualizar el proyecto
    $query = "UPDATE projects SET budget = :budget, commission = :commission, note = :note, attended = :attended, status = :status WHERE id = :id";
    $stmt = $conexion->prepare($query);

    // Asignar valores a los parámetros de la consulta
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":budget", $budget);
    $stmt->bindParam(":commission", $commission);
    $stmt->bindParam(":note", $note);
    $stmt->bindParam(":attended", $attended);
    $stmt->bindParam(":status", $status);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        http_response_code(200); // OK
        echo json_encode(array("message" => "Proyecto actualizado correctamente."));
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error al actualizar el proyecto."));
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al actualizar el proyecto.", "details" => $e->getMessage()));
}
?>
