<?php
include("../cors.php");
include("../config/Config.php");

$conexion = obtenerConexion();
session_start();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(strip_tags($data['name']));
    $lname = htmlspecialchars(strip_tags($data['lname']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $phone = htmlspecialchars(strip_tags($data['phone']));
    $type = htmlspecialchars(strip_tags($data['type']));
    $description = htmlspecialchars(strip_tags($data['description']));

    $fechaActual = date('Y-m-d');
    $horaActual = date('H:i:s');

    try {
        // Insertar el prospecto en la base de datos
        $insertProspect = "INSERT INTO campaign (name, lname, email, phone, type, details, registration_date, registration_time) VALUES(:name, :lname, :email, :phone, :type, :details, :registration_date, :registration_time)";


        $stmt = $conexion->prepare($insertProspect);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':lname', $lname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':details', $description);
        $stmt->bindParam(':registration_date', $fechaActual);
        $stmt->bindParam(':registration_time', $horaActual);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Prospecto registrado con éxito."));
        } else {
            // Error en el registro
            http_response_code(500);
            echo json_encode(array("message" => "Error al registrar el prospecto."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al registrar prospecto: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al registrar el prospecto." . $e->getMessage()));
    }
}
?>
