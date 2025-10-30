<?php
session_start();
$_SESSION['user_id'] = 100;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockiFy</title>
    <script>
        const userID = <?php echo isset($_SESSION['user_id']) ? htmlspecialchars($_SESSION['user_id']) : null; ?>
    </script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="assets/js/theme.js"></script>
    <script src="assets/js/estadisticas-handler.js"></script>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body id="page-index" data-user-id="">
<div id="grey-background" class="hidden">
    <p id="msj-bubble" class="view-container"></p>
</div>
<header>
    <a href="/" id="header-logo">
        <img src="assets/img/LogoE.png" alt="Stocky Logo">
    </a>
    <nav id="header-nav">
    </nav>
</header>

<main class="text-left flex-row" style="padding: 0; overflow: hidden; align-items: stretch">
    <div id="grafico-estadistica"></div>
    <div class="flex-column" id="estadisticas-menu-container">
    </div>
    <div class="flex-column" id="estadisticas-main-container">
        <div class="flex-row justify-between" id="estadisticas-fecha-container">
        </div>
        <div class="estadisticas-container">
        <h1>Estadisticas Generales</h1>
        <h4>(Todas tus bases de datos, todos tus productos)</h4>
        <div id="estadisticas-generales-container">
            <div class="flex-column estadistica-item-container" id="ganancias-general">
                <h1>Ganancias</h1>
                <h3></h3>
            </div>
            <div class="flex-column estadistica-item-container" id="ingresos-brutos-general">
                <h1>Ingresos Brutos</h1>
                <h3></h3>
            </div>
            <div class="flex-column estadistica-item-container" id="gastos-general">
                <h1>Gastos</h1>
                <h3></h3>
            </div>
            <div class="flex-column estadistica-item-container" id="ventas-general">
                <h1>Stock Vendido</h1>
                <h3></h3>
            </div>
            <div class="flex-column estadistica-item-container" id="ingresos-stock-general">
                <h1>Stock Ingresado</h1>
                <h3></h3>
            </div>
            <div class="flex-column estadistica-item-container" id="promedio-venta-general">
                <h1>Precio Promedio por Venta</h1>
                <h3></h3>
            </div>
        </div>
        </div>
    </div>
</main>
</body>
</html>
