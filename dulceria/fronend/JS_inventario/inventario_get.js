document.addEventListener('DOMContentLoaded', () => {

    // 1. Le pedimos los datos al servidor
    fetch('http://localhost:3000/productos')
        .then(respuesta => respuesta.json())
        .then(datos => {
            const cuerpoTabla = document.getElementById('cuerpo-tabla');
            cuerpoTabla.innerHTML = '';

            // 2. Recorremos cada producto
            datos.forEach(producto => {
                const fila = document.createElement('tr');

                // IMPORTANTE: Agregamos el atributo 'onclick' a los botones
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>
                        <button class="btn-modificar" onclick="irAEditar(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.cantidad})">Modificar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminar(${producto.id})">Eliminar</button>
                    </td>
                `;

                cuerpoTabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Hubo un problema al cargar el inventario:', error);
        });
});

// --- FUNCIONES FUERA DEL DOMContentLoaded PARA QUE SEAN GLOBALES ---

// Función para redirigir a editar pasando los datos actuales por la URL
function irAEditar(id, nombre, precio, cantidad) {
    // Cambiamos 'editar.html' por 'agregar.html' para usar el formulario que ya configuramos
    window.location.href = `editar.html?id=${id}&nombre=${nombre}&precio=${precio}&cantidad=${cantidad}`;
}



// Variable global para guardar el ID
let idAEliminarGlobal = null;

function confirmarEliminar(id) {
    console.log("Deseas eliminar el ID:", id); // Para que veas en consola que sí funciona
    idAEliminarGlobal = id;
    document.getElementById('modal-eliminar').style.display = 'flex';
}

// Botón "No" o "Cancelar"
document.getElementById('confirmar-no').onclick = () => {
    document.getElementById('modal-eliminar').style.display = 'none';
};

// Botón "Sí" (Eliminar de verdad)
document.getElementById('confirmar-si').onclick = () => {
    if (idAEliminarGlobal) {
        fetch(`http://localhost:3000/productos/${idAEliminarGlobal}`, { 
            method: 'DELETE' 
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar');
            return res.json();
        })
        .then(datos => {
            console.log("Servidor dice:", datos.mensaje);
            // Cerramos y recargamos
            document.getElementById('modal-eliminar').style.display = 'none';
            location.reload(); 
        })
        .catch(err => {
            console.error(err);
            alert("No se pudo eliminar el producto.");
        });
    }
};

