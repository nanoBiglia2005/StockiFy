<?php
    require "config/DataBase.php";
    $user = 1;
    $userinv = execConsult("SELECT id FROM inventories WHERE user_id = $user");
    $inv = (int)$userinv[0]["id"];
    $salesT = execConsult("SELECT * FROM sales WHERE inventory_id = $inv");
    $salesU = execConsult("SELECT * FROM sales WHERE user_id = $user");
    $userN = execConsult("SELECT full_name FROM users WHERE id = $user");
    $grossingT = 0;
    $grossingU = 0;
    foreach ($salesT as $item){
        $grossingT += $item['total_amount'];
    }
    foreach ($salesU as $item){
        $grossingU += $item['total_amount'];
    }
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Estadisticas</title>
        <link rel="stylesheet" href="./css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Lexend:wght@100..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Tektur:wght@400..900&display=swap" rel="stylesheet">
    </head>
    <body>
            <div class="ganancias brutas">
                <p> <?php echo "Ganancias brutas : " . $grossingT; ?> </p>
                <p> <?php echo "Ganancias generadas por " . $userN[0]["full_name"] . ":" . $grossingU;?> </p>
            </div>
    </body>
</html>