
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

            const estadisticasFechaContainer = document.getElementById('estadisticas-fecha');

            estadisticasFechaContainer.innerHTML = `<div class="flex-column" id="estadisticas-fecha-desde">
                                                <h4>${creationDate.day} ${creationDate.date} de ${creationDate.month} de ${creationDate.year}</h4>
                                                    <p>Desde</p>          
                                            </div>
                                            <div class="flex-column" id="estadisticas-fecha-hasta">
                                                <h4>${todayDate.day} ${todayDate.date} de ${todayDate.month} de ${todayDate.year}</h4>
                                                <p>Hasta</p>
                                            </div>`

            actualizarEstadisticas(creationDateNoFormat,todayDateNoFormat,chart);

            const fechaDesdeBtn = document.getElementById('estadisticas-fecha-desde');
            const fechaHastaBtn = document.getElementById('estadisticas-fecha-hasta');

            const fechaDesdeInput = document.getElementById('fecha-desde-elegida');
            const fechaHastaInput = document.getElementById('fecha-hasta-elegida');

            fechaHastaInput.min = creationDateNoFormat.toISOString().slice(0,10);
            fechaDesdeInput.min = creationDateNoFormat.toISOString().slice(0,10);
            fechaDesdeInput.max = formatYMD(todayDateNoFormat);
            fechaHastaInput.max = formatYMD(todayDateNoFormat);

            var fechaDesde = creationDate;
            var fechaHasta = todayDate;
            var fechaDesdeNoFormat = creationDateNoFormat;
            var fechaHastaNoFormat = todayDateNoFormat;

            const greyBg = document.getElementById('grey-background');

            function hidePicker(){
                fechaDesdeInput.classList.add('hidden');
                fechaHastaInput.classList.add('hidden');
                greyBg.classList.add('hidden');
            }

            function showPicker(fechaInput){
                fechaInput.classList.remove('hidden');
                greyBg.classList.remove('hidden');

                setTimeout(() => {
                    fechaInput.showPicker();
                }, 0)
            }

            fechaDesdeBtn.addEventListener('click',function() {
                showPicker(fechaDesdeInput);
            })
            fechaHastaBtn.addEventListener('click',function() {
                showPicker(fechaHastaInput);
            })

            fechaDesdeInput.addEventListener('blur', hidePicker);

            fechaHastaInput.addEventListener('blur', hidePicker);

            greyBg.addEventListener('click', () =>{
                hidePicker();
            })

            fechaDesdeInput.addEventListener('input', function() {
                const fechaPrevia = fechaDesdeNoFormat;

                fechaDesdeNoFormat = (this.value === '') ? fechaPrevia : new Date(this.value.replace(/-/g, '\/'));

                const phpDate = {'desde' : fechaDesdeNoFormat, 'hasta' : fechaHastaNoFormat}

                fechaHastaInput.min = this.value;

                fechaDesde = formatDate(fechaDesdeNoFormat);
                fechaDesdeBtn.querySelector('h4').textContent = `${fechaDesde.day} ${fechaDesde.date} de ${fechaDesde.month} de ${fechaDesde.year}`

                actualizarEstadisticas(phpDate.desde,phpDate.hasta,chart);
                hidePicker();
            })



            fechaHastaInput.addEventListener('input', function() {
                const fechaPrevia = fechaHastaNoFormat;

                fechaHastaNoFormat = (this.value === '') ? fechaPrevia : new Date(this.value.replace(/-/g, '\/'));

                const phpDate = {'desde' : fechaDesdeNoFormat, 'hasta' : fechaHastaNoFormat}

                fechaDesdeInput.max = this.value;

                fechaHasta = formatDate(fechaHastaNoFormat);

                fechaHastaBtn.querySelector('h4').textContent = `${fechaHasta.day} ${fechaHasta.date} de ${fechaHasta.month} de ${fechaHasta.year}`

                actualizarEstadisticas(phpDate.desde,phpDate.hasta,chart);
                hidePicker();
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
        listaFechas.push(formatYMD(fechaActual));
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

function formatYMD(date) {
    const year = date.getFullYear();
    // getMonth() es base 0 (Enero=0), por eso se le suma 1
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatStatData(data) {

    const categories = ['General','Table'];
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
        { id: 'promedio-venta-tabla', groupedKey: 'tableData.promedioVenta',  dailyKey: 'promedioVentaTable',  unit: '$' }
    ];

    containerConfig.forEach(container =>{
        const statisticContainer = document.getElementById(container.id);
        const keys = container.groupedKey.split('.');

        const groupValue = groupData[keys[0]][keys[1]];
        const h3Text = (container.unit === 'unit') ? `${groupValue} unidad${(groupValue > 1) ? 'es' : ''}` :
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