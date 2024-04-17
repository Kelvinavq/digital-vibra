<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

try {
    // Consulta SQL para obtener los datos del ranking
    $query = "SELECT t.name AS team_name, 
                     MONTH(p.registered_date) AS month, 
                     SUM(p.budget) AS total_budget 
              FROM projects p
              INNER JOIN teams t ON p.team = t.id
              WHERE p.status = 'finalizado'
              GROUP BY t.name, MONTH(p.registered_date)
              ORDER BY t.name, MONTH(p.registered_date)";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $teams = array();
    foreach ($result as $row) {
        $teamName = $row['team_name'];
        $month = $row['month'] - 1; // Restar 1 porque JavaScript comienza los meses desde 0
        $totalBudget = floatval($row['total_budget']);

        if (!isset($teams[$teamName])) {
            $teams[$teamName] = array_fill(0, 12, 0); // Inicializar el array con 0 para cada mes
        }
        $teams[$teamName][$month] = $totalBudget;
    }

    $series = array();
    foreach ($teams as $teamName => $data) {
        $series[] = array(
            'name' => $teamName,
            'data' => $data
        );
    }

    http_response_code(200); // OK
    echo json_encode(array('series' => $series));
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los datos del ranking del equipo.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
