<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(strip_tags($data['name']));
    $lname = htmlspecialchars(strip_tags($data['lname']));
    $email = htmlspecialchars(strip_tags($data['email']));

    if (isset($data['social']) && $data['social'] !== "otra") {
        $social = htmlspecialchars(strip_tags($data['social']));
    } elseif (isset($data['otherSocial'])) {
        $social = isset($data['otherSocial']) ? htmlspecialchars(strip_tags($data['otherSocial'])) : null;
    } else {
        $social = null;
    }
    $link = isset($data['link']) ? htmlspecialchars(strip_tags($data['link'])) : null;
    $id_setter = $_SESSION['user_id'];

    try {
        // Insertar el prospecto en la base de datos
        $insertProspect = "INSERT INTO prospects (name, last_name, email, social_name, social_link, id_setter) VALUES(:name, :last_name, :email, :social_name, :social_link, :id_setter)";

        $stmt = $conexion->prepare($insertProspect);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':last_name', $lname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':social_name', $social);
        $stmt->bindParam(':social_link', $link);
        $stmt->bindParam(':id_setter', $id_setter);

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
        echo json_encode(array("message" => "Error al registrar el prospecto."));
    }
}
