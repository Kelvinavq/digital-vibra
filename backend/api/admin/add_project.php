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
    !isset($data->id_prospect) ||
    !isset($data->id_setter) ||
    !isset($data->team) ||
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
$id_prospect = $data->id_prospect;
$id_setter = $data->id_setter;
$team = $data->team;
$budget = $data->budget;
$commission = $data->commission;
$note = $data->note;
$attended = $data->attended;
$status = $data->status;
$registeredDate = date('Y-m-d');
$registeredTime = date('H:i:s');

try {
    // Preparar consulta SQL para insertar el nuevo proyecto
    $query = "INSERT INTO projects (id_setter, id_prospect, budget, commission, note, attended, status, registered_date, registered_time, team) VALUES (:id_setter, :id_prospect, :budget, :commission, :note, :attended, :status, :registered_date, :registered_time, :team)";
    $stmt = $conexion->prepare($query);

    // Asignar valores a los parámetros de la consulta
    $stmt->bindParam(":id_setter", $id_setter);
    $stmt->bindParam(":id_prospect", $id_prospect);
    $stmt->bindParam(":budget", $budget);
    $stmt->bindParam(":commission", $commission);
    $stmt->bindParam(":note", $note);
    $stmt->bindParam(":attended", $attended);
    $stmt->bindParam(":status", $status);
    $stmt->bindParam(":registered_date", $registeredDate);
    $stmt->bindParam(":registered_time", $registeredTime);
    $stmt->bindParam(":team", $team);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(array("message" => "Proyecto agregado correctamente."));
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error al agregar el proyecto."));
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al agregar el proyecto.", "details" => $e->getMessage()));
}
