<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selectedProspects = $data['prospects'];

    try {
        // Iniciar una transacción para asegurar la consistencia de la base de datos
        $conexion->beginTransaction();

        // Construir la consulta para obtener los IDs de prospectos asociados a las campañas seleccionadas
        $selectedCampaignsString = implode(",", $selectedProspects);
        $selectProspectsQuery = "SELECT id FROM prospects WHERE id_campaign IN ($selectedCampaignsString)";
        $stmtSelectProspects = $conexion->prepare($selectProspectsQuery);
        $stmtSelectProspects->execute();
        $prospectIds = $stmtSelectProspects->fetchAll(PDO::FETCH_COLUMN);

        // Construir la consulta para eliminar los registros de prospects asociados a las campañas seleccionadas
        $prospectIdsString = implode(",", $prospectIds);
        $deleteProspectsQuery = "DELETE FROM prospects WHERE id IN ($prospectIdsString)";
        
        // Ejecutar la consulta para eliminar los registros de prospects
        $stmtDeleteProspects = $conexion->prepare($deleteProspectsQuery);
        $stmtDeleteProspects->execute();

        // Construir la consulta para actualizar los prospectos seleccionados y establecer id_setter como null
        $updateQuery = "UPDATE campaign SET id_setter = NULL WHERE id IN ($selectedCampaignsString)";
        
        // Ejecutar la consulta para actualizar los registros en campaign
        $stmtUpdate = $conexion->prepare($updateQuery);
        $stmtUpdate->execute();

        // Confirmar la transacción
        $conexion->commit();

        // Puedes enviar una respuesta si es necesario
        http_response_code(200);
        echo json_encode(array("message" => "Prospectos marcados como sin asignar correctamente y registros eliminados de la tabla prospects."));
    } catch (Exception $e) {
        // Revertir la transacción si se produce un error
        $conexion->rollBack();

        // Log de la excepción
        error_log("Excepción al marcar prospectos como sin asignar y eliminar registros de prospects: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al marcar prospectos como sin asignar y eliminar registros de prospects."));
    }
}
?>
