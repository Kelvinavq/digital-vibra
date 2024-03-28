<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si hay una sesión activa
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa."));
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Obtener el mes y el año actual
    $month = date('m');
    $year = date('Y');

    // Consultar la base de datos para obtener la comisión del usuario para el mes actual
    $query = "SELECT SUM(commission) AS totalCommission FROM projects WHERE status = 'aprobado' AND id_setter = '$user_id' AND MONTH(registered_date) = $month AND YEAR(registered_date) = $year";
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    $commissionData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Devolver la comisión total del mes actual para el usuario
    http_response_code(200); // OK
    echo json_encode($commissionData);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener la comisión del mes actual.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
