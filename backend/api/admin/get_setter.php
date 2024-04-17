<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Verificar si se recibió un ID de setter
        if (isset($_GET['id'])) {
            $idSetter = htmlspecialchars($_GET['id']);
            $query = "SELECT * FROM users WHERE id = :id AND role = 'setter'";
            $stmt = $conexion->prepare($query);
            $stmt->bindParam(':id', $idSetter);
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Falta el ID del setter."));
            exit();
        }

        $stmt->execute();
        $setter = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($setter) {
            http_response_code(200);
            echo json_encode($setter);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Setter no encontrado."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener setter: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener setter."));
    }
}
