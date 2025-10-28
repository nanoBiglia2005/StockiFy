document.addEventListener('DOMContentLoaded', () =>{
    const emailForm = document.getElementById('email-form');
    const msjBubble = document.getElementById('msj-bubble');
    let emailCode;
    emailForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('./assets/php/verify-email-change.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                emailCode = data.code;
                msjBubble.textContent = data.message;
            })
    })

})