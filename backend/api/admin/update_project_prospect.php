<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_project = htmlspecialchars(strip_tags($data['id_project']));
    $id_prospect = htmlspecialchars(strip_tags($data['id_prospect']));
    $prospect_name = htmlspecialchars(strip_tags($data['prospect_name']));
    $prospect_lname = htmlspecialchars(strip_tags($data['prospect_lname']));
    $budget = htmlspecialchars(strip_tags($data['budget']));
    $commission = htmlspecialchars(strip_tags($data['commission']));
    $note = htmlspecialchars(strip_tags($data['note']));
    $attended = htmlspecialchars(strip_tags($data['attended']));
    $status = htmlspecialchars(strip_tags($data['status']));

    try {
        // Actualizar la información del proyecto en la base de datos
        $updateProject = "UPDATE projects 
                            SET id_prospect = :id_prospect,
                                budget = :budget, 
                                commission = :commission, 
                                note = :note, 
                                attended = :attended, 
                                status = :status 
                            WHERE id = :id_project";

        $stmt = $conexion->prepare($updateProject);
        $stmt->bindParam(':id_project', $id_project);
        $stmt->bindParam(':id_prospect', $id_prospect);
        $stmt->bindParam(':budget', $budget);
        $stmt->bindParam(':commission', $commission);
        $stmt->bindParam(':note', $note);
        $stmt->bindParam(':attended', $attended);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            // Actualizar el nombre y apellido del prospecto
            $updateProspect = "UPDATE prospects 
                                SET name = :prospect_name, 
                                    last_name = :prospect_lname 
                                WHERE id = :id_prospect";

            $stmt2 = $conexion->prepare($updateProspect);
            $stmt2->bindParam(':id_prospect', $id_prospect);
            $stmt2->bindParam(':prospect_name', $prospect_name);
            $stmt2->bindParam(':prospect_lname', $prospect_lname);

            $stmt2->execute();

            http_response_code(200);
            echo json_encode(array("message" => "Información del proyecto actualizada con éxito."));
        } else {
            // Error en la actualización
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar la información del proyecto."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar la información del proyecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar la información del proyecto."));
    }
}
