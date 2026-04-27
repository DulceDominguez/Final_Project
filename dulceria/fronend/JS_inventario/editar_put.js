// JS_inventario/editar_put.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos de la URL
    const params = new URLSearchParams(window.location.search);
    document.getElementById('edit-id').value = params.get('id');
    document.getElementById('edit-nombre').value = params.get('nombre');
    document.getElementById('edit-precio').value = params.get('precio');
    document.getElementById('edit-cantidad').value = params.get('cantidad');

    // 2. Manejar el envío del formulario
    document.getElementById('formulario-editar').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const datos = {
            nombre: document.getElementById('edit-nombre').value,
            precio: document.getElementById('edit-precio').value,
            cantidad: document.getElementById('edit-cantidad').value
        };

        fetch(`http://localhost:3000/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('modal-exito').classList.add('modal-visible');
        });
    });

    document.getElementById('btn-ok-exito').addEventListener('click', () => {
        window.location.href = 'inventario.html';
    });
});