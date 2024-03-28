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

$testimonial_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($testimonial_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "ID de prospecto no válido."));
    exit();
}

try {
    //code...

    $query = "SELECT * FROM testimonials WHERE id = :testimonial_id";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':testimonial_id', $testimonial_id, PDO::PARAM_INT);
    $stmt->execute();
    $testimonioDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($testimonioDetails);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los detalles del prospecto.", "details" => $e->getMessage()));
}
