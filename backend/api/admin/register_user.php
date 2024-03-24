<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name = htmlspecialchars(strip_tags($data['name']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $password = password_hash(htmlspecialchars(strip_tags($data['password'])), PASSWORD_BCRYPT);
    $phone_number = htmlspecialchars(strip_tags($data['phone_number']));
    $address = htmlspecialchars(strip_tags($data['address']));
    $role = htmlspecialchars(strip_tags($data['role']));
    $team_id = null;
    if ($role === 'setter') {
        $team_id = htmlspecialchars(strip_tags($data['team_id']));
    }
    $profile_picture = "default.jpg";
    $fechaActual = date('d-m-Y');
    $horaActual = date('H:i:s');
    $pre_link_setter = htmlspecialchars(strip_tags($data['link_setter']));


    try {

        // Verificar si el correo electrónico ya está registrado
        $checkEmailQuery = "SELECT COUNT(*) AS count FROM users WHERE email = :email";
        $stmtCheckEmail = $conexion->prepare($checkEmailQuery);
        $stmtCheckEmail->bindParam(':email', $email);
        $stmtCheckEmail->execute();
        $emailResult = $stmtCheckEmail->fetch(PDO::FETCH_ASSOC);


        if ($emailResult['count'] > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "El correo electrónico ya está registrado."));
            exit;
        }


        //code...
        $insertUser = "INSERT INTO users (name, email, password, phone_number, address, profile_picture, registration_time, registration_date, role, team) VALUES(:name, :email, :password, :phone_number, :address, :profile_picture, :registration_time, CURRENT_DATE(), :role, :team)";

        $stmt = $conexion->prepare($insertUser);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':phone_number', $phone_number);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':profile_picture', $profile_picture);
        $stmt->bindParam(':registration_time', $horaActual);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':team', $team_id);

        if ($stmt->execute()) {

            if ($role === "setter") {
                # code...
                $userId = $conexion->lastInsertId();

                // Generar un número de matrícula aleatorio único
                $matricula = generarMatriculaUnica($conexion);

                $matricula_formatted = str_replace([' ', '-'], '', $matricula);
                $link_setter = $pre_link_setter . $matricula_formatted;

                // Insertar el número de matrícula en la tabla 'setter_info'
                $insertMatricula = "INSERT INTO setter_info (user_id, matricula, cuenta_link) VALUES (:user_id, :matricula, :cuenta_link)";
                $stmtMatricula = $conexion->prepare($insertMatricula);
                $stmtMatricula->bindParam(':user_id', $userId);
                $stmtMatricula->bindParam(':matricula', $matricula);
                $stmtMatricula->bindParam(':cuenta_link', $link_setter);

                if ($stmtMatricula->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Usuario registrado con éxito."));
                } else {
                    // Error al insertar la matrícula
                    http_response_code(500);
                    echo json_encode(array("message" => "Error al registrar el número de matrícula."));
                }
            }
        } else {
            // Error en el registro
            http_response_code(500);
            echo json_encode(array("message" => "Error al registrar el usuario."));
        }
    } catch (Exception $e) {
        // Log de la excepción
        error_log("Excepción al registrar usuario: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Error al registrar el usuario."));
    }
}

// Función para generar un número de matrícula único
function generarMatriculaUnica($conexion)
{
    $matricula = '';

    do {
        // Generar un número de matrícula aleatorio en el formato deseado
        $matricula = sprintf("%03d - %03d", rand(0, 999), rand(0, 999));

        // Verificar si el número de matrícula ya existe en la tabla 'setter_info'
        $query = "SELECT COUNT(*) AS count FROM setter_info WHERE matricula = :matricula";
        $stmt = $conexion->prepare($query);
        $stmt->bindParam(':matricula', $matricula);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si el número de matrícula ya existe, generar otro número
    } while ($result['count'] > 0);

    return $matricula;
}
