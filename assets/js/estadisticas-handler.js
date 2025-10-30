
document.addEventListener('DOMContentLoaded', () => {
    const todayDateNoFormat = new Date();
    const todayDate = formatDate(todayDateNoFormat);

    var creationDate;
    var creationDateNoFormat;

    fetch('./assets/php/get-account-date.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id : userID})
    }).then(response => response.json())
        .then(data => {
            if (!data.success){
                creationDateNoFormat = new Date();
                creationDate = formatDate(creationDateNoFormat);
            }
            else{
                creationDateNoFormat = new Date(data.creationDate.replace(/-/g, '\/'));
                creationDate = formatDate(creationDateNoFormat);
            }

            const estadisticasFechaContainer = document.getElementById('estadisticas-fecha-container');

            estadisticasFechaContainer.innerHTML = `<div class="flex-column" id="estadisticas-fecha-desde">
                                                <h4>${creationDate.day} ${creationDate.date} de ${creationDate.month} de ${creationDate.year}</h4>
                                                    <p>Desde</p>          
                                            </div>
                                            <input type="date" class="hidden" id="fecha-desde-elegida">
                                            <div class="flex-column" id="estadisticas-fecha-hasta">
                                                <h4>${todayDate.day} ${todayDate.date} de ${todayDate.month} de ${todayDate.year}</h4>
                                                <p>Hasta</p>
                                            </div>
                                            <input type="date" class="hidden" id="fecha-hasta-elegida">`

            actualizarEstadisticas(creationDateNoFormat,todayDateNoFormat);

            const fechaDesdeBtn = document.getElementById('estadisticas-fecha-desde');
            const fechaHastaBtn = document.getElementById('estadisticas-fecha-hasta');

            const fechaDesdeInput = document.getElementById('fecha-desde-elegida');
            const fechaHastaInput = document.getElementById('fecha-hasta-elegida');

            fechaHastaInput.min = creationDateNoFormat.toISOString().slice(0,10);
            fechaDesdeInput.min = creationDateNoFormat.toISOString().slice(0,10);

            var fechaDesde = creationDate;
            var fechaHasta = todayDate;
            var fechaDesdeNoFormat = creationDateNoFormat;
            var fechaHastaNoFormat = todayDateNoFormat;

            fechaDesdeBtn.addEventListener('click',function() {
                fechaDesdeInput.showPicker();
            })

            fechaDesdeInput.addEventListener('input', function() {
                fechaDesdeNoFormat = new Date(this.value.replace(/-/g, '\/'));

                const phpDesdeDate = fechaDesdeNoFormat;
                const phpHastaDate = fechaHastaNoFormat;

                fechaHastaInput.min = this.value;

                fechaDesde = formatDate(fechaDesdeNoFormat);
                fechaDesdeBtn.querySelector('h4').textContent = `${fechaDesde.day} ${fechaDesde.date} de ${fechaDesde.month} de ${fechaDesde.year}`
                fechaHastaBtn.querySelector('h4').textContent = `${fechaHasta.day} ${fechaHasta.date} de ${fechaHasta.month} de ${fechaHasta.year}`

                actualizarEstadisticas(phpDesdeDate,phpHastaDate);
            })

            fechaHastaBtn.addEventListener('click',function() {
                fechaHastaInput.showPicker();
            })

            fechaHastaInput.addEventListener('input', function() {
                fechaHastaNoFormat = new Date(this.value.replace(/-/g, '\/'));

                const phpDesdeDate = fechaDesdeNoFormat;
                const phpHastaDate = fechaHastaNoFormat;

                fechaHasta = formatDate(fechaHastaNoFormat);
                fechaDesdeBtn.querySelector('h4').textContent = `${fechaDesde.day} ${fechaDesde.date} de ${fechaDesde.month} de ${fechaDesde.year}`
                fechaHastaBtn.querySelector('h4').textContent = `${fechaHasta.day} ${fechaHasta.date} de ${fechaHasta.month} de ${fechaHasta.year}`

                actualizarEstadisticas(phpDesdeDate,phpHastaDate);
            })
        })

})

