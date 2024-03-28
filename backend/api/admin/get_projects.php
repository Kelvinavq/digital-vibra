<?php
include("../../cors.php");
include("../../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Obtener proyectos de la base de datos
        $query = "SELECT * FROM portfolio ORDER BY id DESC";
        $statement = $conexion->prepare($query);
        $statement->execute();
        $proyectos = $statement->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los proyectos en formato JSON
        http_response_code(200);
        echo json_encode(array("proyectos" => $proyectos));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Error al obtener los testimonios."));
    }
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(array("error" => "Método no permitido."));
}
