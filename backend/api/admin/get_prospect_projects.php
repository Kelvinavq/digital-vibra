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

if (!isset($_GET['id_prospect'])) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "Falta el parámetro 'id_prospect'."));
    exit();
}

$id_prospect = $_GET['id_prospect'];

try {
    $query = "SELECT * FROM projects WHERE id_prospect = :id_prospect";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':id_prospect', $id_prospect);
    $stmt->execute();
    $prospectProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($prospectProjects);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los proyectos del prospecto.", "details" => $e->getMessage()));
}
?>
