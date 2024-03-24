<?php
include '../cors.php';
include("../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

// Verificar si el campo "matricula" está presente en la solicitud POST
if (!isset($_POST['matricula'])) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(array("error" => "Falta el parámetro 'matricula' en la solicitud."));
    exit();
}

try {
    // Obtener la matrícula del cuerpo de la solicitud
    $matricula = $_POST['matricula'];

    // Formatear la matrícula para que coincida con el formato almacenado en la base de datos
    $matricula = preg_replace('/\s+/', '', $matricula); // Eliminar espacios en blanco
    $matricula = implode(" - ", str_split($matricula, 3)); // Dividir la matrícula en grupos de 3 caracteres con un guión entre cada grupo

    // Consultar la base de datos para verificar si la matrícula está registrada
    $buscarMatricula = "SELECT COUNT(*) AS count FROM setter_info WHERE matricula = :matricula";
    $stmtBuscar = $conexion->prepare($buscarMatricula);
    $stmtBuscar->bindValue(':matricula', $matricula);
    $stmtBuscar->execute();

    $resultado = $stmtBuscar->fetch(PDO::FETCH_ASSOC);

    if ($resultado['count'] > 0) {
        // Matrícula encontrada, devolver una respuesta exitosa
        http_response_code(200);
        echo json_encode(array("message" => "La matrícula está registrada."));
    } else {
        // Matrícula no encontrada, devolver un error
        http_response_code(404); // No encontrado
        echo json_encode(array("error" => "La matrícula no está registrada."));
    }
} catch (Exception $e) {
    http_response_code(500); // Error interno del servidor
    echo json_encode(array("error" => "Error interno del servidor."));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
