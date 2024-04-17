<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_GET['id_setter'])) {
        $id_setter = $_GET['id_setter'];
        try {
            // Consultar los prospectos relacionados con el setter dado
            $query = "SELECT * FROM prospects WHERE id_setter = :id_setter";

            $stmt = $conexion->prepare($query);
            $stmt->bindParam(':id_setter', $id_setter, PDO::PARAM_INT);
            $stmt->execute();

            $prospectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($prospectos) {
                http_response_code(200);
                echo json_encode($prospectos);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No se encontraron prospectos para el setter dado."));
            }
        } catch (Exception $e) {
            // Log de la excepción
            error_log("Excepción al obtener prospectos por setter: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(array("message" => "Error al obtener prospectos por setter."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Falta el parámetro id_setter en la solicitud."));
    }
}
?>
