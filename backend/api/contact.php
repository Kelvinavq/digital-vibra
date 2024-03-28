<?php
include("../cors.php");

try {
    // Decodificar el cuerpo de la solicitud JSON
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validar y limpiar los datos
    $nombre = isset($data['nombre']) ? filter_var($data['nombre'], FILTER_SANITIZE_STRING) : null;
    $correo = isset($data['correo']) ? filter_var($data['correo'], FILTER_SANITIZE_EMAIL) : null;
    $telefono = isset($data['telefono']) ? filter_var($data['telefono'], FILTER_SANITIZE_STRING) : null;
    $mensaje = isset($data['mensaje']) ? filter_var($data['mensaje'], FILTER_SANITIZE_STRING) : null;

    // Verificar si los datos requeridos están presentes
    if (!$nombre || !$correo || !$telefono || !$mensaje) {
        http_response_code(400); // Bad request
        echo json_encode(array("error" => "Todos los campos son obligatorios"));
        exit;
    }

    $adminEmail = "digitalvibra@gmail.com";

    // Construir el mensaje de contacto
    $messageContact = "Datos del usuario: \n";
    $messageContact .= "Nombre y Apellido: " . $nombre . "\n";
    $messageContact .= "Correo electrónico: " . $correo . "\n";
    $messageContact .= "Teléfono: " . $telefono . "\n";
    $messageContact .= "Mensaje: " . $mensaje . "";

    // Configurar el correo electrónico
    $to ="nahuelvelizfx@gmail.com, kvalera200244@gmail.com";
    $subject = "Formulario de Vibra Digital";
    $message = $messageContact;
    $headers = 'From: ' . $adminEmail . "\r\n" .
               'Reply-To: ' . $adminEmail . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    // Enviar el correo electrónico
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(array("success" => "El correo electrónico se ha enviado correctamente"));
    } else {
        http_response_code(500);
        echo json_encode(array("error" => "Error al enviar correo electrónico"));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("error" => "Error al enviar correo electrónico: " . $e->getMessage()));
}
?>
