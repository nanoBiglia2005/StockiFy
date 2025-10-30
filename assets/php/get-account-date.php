<?php
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['id'])) {
    $userId = $data['id'];

    //CONSULTA A LA BASE DE DATOS UTILIZANDO EL ID

    $databaseDate = "2025-10-12 12:30:00";

    $timestamp = strtotime($databaseDate);
    $date = date("Y-m-d", $timestamp);

    $response = ['creationDate' => $date,'success' => true];
}
else{
    $response = ['creationDate' => null,'success' => false];
}

header('Content-Type: application/json');
echo json_encode($response);
