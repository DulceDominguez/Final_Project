// Seleccionamos el formulario de tu HTML
const formulario = document.getElementById('formulario');

//Le decimos al formulario qué hacer cuando le des clic a "Agregar"
formulario.addEventListener('submit', function (evento) {
    // Esto evita que la página parpadee o se recargue sola
    evento.preventDefault();
    const id_user = document.getElementById('id_user').value;
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const datosProducto = {
        id_usuario: id_user,
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
    };
    // Hacemos la llamada (fetch) a tu servidor
    fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosProducto)
    })
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Error al guardar en la base de datos');
            }
            return respuesta.json();
        })
        .then(datos => {
            document.getElementById('modal-exito').style.display = 'flex';

            formulario.reset();
        })
        .catch(error => {
            console.error('Hubo un problema:', error);

            document.getElementById('modal-error').style.display = 'flex';
        });
});


// Cerrar alerta de ÉXITO
document.getElementById('btn-ok-exito').addEventListener('click', () => {
    document.getElementById('modal-exito').style.display = 'none';
});

// Cerrar alerta de ERROR
document.getElementById('btn-ok-error').addEventListener('click', () => {
    document.getElementById('modal-error').style.display = 'none';
});