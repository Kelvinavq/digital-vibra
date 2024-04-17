<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener el ID del usuario de la URL
    $userId = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$userId) {
        // Si no se proporciona el ID del usuario, devolver un mensaje de error
        http_response_code(400);
        echo json_encode(array("message" => "No se proporcionó el ID del usuario."));
        exit();
    }

    try {
        // Consultar los detalles del usuario con el ID proporcionado
        $query = "SELECT u.id, u.name, u.email, u.phone_number, u.address, u.profile_picture, u.registration_time, u.registration_date, u.role, u.team, u.status, t.name AS team_name FROM users u LEFT JOIN teams t ON u.team = t.id WHERE u.id = :userId";

        // Preparar la consulta
        $statement = $conexion->prepare($query);

        // Bind del parámetro :userId
        $statement->bindParam(':userId', $userId, PDO::PARAM_INT);

        // Ejecutar la consulta
        $statement->execute();

        // Obtener los resultados
        $userDetails = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$userDetails) {
            // Si no se encuentran detalles para el usuario con el ID proporcionado, devolver un mensaje de error
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron detalles para el usuario con el ID proporcionado."));
            exit();
        }

        // Si se encontraron detalles, devolver los detalles del usuario en formato JSON
        http_response_code(200);
        echo json_encode($userDetails);
    } catch (PDOException $e) {
        // Log de la excepción
        error_log("Excepción al obtener los detalles del usuario: " . $e->getMessage());

        // Devolver un mensaje de error en caso de excepción
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener los detalles del usuario. Por favor, inténtalo de nuevo más tarde."));
    }
}
?>
