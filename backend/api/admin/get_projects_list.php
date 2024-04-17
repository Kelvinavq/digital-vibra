<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT p.*, u_setter.name AS setter_name, pr.name AS prospect_name,pr.last_name AS prospect_last_name
                  FROM projects p 
                  LEFT JOIN users u_setter ON p.id_setter = u_setter.id 
                  LEFT JOIN prospects pr ON p.id_prospect = pr.id 
                  LEFT JOIN users u_prospect ON pr.id_setter = u_prospect.id";

        // Verificar si se está filtrando por ID de setter
        if (isset($_GET['id_setter'])) {
            $idSetter = htmlspecialchars($_GET['id_setter']);
            $query .= " WHERE p.id_setter = :id_setter";
        }
        // Verificar si se está filtrando por ID de prospecto
        elseif (isset($_GET['id_prospect'])) {
            $idProspect = htmlspecialchars($_GET['id_prospect']);
            $query .= " WHERE p.id_prospect = :id_prospect";
        }

        $query .= " ORDER BY p.id DESC";

        $stmt = $conexion->prepare($query);

        // Asignar parámetros si es necesario
        if (isset($idSetter)) {
            $stmt->bindParam(':id_setter', $idSetter);
        } elseif (isset($idProspect)) {
            $stmt->bindParam(':id_prospect', $idProspect);
        }

        $stmt->execute();
        $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($proyectos);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener proyectos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener proyectos."));
    }
}
