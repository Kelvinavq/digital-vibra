<?php
include ('../../config/Config.php');
include ('../../cors.php');

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

$prospect_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($prospect_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "ID de prospecto no válido."));
    exit();
}

try {
    //code...

    $query = "SELECT * FROM prospects WHERE id = :id_prospect";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':id_prospect', $prospect_id, PDO::PARAM_INT);
    $stmt->execute();
    $prospectDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($prospectDetails);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los detalles del prospecto.", "details" => $e->getMessage()));
}