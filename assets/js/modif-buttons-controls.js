document.addEventListener('DOMContentLoaded', () =>{
    greyBg = document.getElementById('grey-background');
    btnEmail = document.getElementById('btn-modif-email');
    btnPass = document.getElementById('btn-modif-pass');
    modifForm = document.getElementById('modif-form-container');
    returnBtn = document.getElementById('return-btn');

    const defaultFormClasses = 'view-container flex-column justify-left align-center';

    returnBtn.addEventListener('click',() => {
        modifForm.className += ' hidden';
        greyBg.className += ' hidden';
    });
    btnEmail.addEventListener('click', () => {
        greyBg.className = "";
        modifForm.className = defaultFormClasses;
    })
})