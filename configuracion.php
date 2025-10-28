<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockiFy</title>
    <script src="assets/js/theme.js"></script>
    <script src="assets/js/show_password.js"></script>
    <script src="assets/js/config-changes-monitoring.js"></script>
    <script src="assets/js/config-option-selection.js"></script>
    <script src="assets/js/modif-buttons-controls.js"></script>
    <script src="assets/js/fecth-email-change.js"></script>
    <link rel="stylesheet" href="assets/css/main.css">
</head>

<?php
    $current_user = [
            "name" => "Stefano",
            "surname" => "Biglia",
            "email" => "biglistefano2005@gmail.com",
            "password" => "contraseña",
    ];

    if (!$current_user){
        header("Location: index.php");
        exit;
    }
?>
<div id="grey-background" class="hidden">
    <p id="msj-bubble"></p>
</div>
<body id="page-index">
    <header>
        <a href="/" id="header-logo">
            <img src="assets/img/LogoE.png" alt="Stocky Logo">
        </a>
        <nav id="header-nav">
        </nav>
    </header>

    <main class="text-left">
        <div class="flex-row" style="margin: 3rem 0 3rem 0;">
            <div id="options-config-container">
                <div class="btn btn-option-selected" id="btn-config-cuenta">
                    <p>Mi Cuenta</p>
                </div>
                <div class="btn" id="btn-config-modifs">
                    <p>Registro de Modificaciones</p>
                </div>
                <div class="btn" id="btn-config-soporte">
                    <p>Soporte</p>
                </div>
            </div>
            <div class="flex-column" id="config-container">
                <form class="flex-column justify-left align-center" method="post" action="./configuracion.php" id="form-micuenta">
                    <label for="nombre" style="margin-top: 0">Nombre</label>
                    <input class="config-input" type="text" id="nombre" name="name" value=<?php echo $current_user['name']?>>

                    <label for="apellido">Apellido</label>
                    <input class="config-input" type="text" id="apellido" name="surname" value=<?php echo $current_user['surname']?>>

                    <label for="email">Email</label>
                    <input class="input-locked config-input" type="email" id="email" name="email" value=<?php echo $current_user['email']?> readonly>
                    <p class="btn btn-modificar" style="margin-bottom: 0" id="btn-modif-email">Modificar Email</p>

                    <label for="contraseña-hidden">Contraseña</label>
                    <div class="flex-row all-center" style="gap: 0.3rem;">
                        <input class="input-locked" type="text" id="contraseña-fake" value="************" disabled>
                        <input class="input-locked hidden config-input" type="text" id="contraseña" name="password" value=<?php echo $current_user['password']?> readonly>
                        <div id='btn-password' class="btn flex-row all-center"><img src="./assets/img/password-hidden.png" id="pass-img"></div>
                    </div>
                    <p class="btn btn-modificar" id="btn-modif-pass">Modificar Contraseña</p>

                    <button class="btn" id="btn-guardar" disabled >Guardar Cambios</button>
                </form>
            </div>
        </div>
        <div class="view-container flex-column justify-left align-center hidden" id="modif-form-container">
            <p id="return-btn">Volver</p>
            <form style="margin-top: 2rem" id="email-form">
                <label for="new-email" class="text-left"><h2>Nuevo E-Mail</h2></label>
                <input type="email" id="new-email" name='new-email' placeholder="ejemplo@gmail.com" required>
                <input type="email" name="old-email" <?php echo $current_user['email']?> hidden readonly>
                <input type="text" name="name" <?php echo $current_user['name']?> hidden readonly>
                <button type="submit" class="btn" style="margin-top: 8rem;">Confirmar</button>
            </form>
        </div>
    </main>
</body>
</body>
</html>