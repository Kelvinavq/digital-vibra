<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Verificar si se recibió un ID de setter
        if (isset($_GET['id_setter'])) {
            $idSetter = htmlspecialchars($_GET['id_setter']);
            $query = "SELECT * FROM prospects WHERE id_setter = :id_setter";
            $stmt = $conexion->prepare($query);
            $stmt->bindParam(':id_setter', $idSetter);
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Falta el ID del setter."));
            exit();
        }

        $stmt->execute();
        $prospects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($prospects);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener prospectos por setter: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener prospectos."));
    }
}
?>
