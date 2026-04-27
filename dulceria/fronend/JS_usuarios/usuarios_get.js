document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/usuarios')
        .then(res => res.json())
        .then(datos => {
            const cuerpo = document.getElementById('cuerpo-tabla');
            cuerpo.innerHTML = '';
            datos.forEach(u => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.nombre}</td>
                    <td>${u.correo}</td>
                    <td>${u.telefono}</td>
                    <td>********</td>
                    <td>
                        <button class="btn-modificar" onclick="irAEditarUsuario(${u.id}, '${u.nombre}', '${u.correo}', '${u.telefono}')">Modificar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarUsuario(${u.id})">Eliminar</button>
                    </td>
                `;
                cuerpo.appendChild(fila);
            });
        });

    // Configuración del modal de eliminar
    document.getElementById('confirmar-si').onclick = () => {
        fetch(`http://localhost:3000/usuarios/${idUsuarioAEliminar}`, { method: 'DELETE' })
            .then(() => location.reload());
    };
    document.getElementById('confirmar-no').onclick = () => {
        document.getElementById('modal-eliminar').style.display = 'none';
    };
});

let idUsuarioAEliminar = null;

function irAEditarUsuario(id, nombre, correo, telefono) {
    window.location.href = `agregar.html?id=${id}&nombre=${nombre}&correo=${correo}&telefono=${telefono}`;
}

function confirmarEliminarUsuario(id) {
    idUsuarioAEliminar = id;
    document.getElementById('modal-eliminar').style.display = 'flex';
}