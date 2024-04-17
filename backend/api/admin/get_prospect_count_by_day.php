<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

try {
    // Consultar el conteo de prospectos por día
    $consultaProspectos = "SELECT DATE(registration_date) AS date, COUNT(*) AS count FROM campaign GROUP BY DATE(registration_date)";
    $stmtProspectos = $conexion->query($consultaProspectos);
    $prospectosPorDia = $stmtProspectos->fetchAll(PDO::FETCH_ASSOC);

    // Devolver el conteo de prospectos por día como JSON
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($prospectosPorDia);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error interno del servidor."));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
