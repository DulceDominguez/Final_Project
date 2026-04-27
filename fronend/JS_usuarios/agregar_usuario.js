document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-usuario');
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    if (editId) {
        document.querySelector('h2').innerText = "Modificar Usuario";
        document.getElementById('nombre').value = params.get('nombre');
        document.getElementById('correo').value = params.get('correo');
        document.getElementById('telefono').value = params.get('telefono');
        // La contraseña se deja vacía por seguridad o se pide una nueva
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            telefono: document.getElementById('telefono').value,
            contraseña: document.getElementById('password').value
        };

        const url = editId ? `http://localhost:3000/usuarios/${editId}` : 'http://localhost:3000/usuarios';
        const metodo = editId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(() => {
            alert("Operación exitosa");
            window.location.href = 'usuarios.html';
        });
    });
});