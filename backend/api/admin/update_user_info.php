<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $data['id'];
    $name = htmlspecialchars(strip_tags($data['name']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $phone_number = htmlspecialchars(strip_tags($data['phone_number']));
    $address = htmlspecialchars(strip_tags($data['address']));
    $role = htmlspecialchars(strip_tags($data['role']));
    $team = htmlspecialchars(strip_tags($data['team']));
    $status = htmlspecialchars(strip_tags($data['status']));
    $password = $data['password'];

    // Verificar si se proporcionó una nueva contraseña
    if (!empty($password)) {
        // Hashear la nueva contraseña antes de almacenarla en la base de datos
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    }

    try {
        // Construir la consulta SQL para actualizar la información del usuario
        $updateQuery = "UPDATE users SET name = :name, email = :email, phone_number = :phone_number, address = :address, role = :role, team = :team, status = :status";

        // Si se proporcionó una nueva contraseña, agregarla a la consulta
        if (!empty($password)) {
            $updateQuery .= ", password = :password";
        }

        $updateQuery .= " WHERE id = :id";

        // Preparar la consulta
        $stmtUpdate = $conexion->prepare($updateQuery);

        // Enlazar parámetros
        $stmtUpdate->bindParam(':name', $name);
        $stmtUpdate->bindParam(':email', $email);
        $stmtUpdate->bindParam(':phone_number', $phone_number);
        $stmtUpdate->bindParam(':address', $address);
        $stmtUpdate->bindParam(':role', $role);
        $stmtUpdate->bindParam(':team', $team);
        $stmtUpdate->bindParam(':status', $status);
        $stmtUpdate->bindParam(':id', $id);

        // Si se proporcionó una nueva contraseña, enlazarla también
        if (!empty($password)) {
            $stmtUpdate->bindParam(':password', $hashedPassword);
        }

        // Ejecutar la consulta
        $stmtUpdate->execute();

        // Respuesta exitosa
        http_response_code(200);
        echo json_encode(array("message" => "Información de usuario actualizada correctamente."));
    } catch (Exception $e) {
        // Error al actualizar la información del usuario
        error_log("Excepción al actualizar la información del usuario: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar la información del usuario."));
    }
}
?>
