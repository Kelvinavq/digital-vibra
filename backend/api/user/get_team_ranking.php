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
    // Obtener el id del equipo al que pertenece el usuario
    $query = "SELECT team FROM users WHERE id = :user_id";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $user_team_id = $stmt->fetchColumn();

    // Consultar el ranking de equipos y obtener la posición del equipo del usuario
    $query = "SELECT t.id, t.name, IFNULL(SUM(p.budget), 0) as total_income
              FROM teams t
              LEFT JOIN users u ON t.id = u.team
              LEFT JOIN projects p ON u.id = p.id_setter AND p.status = 'aprobado' AND MONTH(p.registered_date) = MONTH(CURRENT_DATE()) AND YEAR(p.registered_date) = YEAR(CURRENT_DATE())
              GROUP BY t.id, t.name
              ORDER BY total_income DESC";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Buscar la posición del equipo del usuario en el ranking
    $user_team_position = -1;
    foreach ($ranking as $key => $team) {
        if ($team['id'] == $user_team_id) {
            $user_team_position = $key + 1; // La posición en el ranking es 1 más el índice del array
            break;
        }
    }

    http_response_code(200); // OK
    echo json_encode(array("ranking" => $ranking, "user_team_position" => $user_team_position));
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener el ranking de equipos.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
?>
