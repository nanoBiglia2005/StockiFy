<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Cliente</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>Crear Nuevo Cliente</h1>
        
        <?php
        require_once './assets/php/customer_functions.php';
        
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $resultado = createCustomer(
                $_POST['user_id'],
                $_POST['full_name'],
                $_POST['email'],
                $_POST['phone'],
                $_POST['address'],
                $_POST['tax_id']
            );

            if ($resultado['success']) {
                echo "<div class='alert success'>";
                echo "Cliente creado con éxito. ID: " . $resultado['customer_id'];
                echo "</div>";
                // Limpiar los datos del formulario en caso de éxito
                $_POST = array();
            } else {
                echo "<div class='alert error'>";
                echo "Error: " . $resultado['message'];
                echo "</div>";
            }
        }
        
        // Función helper para mantener los valores del formulario
        function getFormValue($field) {
            return isset($_POST[$field]) ? htmlspecialchars($_POST[$field]) : '';
        }
        ?>

        <?php
        // Obtener la lista de usuarios disponibles
        $users_query = "SELECT id, username, full_name FROM users ORDER BY username";
        $users = execConsult($users_query);
        ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="user_id">Usuario:</label>
                <select id="user_id" name="user_id" required>
                    <option value="">Seleccione un usuario</option>
                    <?php foreach ($users as $user): ?>
                        <option value="<?php echo $user['id']; ?>">
                            <?php echo htmlspecialchars($user['username']); ?> - 
                            <?php echo htmlspecialchars($user['full_name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="full_name">Nombre Completo:</label>
                <input type="text" id="full_name" name="full_name" required value="<?php echo getFormValue('full_name'); ?>">
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="<?php echo getFormValue('email'); ?>">
            </div>

            <div class="form-group">
                <label for="phone">Teléfono:</label>
                <input type="tel" id="phone" name="phone" value="<?php echo getFormValue('phone'); ?>">
            </div>

            <div class="form-group">
                <label for="address">Dirección:</label>
                <textarea id="address" name="address"><?php echo getFormValue('address'); ?></textarea>
            </div>

            <div class="form-group">
                <label for="tax_id">ID Fiscal:</label>
                <input type="text" id="tax_id" name="tax_id" value="<?php echo getFormValue('tax_id'); ?>">
            </div>

            <button type="submit">Crear Cliente</button>
        </form>
    </div>
</body>
</html>