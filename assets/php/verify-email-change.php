<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../../vendor/autoload.php';

header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = filter_var($_POST['new-email'], FILTER_VALIDATE_EMAIL);
    if ($email) {
        $code = random_int(111111, 999999);
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'no.reply.stockify02@gmail.com';
            $mail->Password   = 'hcgu fjli kali vbcw';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('no.reply.stockify02@gmail.com','Verificacion de StockiFy');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Verificacion por cambio de dirección de Correo';
            $mail->Body = 'Hola, '.$_POST['name'].' Has solicitado un cambio de E-Mail para tu cuenta de StockiFy.'.
                '\n\nTu codigo es <b>'.$code.'</b>.\n\n\n\nSi no solicitaste este cambio, ignora este mensaje.';
            $mail->send();
        }

        catch (Exception $e) {
            $response['success'] = false;
            $response['message'] = "Ha ocurrido un error intero. No se pudo enviar el correo electronico.{$mail->ErrorInfo}";
        }
    }
    else{
        $response['success'] = false;
        $response['message'] = 'No se pudo verificar el correo. Revise si fue ingresado correctamente.';
    }
}

echo json_encode($response);
