<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Consultar los proyectos con los nombres del setter y del prospecto
        $query = "SELECT p.*, u_setter.name AS setter_name, pr.name AS prospect_name, pr.last_name AS prospect_last_name,
                          COALESCE(SUM(pa.amount), 0) AS total_pagado,
                          p.budget - COALESCE(SUM(pa.amount), 0) AS restante
                  FROM projects p 
                  LEFT JOIN users u_setter ON p.id_setter = u_setter.id 
                  LEFT JOIN prospects pr ON p.id_prospect = pr.id
                  LEFT JOIN payments pa ON p.id = pa.project_id 
                  GROUP BY p.id
                  ORDER BY p.id DESC";

        $stmt = $conexion->prepare($query);
        $stmt->execute();

        $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($proyectos) {
            http_response_code(200);
            echo json_encode($proyectos);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron proyectos."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener proyectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener proyectos." . $e->getMessage()));
    }
}
?>
