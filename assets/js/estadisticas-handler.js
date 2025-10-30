
document.addEventListener('DOMContentLoaded', () => {
    const todayDateNoFormat = new Date();
    const todayDate = formatDate(todayDateNoFormat);

    var creationDate;
    var creationDateNoFormat;

    const graficoContainer = document.getElementById('grafico-estadistica');

    const options = {
        chart:{
            type: 'area',
            height: 350
        },
        series: [{
            name: 'empty',
            data: [0]
        }],
        xaxis: {
            categories: 'empty'
        }
    };

    const chart = new ApexCharts(graficoContainer,options);
    chart.render();

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

            actualizarEstadisticas(creationDateNoFormat,todayDateNoFormat,chart);

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

                actualizarEstadisticas(phpDesdeDate,phpHastaDate,chart);
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

                actualizarEstadisticas(phpDesdeDate,phpHastaDate,chart);
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

function actualizarEstadisticas(fechaDesde, fechaHasta,chart)
{
    let fechaActual = new Date(fechaDesde);
    const listaFechas = [];

    while (fechaActual <= fechaHasta){
        listaFechas.push(fechaActual.toISOString().slice(0,10));
        fechaActual.setDate(fechaActual.getDate()+1);
    }

    fetch('./assets/php/update-statistics.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fechas : listaFechas})

    }).then(response => response.json())
        .then(dailyData => {
            const groupedData = formatStatData(dailyData);

            addContainerData(dailyData,groupedData,listaFechas,chart);
        })
}

function formatStatData(data) {

    const categories = ['General','Table','Product'];
    const statistics = ['stockVendido','stockIngresado','gastos','ganancia','ingresosBrutos','promedioVenta'];

    const groupedData = {};

    categories.forEach(category => {
        const categoryKey = `${category.toLowerCase()}Data`;
        groupedData[categoryKey] = {};

        statistics.forEach(statistic => {
            const statisticKey = `${statistic}${category}`;
            const dataValue = data[statisticKey].reduce((acum,valor) => {
                return acum + valor;
            })
            groupedData[categoryKey][statistic] = dataValue;
        })
    })
    return groupedData;
}

function addContainerData(dailyData, groupData, listaFechas,chart){

    const containerConfig = [
        { id: 'ventas-general',         groupedKey: 'generalData.stockVendido',   dailyKey: 'stockVendidoGeneral',   unit: 'unit' },
        { id: 'ganancias-general',      groupedKey: 'generalData.ganancia',       dailyKey: 'gananciaGeneral',       unit: '$' },
        { id: 'ingresos-brutos-general',groupedKey: 'generalData.ingresosBrutos', dailyKey: 'ingresosBrutosGeneral', unit: '$' },
        { id: 'ingresos-stock-general', groupedKey: 'generalData.stockIngresado', dailyKey: 'stockIngresadoGeneral', unit: 'unit' },
        { id: 'gastos-general',         groupedKey: 'generalData.gastos',         dailyKey: 'gastosGeneral',         unit: '$' },
        { id: 'promedio-venta-general', groupedKey: 'generalData.promedioVenta',  dailyKey: 'promedioVentaGeneral',  unit: '$' },
        { id: 'ventas-tabla',         groupedKey: 'tableData.stockVendido',   dailyKey: 'stockVendidoTable',   unit: 'unit' },
        { id: 'ganancias-tabla',      groupedKey: 'tableData.ganancia',       dailyKey: 'gananciaTable',       unit: '$' },
        { id: 'ingresos-brutos-tabla',groupedKey: 'tableData.ingresosBrutos', dailyKey: 'ingresosBrutosTable', unit: '$' },
        { id: 'ingresos-stock-tabla', groupedKey: 'tableData.stockIngresado', dailyKey: 'stockIngresadoTable', unit: 'unit' },
        { id: 'gastos-tabla',         groupedKey: 'tableData.gastos',         dailyKey: 'gastosTable',         unit: '$' },
        { id: 'promedio-venta-tabla', groupedKey: 'tableData.promedioVenta',  dailyKey: 'promedioVentaTable',  unit: '$' },
        { id: 'ventas-producto',         groupedKey: 'productData.stockVendido',   dailyKey: 'stockVendidoProduct',   unit: 'unit' },
        { id: 'ganancias-producto',      groupedKey: 'productData.ganancia',       dailyKey: 'gananciaProductl',       unit: '$' },
        { id: 'ingresos-brutos-producto',groupedKey: 'productData.ingresosBrutos', dailyKey: 'ingresosBrutosProduct', unit: '$' },
        { id: 'ingresos-stock-producto', groupedKey: 'productData.stockIngresado', dailyKey: 'stockIngresadoProduct', unit: 'unit' },
        { id: 'gastos-producto',         groupedKey: 'productData.gastos',         dailyKey: 'gastosProduct',         unit: '$' },
        { id: 'promedio-venta-producto', groupedKey: 'productData.promedioVenta',  dailyKey: 'promedioVentaProduct',  unit: '$' }
    ];

    containerConfig.forEach(container =>{
        const statisticContainer = document.getElementById(container.id);
        const keys = container.groupedKey.split('.');

        const groupValue = groupData[keys[0]][keys[1]];
        const h3Text = (container.unit === 'unit') ? `${groupValue} unidad${(groupData.groupedKey > 1) ? 'es' : ''}` :
            `$${groupValue}`;

        statisticContainer.querySelector('h3').textContent = h3Text;

        statisticContainer.addEventListener('click', () => {
            const statName = statisticContainer.querySelector('h1').textContent;
            showGraph(statName,dailyData[container.dailyKey],listaFechas,chart);
        });
    })
}

function showGraph(statName,dailyData,dateList,chart){
    const options = {
        chart:{
            type: 'area',
            height: 350
        },
        series: [{
            name: statName,
            data: dailyData
        }],
        xaxis: {
            categories: dateList
        }
    };
    chart.updateOptions(options);

    const graphContainer = document.getElementById('grafico-estadistica-container');
    const greyBg = document.getElementById('grey-background');
    const backBtn = graphContainer.querySelector('p');

    graphContainer.querySelector('h3').textContent = `Estadísticas Diarias = ${statName}`;
    greyBg.classList.remove('hidden');
    graphContainer.classList.remove('hidden');

    backBtn.addEventListener('click', () =>{
        greyBg.classList.add('hidden');
        graphContainer.classList.add('hidden');
    })

    greyBg.addEventListener('click', () =>{
        greyBg.classList.add('hidden');
        graphContainer.classList.add('hidden');
    })
}