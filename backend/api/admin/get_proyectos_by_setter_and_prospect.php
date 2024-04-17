<?php
include("../../cors.php");
include("../../config/Config.php");

// Verificar si se reciben los parámetros id_setter y id_prospect
if (isset($_GET['id_setter']) && isset($_GET['id_prospect'])) {
    $id_setter = $_GET['id_setter'];
    $id_prospect = $_GET['id_prospect'];

    $conexion = obtenerConexion();

    try {
        // Consultar los proyectos filtrados por id_setter y id_prospect
        $query = "SELECT * FROM projects WHERE id_setter = :id_setter AND id_prospect = :id_prospect";
        $stmt = $conexion->prepare($query);
        $stmt->bindParam(':id_setter', $id_setter);
        $stmt->bindParam(':id_prospect', $id_prospect);
        $stmt->execute();

        $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($proyectos) {
            http_response_code(200);
            echo json_encode($proyectos);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron proyectos para este setter y prospecto."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener proyectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener proyectos."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Se requieren los parámetros id_setter e id_prospect."));
}
?>
