<?php
$json = file_get_contents('php://input');
$data = json_decode($json, true);


$fechaDesde = $data['fechaDesde'];
$fechaHasta = $data['fechaHasta'];
$id = $data['id'];

//CONSULTA SQL CON LOS VALORES DE LA FECHA

$stockVendidoGeneral = [152,72,12,74];
$stockIngresadoGeneral = [163,42,23,11];
$ingresosBrutosGeneral = [621000,235000,12365,10006];
$gastosGeneral = [300000,300000,300000,300000];
$gananciaGeneral = [$ingresosBrutosGeneral[0]-$gastosGeneral[0],$ingresosBrutosGeneral[1]-$gastosGeneral[1],$ingresosBrutosGeneral[2]-$gastosGeneral[2],$ingresosBrutosGeneral[3]-$gastosGeneral[3]];
$promedioVentaGeneral = [3006.5,204.2,2263,77031];

$response = ['stockVendidoGeneral' => $stockVendidoGeneral, 'stockIngresadoGeneral' => $stockIngresadoGeneral, 'ingresosBrutosGeneral' => $ingresosBrutosGeneral,
    'gastosGeneral' => $gastosGeneral, 'gananciaGeneral' => $gananciaGeneral, 'promedioVentaGeneral' => $promedioVentaGeneral, 'fechaDesde' => $fechaDesde, 'fechaHasta' => $fechaHasta];


header('Content-Type: application/json');
echo json_encode($response);