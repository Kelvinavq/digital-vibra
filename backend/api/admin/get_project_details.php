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

$portfolio_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($portfolio_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "ID de proyecto no válido."));
    exit();
}

try {
    //code...

    $query = "SELECT * FROM portfolio WHERE id = :portfolio_id";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':portfolio_id', $portfolio_id, PDO::PARAM_INT);
    $stmt->execute();
    $portfolioDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($portfolioDetails);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los detalles del prospecto.", "details" => $e->getMessage()));
}
