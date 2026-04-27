document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    // Si hay ID, rellenamos para editar
    if (editId) {
        document.getElementById('titulo-form').innerText = "Modificar Usuario";
        document.querySelector('.btn-agregar-form').innerText = "Guardar Cambios";
        document.getElementById('nombre').value = params.get('nombre') || '';
        document.getElementById('correo').value = params.get('correo') || '';
        document.getElementById('telefono').value = params.get('telefono') || '';
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const idLogueado = localStorage.getItem('idUsuarioActual');
        const idAEditar = new URLSearchParams(window.location.search).get('id');

        console.log("Yo soy el ID:", miIdDeSesion);
        console.log("Voy a editar al ID:", idAEditar);
        const datos = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            telefono: document.getElementById('telefono').value,
            contraseña: document.getElementById('password').value,
            id_usuario: idLogueado
        };

        const url = editId ? `http://localhost:3000/usuarios/${editId}` : 'http://localhost:3000/usuarios';
        const metodo = editId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => {
                if (editId) document.getElementById('mensaje-exito').innerHTML = "Actualizado<br>correctamente";
                document.getElementById('modal-exito').style.display = 'flex';
            })
            .catch(() => {
                document.getElementById('modal-error').style.display = 'flex';
            });
    });

    // Botones de modales
    document.getElementById('btn-ok-exito').onclick = () => window.location.href = 'inventario.html';

    document.getElementById('btn-ok-error').onclick = () => document.getElementById('modal-error').style.display = 'none';
});