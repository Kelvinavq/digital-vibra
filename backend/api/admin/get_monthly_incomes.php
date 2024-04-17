<?php

include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

try {
    // Consultar los ingresos mensuales
    $consultaIngresos = "SELECT MONTH(payment_date) AS month, SUM(amount) AS total_amount FROM payments GROUP BY MONTH(payment_date)";
    $stmtIngresos = $conexion->query($consultaIngresos);
    $ingresosMensuales = $stmtIngresos->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los ingresos mensuales como JSON
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($ingresosMensuales);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error interno del servidor."));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
