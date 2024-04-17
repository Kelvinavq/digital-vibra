<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selectedProspects = $data['prospects'];
    $setterId = $data['setter_id'];

    try {
        // Consultar todas las columnas de la tabla campaign con los IDs enviados
        $selectedProspectsString = implode(",", $selectedProspects);
        $selectQuery = "SELECT * FROM campaign WHERE id IN ($selectedProspectsString)";
        $stmtSelect = $conexion->prepare($selectQuery);
        $stmtSelect->execute();
        $prospectos = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);

        // Insertar la información en la tabla prospects
        foreach ($prospectos as $prospecto) {
            $name = $prospecto['name'];
            $lname = $prospecto['lname'];
            $email = $prospecto['email'];
            $type = $prospecto['type'];
            $idCampaign = $prospecto['id']; 

            $insertQuery = "INSERT INTO prospects (name, last_name, email, id_setter,id_campaign) VALUES (:name, :lname, :email, :id_setter, :id_campaign)";
            $stmtInsert = $conexion->prepare($insertQuery);
            $stmtInsert->bindParam(':name', $name);
            $stmtInsert->bindParam(':lname', $lname);
            $stmtInsert->bindParam(':email', $email);
            $stmtInsert->bindParam(':id_setter', $setterId);
            $stmtInsert->bindParam(':id_campaign', $idCampaign);
            $stmtInsert->execute();
        }

        // Actualizar el id_setter en la tabla campaign
        $updateQuery = "UPDATE campaign SET id_setter = :id_setter WHERE id IN ($selectedProspectsString)";
        $stmtUpdate = $conexion->prepare($updateQuery);
        $stmtUpdate->bindParam(':id_setter', $setterId);
        $stmtUpdate->execute();

        // Puedes enviar una respuesta si es necesario
        http_response_code(200);
        echo json_encode(array("message" => "Usuarios asignados correctamente."));
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al asignar usuarios: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al asignar usuarios."));
    }
}
?>
