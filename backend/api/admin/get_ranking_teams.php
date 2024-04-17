<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

try {
    // Consultar todos los equipos
    $consultaEquipos = "SELECT id, name FROM teams";
    $stmtEquipos = $conexion->query($consultaEquipos);
    $equipos = $stmtEquipos->fetchAll(PDO::FETCH_ASSOC);

    $ranking = array();

    // Para cada equipo, calcular el presupuesto total de proyectos finalizados
    foreach ($equipos as $equipo) {
        $equipoId = $equipo['id'];
        $consultaPresupuesto = "SELECT SUM(budget) AS total_budget FROM projects WHERE team = :equipoId AND status = 'finalizado'";
        $stmtPresupuesto = $conexion->prepare($consultaPresupuesto);
        $stmtPresupuesto->bindValue(':equipoId', $equipoId);
        $stmtPresupuesto->execute();
        $presupuesto = $stmtPresupuesto->fetch(PDO::FETCH_ASSOC);
        
        // Agregar al ranking el nombre del equipo y el presupuesto total
        $ranking[] = array(
            'name' => $equipo['name'],
            'total_budget' => $presupuesto['total_budget'] ?: 0 // Si no hay presupuesto, se establece como 0
        );
    }

    // Ordenar el ranking por presupuesto total de forma descendente
    usort($ranking, function($a, $b) {
        return $b['total_budget'] - $a['total_budget'];
    });

    // Devolver el ranking como JSON
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($ranking);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error interno del servidor."));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
