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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

$project_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($project_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "ID de proyecto no válido."));
    exit();
}

try {
    //code...

    $query = "SELECT projects.*, 
    users.name AS setter_name, 
    prospects.name AS prospect_name, 
    prospects.last_name AS prospect_lname 
FROM projects 
LEFT JOIN users ON projects.id_setter = users.id 
LEFT JOIN prospects ON projects.id_prospect = prospects.id 
WHERE projects.id = :project_id
";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':project_id', $project_id, PDO::PARAM_INT);
    $stmt->execute();
    $prosjectDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($prosjectDetails);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los detalles del proyecto.", "details" => $e->getMessage()));
}
