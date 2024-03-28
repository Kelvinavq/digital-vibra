<?php
include("../../cors.php");
include("../../config/Config.php");

$conexion = obtenerConexion();
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $attendedMeeting = htmlspecialchars(strip_tags($data['attendedMeeting']));
    $note = htmlspecialchars(strip_tags($data['note']));
    $finalBudget = htmlspecialchars(strip_tags($data['finalBudget']));
    $commission = htmlspecialchars(strip_tags($data['commission']));
    $prospectId = $data['prospectId'];
    $idSetter = $data['id_setter'];
    $idTeam = $data['id_team'];

     // Obtener la fecha y hora actual
     $registeredDate = date('Y-m-d');
     $registeredTime = date('H:i:s');

    try {
        $insertProjectQuery = "INSERT INTO projects (id_setter, id_prospect, budget, commission, note, attended, status, registered_date, registered_time, created_at, team) VALUES (:idSetter, :prospectId, :finalBudget, :commission, :note, :attendedMeeting, 'pendiente', :registeredDate, :registeredTime, NOW(), :team)";
        $stmt = $conexion->prepare($insertProjectQuery);
        $stmt->bindParam(':idSetter', $idSetter);
        $stmt->bindParam(':prospectId', $prospectId);
        $stmt->bindParam(':finalBudget', $finalBudget);
        $stmt->bindParam(':commission', $commission);
        $stmt->bindParam(':note', $note);
        $stmt->bindParam(':attendedMeeting', $attendedMeeting);
        $stmt->bindParam(':registeredDate', $registeredDate);
        $stmt->bindParam(':registeredTime', $registeredTime);
        $stmt->bindParam(':team', $idTeam);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Datos del prospecto registrados con éxito en la tabla de proyectos."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al registrar los datos del prospecto en la tabla de proyectos."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al registrar los datos del prospecto en la tabla de proyectos: " . $e->getMessage()));
    }
}
?>
