<?php
require "Database.php";
$user_id = 1;
$userinv = execConsult("SELECT id FROM inventories WHERE user_id = $user_id");
$inv = (int)$userinv[0]["id"];

$tablas = execConsult("SELECT * FROM user_tables WHERE inventory_id = $inv");
$tablaSeleccionada= $tablas[0]["id"];
if (empty($userinv)) {
    echo json_encode(['error' => 'No inventory found for this user.']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['fechas']) || !is_array($data['fechas'])) {
    $listaFechas = [];
} else {
    $listaFechas = $data['fechas'];
}

$stockVendidoGeneral = [];
$stockIngresadoGeneral = [];
$ingresosBrutosGeneral = [];
$promedioVentaGeneral = [];
$gastosGeneral = [];
$gananciaGeneral = [];

$stockVendidoTabla = [];
$stockIngresadoTabla = [];
$ingresosBrutosTabla = [];
$promedioVentaTabla = [];
$gastosTabla = [];
$gananciaTabla = [];

foreach ($listaFechas as $fecha) {
    // validar formato de fecha (espera YYYY-MM-DD)
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $fechaSQL = $fecha;
    } else {
        // fallback: usar fecha actual si el formato es incorrecto
        $fechaSQL = date('Y-m-d');
    }

    // consultas para estadisticas generales
    $stockVendido = execConsult("SELECT SUM(si.quantity) AS total FROM sale_items si JOIN sales s ON si.sale_id = s.id WHERE s.inventory_id = $inv AND DATE(s.sale_date) = '$fechaSQL'");
    $stockIngresado = execConsult("SELECT SUM(ri.quantity) AS total FROM receipt_items ri JOIN receipts r ON ri.receipt_id = r.id WHERE r.inventory_id = $inv AND DATE(r.sale_date) = '$fechaSQL'");
    $ingresosBrutos = execConsult("SELECT SUM(total_amount) AS total FROM sales WHERE inventory_id = $inv AND DATE(sale_date) = '$fechaSQL'");
    $promedioVenta = execConsult("SELECT AVG(total_amount) AS total FROM sales WHERE inventory_id = $inv AND DATE(sale_date) = '$fechaSQL'");
    $gastos = execConsult("SELECT SUM(total_ammount) AS total FROM receipts WHERE inventory_id = $inv AND DATE(sale_date) = '$fechaSQL'");

    // convertir a tipos numéricos (no formatear aquí)
    $stockVendidoVal = (int)($stockVendido[0]['total'] ?? 0);
    $stockIngresadoVal = (int)($stockIngresado[0]['total'] ?? 0);
    $ingresosBrutosVal = (float)($ingresosBrutos[0]['total'] ?? 0.0);
    $promedioVentaVal = (float)($promedioVenta[0]['total'] ?? 0.0);
    $gastosVal = (float)($gastos[0]['total'] ?? 0.0);
    $gananciaVal = $ingresosBrutosVal - $gastosVal;

    // push a arrays generales
    $stockVendidoGeneral[] = $stockVendidoVal;
    $stockIngresadoGeneral[] = $stockIngresadoVal;
    $ingresosBrutosGeneral[] = $ingresosBrutosVal;
    $promedioVentaGeneral[] = $promedioVentaVal;
    $gastosGeneral[] = $gastosVal;
    $gananciaGeneral[] = $gananciaVal;

    //Consultas para tabla
    $stockVendidoT = execConsult("SELECT SUM(si.quantity) AS total FROM sale_items si JOIN sales s ON si.sale_id = s.id WHERE s.inventory_id = $inv AND DATE(s.sale_date) = '$fechaSQL' AND user_table_id = $tablaSeleccionada");
    $stockIngresadoT = execConsult("SELECT SUM(ri.quantity) AS total FROM receipt_items ri JOIN receipts r ON ri.receipt_id = r.id WHERE r.inventory_id = $inv AND DATE(r.sale_date) = '$fechaSQL' AND user_table_id = $tablaSeleccionada");
    $ingresosBrutosT = execConsult("SELECT SUM(si.quantity * si.unit_price) AS total FROM sale_items si JOIN sales s ON s.id = si.sale_id WHERE s.inventory_id = $inv AND DATE(s.sale_date) = '$fechaSQL'");
    $promedioVentaT = execConsult("SELECT AVG(si.quantity * si.unit_price) AS total FROM sale_items si JOIN sales s ON s.id = si.sale_id WHERE s.inventory_id = $inv AND DATE(s.sale_date) = '$fechaSQL'");
    $gastosT = execConsult("SELECT SUM(ri.quantity * ri.unit_price) AS total FROM receipt_items ri JOIN receipts r ON r.id = ri.receipt_id WHERE r.inventory_id = $inv AND DATE(r.sale_date) = '$fechaSQL'");

    //convertir valores tablas a numericos
    $stockVendidoValT = (int)($stockVendidoT[0]['total'] ?? 0.0);
    $stockIngresadoValT = (int)($stockIngresadoT[0]['total'] ?? 0.0);
    $ingresosBrutosValT = (float)($ingresosBrutosT[0]['total'] ?? 0.0);
    $promedioVentaValT = (float)($promedioVentaT[0]['total'] ?? 0.0);
    $gastosValT = (float)($gastosT[0]['total'] ?? 0.0);
    $gananciaValT = $ingresosBrutosValT - $gastosValT;


    // para tablas/productos (si no hay cálculo específico aún, duplicar general)
    $stockVendidoTabla[] = $stockVendidoValT;
    $stockIngresadoTabla[] = $stockIngresadoValT;
    $ingresosBrutosTabla[] = $ingresosBrutosValT;
    $promedioVentaTabla[] = $promedioVentaValT;
    $gastosTabla[] = $gastosValT;
    $gananciaTabla[] = $gananciaValT;
}

$response = [
    'stockVendidoGeneral' => $stockVendidoGeneral,
    'stockIngresadoGeneral' => $stockIngresadoGeneral,
    'ingresosBrutosGeneral' => $ingresosBrutosGeneral,
    'gastosGeneral' => $gastosGeneral,
    'gananciaGeneral' => $gananciaGeneral,
    'promedioVentaGeneral' => $promedioVentaGeneral,

    'stockVendidoTable' => $stockVendidoTabla,
    'stockIngresadoTable' => $stockIngresadoTabla,
    'ingresosBrutosTable' => $ingresosBrutosTabla,
    'gastosTable' => $gastosTabla,
    'gananciaTable' => $gananciaTabla,
    'promedioVentaTable' => $promedioVentaTabla,

    // product-specific (duplicados por ahora)
    'stockVendidoProduct' => $stockVendidoGeneral,
    'stockIngresadoProduct' => $stockIngresadoGeneral,
    'ingresosBrutosProduct' => $ingresosBrutosGeneral,
    'gastosProduct' => $gastosGeneral,
    'gananciaProduct' => $gananciaGeneral,
    'promedioVentaProduct' => $promedioVentaGeneral
];

header('Content-Type: application/json');
echo json_encode($response, JSON_NUMERIC_CHECK);