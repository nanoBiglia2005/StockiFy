<?php
    require "config/DataBase.php";
    $user = 1;
    $userinv = execConsult("SELECT id FROM inventories WHERE user_id = $user");
    $inv = (int)$userinv[0]["id"];
    $initial_date = date("Y-m-d", strtotime("1900-01-01"));
    $final_date = date("Y-m-d");

    if (isset($_GET["initial"]) && !empty($_GET["initial"]) && isset($_GET["final"]) && !empty($_GET["final"])) {
        $initial_date = $_GET["initial"];
        $final_date = $_GET["final"];
    }

    $sales = execConsult("SELECT * FROM sales WHERE inventory_id = $inv AND sale_date BETWEEN '$initial_date' AND '$final_date'");
    $receipts = execConsult("SELECT * FROM receipts WHERE inventory_id = $inv AND sale_date BETWEEN '$initial_date' AND '$final_date'");
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Historial</title>
        <link rel="stylesheet" href="css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Lexend:wght@100..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Tektur:wght@400..900&display=swap" rel="stylesheet">
    </head>
    <body>
        <h2>Historial</h2>
        <form method="get" action="sale_history.php">
            <label>Fecha inicial <input type="date" name="initial"></label>
            <label>Fecha final <input type="date" name="final"></label>
            <button type="submit">Buscar</button>
        </form>
        <div class="history-section-header">
            <h3>Ventas</h3>
            <span class="toggle-arrow" data-target="sales">▼</span>
        </div>
        <div id="sales" class="history hidden">
            <ul>
            <?php 
            $s = 1;
            foreach ($sales as $item){
                $current_id = (int)$item["id"];
                $client = execConsult("SELECT customer_id FROM sales WHERE id = $current_id");
                $client_id = (int)$client[0]["customer_id"];
                $client_name = execConsult("SELECT full_name FROM customers WHERE id = $client_id");
                $saleProducts = execConsult("SELECT * FROM sale_items WHERE sale_id = $current_id");
                ?>
                <li>
                    <div class = "sale_stats">
                        <p><?php echo "Venta numero:" . $s . "Monto total:" . $item["total_amount"] . "Cliente:" . $client_name[0]["full_name"] . "Fecha y hora: " . $item["sale_date"];?></p>
                        <span class="toggle-arrow" data-target="sale-items-<?php echo $current_id; ?>">▼</span>
                    </div>
                    <div id="sale-items-<?php echo $current_id; ?>" class = "sale_items hidden">
                        <ul>
                        <?php foreach($saleProducts as $itemProduct){ ?>
                            <li>
                            <p><?php echo "Producto:" . $itemProduct["product_name"]?></p>
                            <p><?php echo " Cantidad: " . $itemProduct["quantity"] ?></p>
                            <p><?php echo " Precio por unidad: " . $itemProduct["unit_price"]?></p>
                            </li>
                        <?php } ?>
                        </ul>
                    </div>
                </li>
            <?php $s++;} ?>
            </ul>
        </div>
        <div class="history-section-header">
            <h3>Compras</h3>
            <span class="toggle-arrow" data-target="purchases">▼</span>
        </div>
        <div id="purchases" class="history hidden">
            <ul>
                <?php 
                $c = 1;
                foreach ($receipts as $item){
                    $current_id = (int)$item["id"];
                    $provider = execConsult("SELECT provider_id FROM receipts WHERE id = $current_id");
                    $provider_id = (int)$provider[0]["supplier_id"];
                    $provider_name = execConsult("SELECT full_name FROM providers WHERE id = $provider_id");
                    $purchase_items = execConsult("SELECT * FROM receipt_items WHERE receipt_id = $current_id AND sale_date BETWEEN '$initial_date' AND '$final_date'");
                ?>
                <li>
                    <div class = "purchase_stats">
                        <p><?php echo "Compra numero:" . $c . "Monto total:" . $item["total_amount"] . "Proveedor:" . $provider_name[0]["full_name"] . "Fecha y hora: " . $item["sale_date"];?></p>
                        <span class="toggle-arrow" data-target="purchase-items-<?php echo $current_id; ?>">▼</span>
                    </div>
                    <div id="purchase-items-<?php echo $current_id; ?>" class = "purchase_items hidden">
                        <ul>
                        <?php foreach($purchase_items as $itemStock){ ?>
                            <li>
                            <p><?php echo "Producto:" . $itemStock["product_name"]?></p>
                            <p><?php echo " Cantidad: " . $itemStock["quantity"]?></p>
                            <p><?php echo " Precio por unidad: " . $itemStock["unit_price"]?></p>
                            </li>
                            <?php } ?>
                        </ul>
                    </div>
                </li>
                </div>
                <?php $c++; } ?>
            </ul>

        
        <?php
            $salesU = execConsult("SELECT * FROM sales WHERE user_id = $user");
            $userN = execConsult("SELECT full_name FROM users WHERE id = $user");
            $grossingT = 0;
            $grossingU = 0;
            $spended = 0;
            foreach ($sales as $item){
                $grossingT += $item['total_amount'];
            }
            foreach ($salesU as $item){
                $grossingU += $item['total_amount'];
            }
            foreach($receipts as $item){
                $spended += $item['total_amount'];
            }

            $resume = $grossingT - $spended;
        ?>
        </div>
        <div class="bussines-section-header">
            <h2>Estadisticas</h2>
        </div>
        <div class="bussines-stats">
            <div class="brute-sales">
                <h3>Generado en ventas</h3>
                <p> <?php echo "Ventas brutas : " . $grossingT; ?> </p>
                <p> <?php echo "Ventas generadas por " . $userN[0]["full_name"] . ":" . $grossingU;?> </p>
            </div>
            <div class="spendings">
                <h3>Gastos en compras</h3>
                <p> <?php echo "Gastos en compra de Stock: " . $spended; ?> </p>
            </div>
            <div class="resume">
                <h3>Resumen</h3>
                <p> <?php echo "Estado : " . $resume; ?>/p>
            </div>
        </div>
    <script>
        document.querySelectorAll('.toggle-arrow').forEach(arrow => {
            arrow.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                targetElement.classList.toggle('hidden');
                if (this.textContent === '▼') {
                    this.textContent = '▲';
                } else {
                    this.textContent = '▼';
                }
            });
        });
    </script>
    </body>
</html>