function formatDate(ogDate){
    const todayDate = ogDate.toLocaleString('es-AR', {day : 'numeric'});
    const todayDay = ogDate.toLocaleString('es-AR', {weekday : 'long'}).charAt(0).toUpperCase() + ogDate.toLocaleString('es-AR', {weekday : 'long'}).slice(1);
    const todayMonth = ogDate.toLocaleString('es-AR', {month : 'long'}).charAt(0).toUpperCase() + ogDate.toLocaleString('es-AR', {month : 'long'}).slice(1);
    const todayYear = ogDate.toLocaleString('es-AR', {year : 'numeric'});

    return {'date' : todayDate,'day' : todayDay,'month' : todayMonth,'year' : todayYear};
}

function actualizarEstadisticas(fechaDesde, fechaHasta)
{
    fechaDesde = fechaDesde.toISOString().slice(0,10);
    fechaHasta = fechaHasta.toISOString().slice(0,10);
    fetch('./assets/php/update-statistics.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fechaDesde : fechaDesde,fechaHasta : fechaHasta, id : userID})

    }).then(response => response.json())
        .then(dailyData => {

            const groupedData = formatStatData(dailyData);
            const ventasGeneral =  document.getElementById('ventas-general');
            const gananciasGeneral = document.getElementById('ganancias-general');
            const ingresosBrutosGeneral = document.getElementById('ingresos-brutos-general');
            const ingresosStockGeneral = document.getElementById('ingresos-stock-general');
            const gastosGeneral = document.getElementById('gastos-general');
            const promedioVentaGeneral = document.getElementById('promedio-venta-general');


            ventasGeneral.querySelector('h3').textContent = `${groupedData.stockVendidoGeneral} unidad${(groupedData.stockVendidoGeneral > 1) ? 'es' : ''}`;
            gananciasGeneral.querySelector('h3').textContent = `$${groupedData.gananciasGeneral}`;
            ingresosBrutosGeneral.querySelector('h3').textContent = `$${groupedData.ingresosBrutosGeneral}`;
            ingresosStockGeneral.querySelector('h3').textContent = `${groupedData.ingresosStockGeneral} unidad${(groupedData.ingresosStockGeneral > 1) ? 'es' : ''}`;
            gastosGeneral.querySelector('h3').textContent = `$${groupedData.gastosGeneral}`;
            promedioVentaGeneral.querySelector('h3').textContent = `$${groupedData.promedioVentaGeneral}`;

            const graficoContainer = document.getElementById('grafico-estadistica');

            const options = {
                chart:{
                    type: 'area',
                    height: 350
                },
                series: [{
                    name: 'Prueba',
                    data: dailyData.stockVendidoGeneral
                }],
                xaxis: {
                    categories: [dailyData.fechaDesde, dailyData.fechaHasta]
                }
            };

            const chart = new ApexCharts(graficoContainer,options);
            chart.render();
        })
}

function formatStatData(data) {

    const stockVendidoGeneral = data.stockVendidoGeneral.reduce((acum,valor) => {
        return acum + valor;
    })
    const ingresosStockGeneral = data.stockIngresadoGeneral.reduce((acum,valor) => {
        return acum + valor;
    })
    const gastosGeneral = data.gastosGeneral.reduce((acum,valor) => {
        return acum + valor;
    })
    const gananciasGeneral = data.gananciaGeneral.reduce((acum,valor) => {
        return acum + valor;
    })
    const ingresosBrutosGeneral = data.ingresosBrutosGeneral.reduce((acum,valor) => {
        return acum + valor;
    })
    const promedioVentaGeneral = data.promedioVentaGeneral.reduce((acum,valor) => {
        return acum + valor;
    })

    return {'stockVendidoGeneral':stockVendidoGeneral,'ingresosStockGeneral':ingresosStockGeneral,'gastosGeneral':gastosGeneral,
        'gananciasGeneral':gananciasGeneral,'ingresosBrutosGeneral':ingresosBrutosGeneral,'promedioVentaGeneral':promedioVentaGeneral};
}