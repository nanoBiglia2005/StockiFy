<?php
$json = file_get_contents('php://input');
$data = json_decode($json, true);


$listaFechas = $data['fechas'];
$id = $data['id'];

$stockVendidoGeneral = [];
$stockIngresadoGeneral = [];
$ingresosBrutosGeneral = [];
$promedioVentaGeneral = [];
$gastosGeneral = [];
$gananciaGeneral = [];
$stockIngresadoTabla = [];
$ingresosBrutosTabla = [];
$stockVendidoTabla = [];
$promedioVentaTabla= [];
$gastosTabla = [];
$gananciaTabla = [];

foreach ($listaFechas as $fecha) {
    $stockVendidoGeneral.array_push();
    $stockIngresadoGeneral.array_push();
    $ingresosBrutosGeneral.array_push();
    $promedioVentaGeneral.array_push();
    $gastosGeneral.array_push();
    $gananciaGeneral.array_push();
    $stockIngresadoTabla.array_push();
    $ingresosBrutosTabla.array_push();
    $stockVendidoTabla.array_push();
    $promedioVentaTabla.array_push();
    $gastosTabla.array_push();
    $gananciaTabla.array_push();
}
$response = ['stockVendidoGeneral' => $stockVendidoGeneral, 'stockIngresadoGeneral' => $stockIngresadoGeneral, 'ingresosBrutosGeneral' => $ingresosBrutosGeneral,
    'gastosGeneral' => $gastosGeneral, 'gananciaGeneral' => $gananciaGeneral, 'promedioVentaGeneral' => $promedioVentaGeneral,
    'stockVendidoTable' => $stockVendidoGeneral, 'stockIngresadoTable' => $stockIngresadoGeneral, 'ingresosBrutosTable' => $ingresosBrutosGeneral,
    'gastosTable' => $gastosGeneral, 'gananciaTable' => $gananciaGeneral, 'promedioVentaTable' => $promedioVentaGeneral,
    'stockVendidoProduct' => $stockVendidoGeneral, 'stockIngresadoProduct' => $stockIngresadoGeneral, 'ingresosBrutosProduct' => $ingresosBrutosGeneral,
    'gastosProduct' => $gastosGeneral, 'gananciaProduct' => $gananciaGeneral, 'promedioVentaProduct' => $promedioVentaGeneral];


header('Content-Type: application/json');
echo json_encode($response);