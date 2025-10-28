document.addEventListener('DOMContentLoaded', () => {

    const generarColorAleatorio = () => {
    const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    var nuevoColor = generarColorAleatorio();
    document.documentElement.style.setProperty('--accent-color', nuevoColor);
    nuevoColor += '75';
    document.documentElement.style.setProperty('--accent-color-medium-opacity', nuevoColor);
});