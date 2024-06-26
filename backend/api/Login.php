<?php
include '../cors.php';
include("../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Método no permitido."));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Validar y escapar los datos para prevenir SQL injection
        $email = filter_var($data->email, FILTER_VALIDATE_EMAIL);
        $password = htmlspecialchars(strip_tags($data->password));

        // Buscar usuario por correo electrónico
        $buscarUsuario = "SELECT id, name, password, role, email, status FROM users WHERE email = :email";
        $stmtBuscar = $conexion->prepare($buscarUsuario);
        $stmtBuscar->bindValue(':email', $email);
        $stmtBuscar->execute();

        if ($stmtBuscar->rowCount() > 0) {
            // Usuario encontrado, verificar la contraseña
            $usuario = $stmtBuscar->fetch(PDO::FETCH_ASSOC);

            if ($usuario['status'] === 'active') {
                if (password_verify($password, $usuario['password'])) {
                    // Contraseña válida, iniciar sesión de forma segura
                    session_start();
                    session_regenerate_id(); // Regenerar el ID de la sesión para prevenir ataques de fijación de sesión
                    $_SESSION['user_id'] = $usuario['id'];
                    $_SESSION['user_name'] = $usuario['name'];
                    $_SESSION['user_role'] = $usuario['role'];
                    $_SESSION['user_email'] = $usuario['email'];

                    // Devolver información del usuario en la respuesta
                    http_response_code(200);
                    echo json_encode(array(
                        "message" => "Inicio de sesión exitoso.",
                        "user_id" => $usuario['id'],
                        "user_name" => $usuario['name'],
                        "user_role" => $usuario['role'],
                        "user_email" => $usuario['email'],
                    ));
                } else {
                    // Contraseña incorrecta
                    http_response_code(401); // Unauthorized
                    echo json_encode(array("error" => "Contraseña incorrecta."));
                }
            } else {
                // Usuario inactivo
                http_response_code(401); // Unauthorized
                echo json_encode(array("error" => "Su cuenta está suspendida. Por favor, contacte al administrador."));
            }
        } else {
            // Usuario no encontrado
            http_response_code(401); // Unauthorized
            echo json_encode(array("error" => "Usuario no encontrado."));
        }
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error interno del servidor."));
    } finally {
        // Cerrar la conexión después de usarla
        $conexion = null;
    }
}
