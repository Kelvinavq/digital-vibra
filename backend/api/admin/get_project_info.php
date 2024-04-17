<?php
include("../../cors.php");
include("../../config/Config.php");

// Verificar si se recibe el parámetro id_project
if (isset($_GET['id_project'])) {
    $id_project = $_GET['id_project'];

    $conexion = obtenerConexion();

    try {
        // Consultar la información del proyecto por id_project
        $query = "SELECT projects.*, 
                         COALESCE(SUM(payments.amount), 0) AS total_pagado,
                         COALESCE(projects.budget - SUM(payments.amount), projects.budget) AS restante
                  FROM projects
                  LEFT JOIN payments ON projects.id = payments.project_id
                  WHERE projects.id = :id_project
                  GROUP BY projects.id";
        $stmt = $conexion->prepare($query);
        $stmt->bindParam(':id_project', $id_project);
        $stmt->execute();

        $proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($proyecto) {
            http_response_code(200);
            echo json_encode($proyecto);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontró el proyecto con el ID proporcionado."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener información del proyecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener información del proyecto."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Se requiere el parámetro id_project."));
}
?>
