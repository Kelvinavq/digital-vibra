<?php
include '../cors.php';
include("../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Método no permitido
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

// Verificar si el parámetro 'm' está presente en la solicitud GET
if (!isset($_GET['m'])) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(array("error" => "Falta el parámetro 'm' en la solicitud."));
    exit();
}

try {
    // Obtener la matrícula de la solicitud GET y limpiarla
    $matricula = trim($_GET['m']);

    // Eliminar cualquier espacio en blanco y guiones de la matrícula
    $matricula = str_replace(' ', '', $matricula);
    $matricula = str_replace('-', '', $matricula);

    // Formatear la matrícula a un formato específico (000-000)
    $matricula = substr($matricula, 0, 3) . ' - ' . substr($matricula, 3, 3);

    // Realizar la consulta SQL para obtener los datos de usuario
    $consulta = "SELECT u.name, u.email, u.role, u.profile_picture, u.registration_date, si.matricula
    FROM users u
    INNER JOIN setter_info si ON u.id = si.user_id
    WHERE si.matricula = :matricula";

                 
    $stmt = $conexion->prepare($consulta);
    $stmt->bindValue(':matricula', $matricula);
    $stmt->execute();

    // Verificar si se encontraron resultados
    if ($stmt->rowCount() > 0) {
        // Obtener los datos del usuario
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // Devolver los datos del usuario en la respuesta
        http_response_code(200);
        echo json_encode($usuario);
    } else {
        // No se encontraron datos para la matrícula dada
        http_response_code(404); // No encontrado
        echo json_encode(array("error" => "No se encontraron datos para la matrícula proporcionada."));
    }
} catch (Exception $e) {
    // Error interno del servidor
    http_response_code(500); // Error interno del servidor
    echo json_encode(array("error" => "Error interno del servidor."));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
