


/* 
Función para obtener datos desde PHP */
async function obtenerDatos() {
    try {
        const respuesta = await fetch('getData.php');
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
} 

// Función para ajustar automáticamente el espacio entre los valores y las barras
function ajustarEspacioEntreValoresYBarras(datos, anchoMaximo) {
    const longitudMaxima = Math.max(...datos.map(item => item.nombre.length));
    const espacioMinimo = 30; // Espacio mínimo entre el texto y las barras
    const espacioPorCaracter = 10; // Espacio adicional por cada carácter
    return Math.min(espacioMinimo + (longitudMaxima * espacioPorCaracter), anchoMaximo * 0.3);
}

// Función para dibujar el gráfico
function dibujarGrafico(datos) {
    const lienzo = document.getElementById('densityChart');
    const contexto = lienzo.getContext('2d');

    // Calcular la altura necesaria basada en la cantidad de datos
    const alturaBarras = 60;
    const espacioEntreBarras = 30;
    const alturaTotal = (alturaBarras + espacioEntreBarras) * datos.length + 100; // 100 para espacio adicional

    // Ajustar el tamaño del lienzo
    lienzo.width = 1000;
    lienzo.height = alturaTotal;

    const anchoMaximo = 650;
    const escala = anchoMaximo / 100;
    const espacioEntreLetraYBarra = ajustarEspacioEntreValoresYBarras(datos, anchoMaximo);

    // Limpiar el lienzo
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);

    // Dibujar ejes con animación y estilo mejorado
    contexto.beginPath();
    contexto.strokeStyle = '#333';
    contexto.lineWidth = 3;

    // Eje X
    let progresoX = 0;
    const animarEjeX = () => {
        if (progresoX <= anchoMaximo) {
            contexto.beginPath();
            contexto.moveTo(60 + espacioEntreLetraYBarra, lienzo.height - 60);
            contexto.lineTo(60 + espacioEntreLetraYBarra + progresoX, lienzo.height - 60);
            contexto.stroke();
            progresoX += 14;
            requestAnimationFrame(animarEjeX);
        }
    };

    // Eje Y
    let progresoY = 0;
    const animarEjeY = () => {
        if (progresoY <= lienzo.height - 60) {
            contexto.beginPath();
            contexto.moveTo(60 + espacioEntreLetraYBarra, lienzo.height - 60);
            contexto.lineTo(60 + espacioEntreLetraYBarra, lienzo.height - 60 - progresoY);
            contexto.stroke();
            progresoY += 14;
            requestAnimationFrame(animarEjeY);
        }
    };

    // Agregar marcas de escala en el eje X
    contexto.font = '18px Arial';
    for (let i = 0; i <= 100; i += 20) {
        const x = 60 + espacioEntreLetraYBarra + (i * escala);
        contexto.beginPath();
        contexto.moveTo(x, lienzo.height - 55);
        contexto.lineTo(x, lienzo.height - 65);
        contexto.stroke();
        contexto.fillStyle = '#000000'; // Cambiado a negro
        contexto.fillText(i + '%', x - 15, lienzo.height - 35);
    }

    // Dibujar barras con animación y estilo mejorado
    datos.forEach((item, indice) => {
        const anchoBarras = item.porcentaje * escala;
        const y = indice * (alturaBarras + espacioEntreBarras) + espacioEntreBarras;
        const x = 60 + espacioEntreLetraYBarra;

        // Estilo de la barra con gradiente mejorado y más transparente
        const gradiente = contexto.createLinearGradient(x, y, x + anchoBarras, y);
        const colorPrincipal = 'rgba(127, 179, 213)'; // #036dab con 60% de opacidad
        const colorSecundario = 'rgba(3, 109, 171, 0.2)'; // #036dab con 20% de opacidad
        gradiente.addColorStop(0, colorPrincipal);
        gradiente.addColorStop(0.6, colorPrincipal);
        gradiente.addColorStop(1, colorSecundario);

        // Animación de la barra con efecto más suave
        let anchoBarra = 0;
        const animarBarra = () => {
            if (anchoBarra < anchoBarras) {
                anchoBarra += (anchoBarras - anchoBarra) * 0.1; // Efecto de suavizado
                if (anchoBarras - anchoBarra < 0.1) anchoBarra = anchoBarras;
                
                contexto.fillStyle = gradiente;
                contexto.fillRect(x, y, anchoBarra, alturaBarras);

                // Borde de la barra con sombra suave
                contexto.shadowColor = 'rgba(0, 0, 0, 0.1)';
                contexto.shadowBlur = 3;
                contexto.shadowOffsetX = 1;
                contexto.shadowOffsetY = 1;
                contexto.strokeStyle = 'rgba(3, 109, 171, 0.3)'; // #036dab con 30% de opacidad
                contexto.lineWidth = 1;
                contexto.strokeRect(x, y, anchoBarra, alturaBarras);
                contexto.shadowColor = 'transparent';

                // Insertar valores de porcentaje estándar en las barras
                contexto.fillStyle = '#FFFFFF'; // Mantenido en blanco para los números en las barras
                contexto.font = '16px Arial';
                contexto.textAlign = 'center';
                contexto.textBaseline = 'middle';
                const porcentajeTexto = item.porcentaje.toFixed(2) + '%';
                const anchoTexto = contexto.measureText(porcentajeTexto).width;
                if (anchoBarra > anchoTexto + 10) {
                    contexto.fillText(porcentajeTexto, x + anchoBarra / 2, y + alturaBarras / 2);
                }

                requestAnimationFrame(animarBarra);
            } else {
                // Si el texto no cabe dentro de la barra, dibujarlo fuera
                if (anchoBarras <= contexto.measureText(item.porcentaje.toFixed(2) + '%').width + 10) {
                    contexto.fillStyle = '#000000'; // Cambiado a negro para los números fuera de las barras
                    contexto.font = '16px Arial';
                    contexto.textAlign = 'left';
                    contexto.textBaseline = 'middle';
                    contexto.fillText(item.porcentaje.toFixed(2) + '%', x + anchoBarras + 5, y + alturaBarras / 2);
                }
            }
        };
        animarBarra();

        // Dibujar etiquetas con efecto de aparición gradual
        let opacidadEtiqueta = 0;
        const animarEtiqueta = () => {
            if (opacidadEtiqueta < 1) {
                opacidadEtiqueta += 0.05;
                contexto.fillStyle = `rgba(0, 0, 0, ${opacidadEtiqueta})`; // Cambiado a negro para las letras
                contexto.font = '20px Arial';
                contexto.textAlign = 'left';
                contexto.textBaseline = 'middle';
                contexto.fillText(item.nombre, 10, y + alturaBarras / 2);
                requestAnimationFrame(animarEtiqueta);
            }
        };
        animarEtiqueta();
    });

    // Iniciar animaciones de los ejes
    animarEjeX();
    animarEjeY();
}

// Función para cargar datos al hacer clic en el botón
document.getElementById('loadData').addEventListener('click', () => {
    // Efecto visual al hacer clic en el botón
    const boton = document.getElementById('loadData');
    boton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        boton.style.transform = 'scale(1)';
    }, 100);

    obtenerDatos()
        .then(datos => {
            // Limpiar el gráfico existente
            const lienzo = document.getElementById('densityChart');
            const contexto = lienzo.getContext('2d');
            contexto.clearRect(0, 0, lienzo.width, lienzo.height);

            // Dibujar el nuevo gráfico con animación
            dibujarGrafico(datos);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
