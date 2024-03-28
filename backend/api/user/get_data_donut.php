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
    // Consultar los datos para el primer gráfico (Mensajes enviados)
    $queryEnv = "SELECT COUNT(*) as total FROM prospects WHERE id_setter = '$user_id'";
    $stmtEnv = $conexion->prepare($queryEnv);
    $stmtEnv->execute();
    $mensajesEnviados = $stmtEnv->fetch(PDO::FETCH_ASSOC)['total'];

    // Consultar los datos para el segundo gráfico (Mensajes respondidos)
    $queryRes = "SELECT COUNT(*) as total FROM prospects WHERE id_setter = '$user_id' AND response = 'si'";
    $stmtRes = $conexion->prepare($queryRes);
    $stmtRes->execute();
    $mensajesRespondidos = $stmtRes->fetch(PDO::FETCH_ASSOC)['total'];

    // Consultar los datos para el tercer gráfico (Mensajes agendados)
    $queryAgen = "SELECT COUNT(*) as total FROM prospects WHERE id_setter = '$user_id' AND schedule = 'si'";
    $stmtAgen = $conexion->prepare($queryAgen);
    $stmtAgen->execute();
    $mensajesAgendados = $stmtAgen->fetch(PDO::FETCH_ASSOC)['total'];

    // Preparar la respuesta con los datos necesarios para los gráficos
    $data = array(
        "mensajesEnviados" => $mensajesEnviados,
        "mensajesRespondidos" => $mensajesRespondidos,
        "mensajesAgendados" => $mensajesAgendados
    );

    // Devolver los datos en formato JSON
    http_response_code(200); // OK
    echo json_encode($data);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error al obtener los datos para los gráficos.", "details" => $e->getMessage()));
}

// Cerrar la conexión después de usarla
$conexion = null;
