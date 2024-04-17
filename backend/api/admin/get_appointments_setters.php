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

try {
    // Consultar la base de datos para obtener la lista de usuarios
    $query = "SELECT
    u.id,
    u.name,
    u.email,
    u.phone_number,
    u.address,
    u.profile_picture,
    u.registration_time,
    u.registration_date,
    u.role,
    u.team,
    t.name AS team_name,
    (
        SELECT COUNT(*)
        FROM prospects p
        WHERE p.id_setter = u.id
    ) AS prospect_count,
    (
        SELECT COUNT(*)
        FROM projects pr
        WHERE pr.id_setter = u.id
    ) AS project_count
FROM
    users u
LEFT JOIN
    teams t ON u.team = t.id
WHERE
    u.role != 'admin'
ORDER BY
    u.registration_date DESC;";
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($usuarios);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener la lista de usuarios.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
