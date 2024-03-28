<?php
include("../cors.php");
include("../config/Config.php");

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $name = htmlspecialchars(strip_tags($_POST['name']));
    $message = htmlspecialchars(strip_tags($_POST['message']));

    // Verificar si se proporcionó una imagen y si no está vacía
    $image = !empty($_FILES['image']) ? $_FILES['image'] : null;

    // Validar que los campos obligatorios no estén vacíos
    if (empty($name) || empty($message)) {
        http_response_code(400);
        echo json_encode(array("error" => "Por favor, complete todos los campos obligatorios."));
        exit();
    }

    // Procesar la imagen si se proporcionó y no está vacía
    $imageFileName = null;
    if (!empty($image) && $image['error'] === UPLOAD_ERR_OK) {
        // Obtener la extensión del archivo
        $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
        // Generar un nombre único para la imagen
        $imageFileName = uniqid() . '.' . $extension;
        // Ruta donde se guardará la imagen
        $targetPath = '../public/testimonials/' . $imageFileName;
        // Mover la imagen al directorio de uploads
        if (!move_uploaded_file($image['tmp_name'], $targetPath)) {
            http_response_code(500);
            echo json_encode(array("error" => "Error al subir la imagen."));
            exit();
        }
    }

    try {
        // Insertar el testimonio en la base de datos
        $query = "INSERT INTO testimonials (name, testimonial, image, status) VALUES (:name, :message, :image, 'inactive')";
        $statement = $conexion->prepare($query);
        $statement->bindParam(':name', $name);
        $statement->bindParam(':message', $message);
        $statement->bindParam(':image', $imageFileName);
        $statement->execute();

        http_response_code(201);
        echo json_encode(array("message" => "Testimonio enviado con éxito."));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Error al procesar el testimonio."));
    }
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(array("error" => "Método no permitido."));
}
?>
