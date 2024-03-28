<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(strip_tags($_POST['name']));
    $description = htmlspecialchars(strip_tags($_POST['description']));
    $link = htmlspecialchars(strip_tags($_POST['link']));
    $imagePortrait = $_FILES['image_portrait'];
    $imageLandscape = $_FILES['image_landscape'];

    // Directorio donde se guardarán las imágenes
    $uploadDirectory = "../../public/portfolio/";

    // Nombre de archivo único para la imagen vertical
    $imagePortraitName = uniqid() . '_' . basename($imagePortrait['name']);
    $imagePortraitPath = $uploadDirectory . $imagePortraitName;

    // Nombre de archivo único para la imagen horizontal
    $imageLandscapeName = uniqid() . '_' . basename($imageLandscape['name']);
    $imageLandscapePath = $uploadDirectory . $imageLandscapeName;

    // Mover la imagen vertical al directorio de subidas
    if (move_uploaded_file($imagePortrait['tmp_name'], $imagePortraitPath)) {
        // Mover la imagen horizontal al directorio de subidas
        if (move_uploaded_file($imageLandscape['tmp_name'], $imageLandscapePath)) {
            try {
                $insertProjectQuery = "INSERT INTO portfolio (name, description, link, image_portrait, image_landscape) VALUES (:name, :description, :link, :imagePortrait, :imageLandscape)";
                $stmt = $conexion->prepare($insertProjectQuery);
                $stmt->bindParam(':name', $name);
                $stmt->bindParam(':description', $description);
                $stmt->bindParam(':link', $link);
                $stmt->bindParam(':imagePortrait', $imagePortraitName);
                $stmt->bindParam(':imageLandscape', $imageLandscapeName);

                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Proyecto registrado con éxito."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Error al registrar el proyecto."));
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(array("message" => "Error al registrar el proyecto: " . $e->getMessage()));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al mover la imagen horizontal al directorio de subidas."));
        }
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Error al mover la imagen vertical al directorio de subidas."));
    }
}
?>
