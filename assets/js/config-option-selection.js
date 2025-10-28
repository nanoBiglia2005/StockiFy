document.addEventListener('DOMContentLoaded', () => {
    btnCuenta = document.getElementById('btn-config-cuenta');
    btnModifs = document.getElementById('btn-config-modifs');
    btnSoporte = document.getElementById('btn-config-soporte');

    btnCuenta.addEventListener('click',() =>{
        btnCuenta.className = 'btn btn-option-selected';
        btnModifs.className = 'btn';
        btnSoporte.className = 'btn';
    });

    btnModifs.addEventListener('click',() =>{
        btnModifs.className = 'btn btn-option-selected';
        btnCuenta.className = 'btn';
        btnSoporte.className = 'btn';
    });

    btnSoporte.addEventListener('click',() =>{
        btnSoporte.className = 'btn btn-option-selected';
        btnCuenta.className = 'btn';
        btnModifs.className = 'btn';
    });
});