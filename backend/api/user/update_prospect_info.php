<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = htmlspecialchars(strip_tags($data['id']));
    $name = htmlspecialchars(strip_tags($data['name']));
    $lname = htmlspecialchars(strip_tags($data['lastname']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $note = htmlspecialchars(strip_tags($data['note']));
    $socialLink = isset($data['socialLink']) ? htmlspecialchars(strip_tags($data['socialLink'])) : null;
    $contactInfo = isset($data['contactInfo']) ? htmlspecialchars(strip_tags($data['contactInfo'])) : null;
    $response = isset($data['responseCheck']) ? htmlspecialchars(strip_tags($data['responseCheck'])) : null;
    $schedule = isset($data['schedule']) ? htmlspecialchars(strip_tags($data['schedule'])) : null;
    $meetDate = isset($data['meetDate']) ? htmlspecialchars(strip_tags($data['meetDate'])) : null;
    $meetTime = isset($data['meetTime']) ? htmlspecialchars(strip_tags($data['meetTime'])) : null;

    try {
        // Actualizar la información del prospecto en la base de datos
        $updateProspect = "UPDATE prospects 
                            SET name = :name, 
                                last_name = :last_name, 
                                email = :email, 
                                note = :note, 
                                social_link = :social_link, 
                                contact_info = :contact_info, 
                                response = :response, 
                                schedule = :schedule, 
                                meet_date = :meet_date, 
                                meet_time = :meet_time 
                            WHERE id = :id";

        $stmt = $conexion->prepare($updateProspect);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':last_name', $lname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':note', $note);
        $stmt->bindParam(':social_link', $socialLink);
        $stmt->bindParam(':contact_info', $contactInfo);
        $stmt->bindParam(':response', $response);
        $stmt->bindParam(':schedule', $schedule);
        $stmt->bindParam(':meet_date', $meetDate);
        $stmt->bindParam(':meet_time', $meetTime);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Información del prospecto actualizada con éxito."));
        } else {
            // Error en la actualización
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar la información del prospecto."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al actualizar la información del prospecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar la información del prospecto."));
    }
}
?>
