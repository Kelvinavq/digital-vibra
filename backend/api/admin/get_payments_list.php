<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT py.*, 
                         u_setter.name AS setter_name, 
                         pr.name AS prospect_name, 
                         pr.last_name AS prospect_last_name,
                         p.project_name,
                         p.budget AS project_budget,
                         SUM(py.amount) AS total_paid,
                         (p.budget - SUM(py.amount)) AS remaining
                  FROM payments py
                  LEFT JOIN users u_setter ON py.setter_id = u_setter.id
                  LEFT JOIN prospects pr ON py.prospect_id = pr.id
                  LEFT JOIN projects p ON py.project_id = p.id";

        // Verificar si se está filtrando por ID de setter
        if (isset($_GET['id_setter'])) {
            $idSetter = htmlspecialchars($_GET['id_setter']);
            $query .= " WHERE py.setter_id = :id_setter";
        }
        // Verificar si se está filtrando por ID de prospecto
        elseif (isset($_GET['id_prospect'])) {
            $idProspect = htmlspecialchars($_GET['id_prospect']);
            $query .= " WHERE py.prospect_id = :id_prospect";
        }

        $query .= " GROUP BY py.id";
        $query .= " ORDER BY py.id DESC";

        $stmt = $conexion->prepare($query);

        // Asignar parámetros si es necesario
        if (isset($idSetter)) {
            $stmt->bindParam(':id_setter', $idSetter);
        } elseif (isset($idProspect)) {
            $stmt->bindParam(':id_prospect', $idProspect);
        }

        $stmt->execute();
        $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($pagos);
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al obtener pagos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener pagos."));
    }
}
?>
