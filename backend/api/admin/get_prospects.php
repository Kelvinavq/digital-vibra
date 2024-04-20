<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $userId = isset($_GET['id_setter']) ? $_GET['id_setter'] : null;

        // Construir la consulta SQL para obtener los prospectos
        $query = "SELECT p.*, u.name AS user_name, COUNT(pr.id) AS project_count 
                  FROM prospects p 
                  LEFT JOIN users u ON p.id_setter = u.id 
                  LEFT JOIN projects pr ON p.id = pr.id_prospect";
        if ($userId) {
            $query .= " WHERE p.id_setter = :userId";
        }
        $query .= " GROUP BY p.id"; 
        $query .= " ORDER BY p.id DESC"; 

        $stmt = $conexion->prepare($query);

        if ($userId) {
            $stmt->bindParam(':userId', $userId);
        }

        $stmt->execute();
        $prospectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Enviar la respuesta como JSON
        http_response_code(200);
        echo json_encode($prospectos);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener prospectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener prospectos."));
    }
}
?>
