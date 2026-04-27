const express = require('express');
const session = require('express-session');

const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const db = require('./db'); // Asegúrate que db.js esté en esta misma carpeta


//LOGIN
// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secreto_dulceria',
    resave: false,
    saveUninitialized: true
}));

// --- CONFIGURACIÓN DE RUTAS ESTÁTICAS (DISEÑO) ---
// Estas líneas permiten que el servidor encuentre el CSS y las imágenes
// aunque el JS esté dentro de una subcarpeta.
// --- CONFIGURACIÓN DE RUTAS ESTÁTICAS (DISEÑO) ---
// Le agregamos 'fronend' para que Node.js sepa entrar a esa carpeta a buscar los recursos
app.use('/CSS', express.static(path.join(__dirname, '..', 'fronend', 'CSS')));
app.use('/iconos', express.static(path.join(__dirname, '..', 'fronend', 'iconos')));
app.use('/screens_inventario', express.static(path.join(__dirname, '..', 'fronend', 'screens_inventario')));
app.use('/screens_usuarios', express.static(path.join(__dirname, '..', 'fronend', 'screens_usuarios')));

app.use('/JS_inventario', express.static(path.join(__dirname, '..', 'fronend', 'JS_inventario')));
app.use('/JS_usuarios', express.static(path.join(__dirname, '..', 'fronend', 'JS_usuarios')));
// --- RUTAS DE NAVEGACIÓN ---

// 1. Mostrar Login (inicio.html)
app.get('/', (req, res) => {
    // Le decimos: "Sube un nivel (..), entra a 'fronend', entra a 'screens_usuarios' y abre 'inicio.html'"
    res.sendFile(path.join(__dirname, '..', 'fronend', 'screens_usuarios', 'inicio.html'));
});

// 2. Procesar el Login
app.post('/login', (req, res) => {
    const { correo, password } = req.body;



    // Consulta a la BD (Asegúrate que la columna sea 'contraseña')
    const query = "SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?";
    db.query(query, [correo, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
        }

        // En tu server.js, dentro del app.post('/login')
        if (results.length > 0) {
            req.session.usuario = results[0].nombre;
            req.session.usuarioId = results[0].id; // 👈 Guardamos el ID aquí
            res.redirect('/menu');
        } else {
            res.send("Correo o contraseña incorrectos <a href='/'>Volver a intentar</a>");
        }
    });
});

// 3. Mostrar el Menú Principal (Home)
app.get('/menu', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    // Entramos a 'fronend' a buscar el home.html
    res.sendFile(path.join(__dirname, '..', 'fronend', 'home.html'));
});

// Mostrar la pantalla de Inventario
app.get('/inventario', (req, res) => {
    // Escudo de seguridad: Si alguien intenta entrar directo sin iniciar sesión, lo regresamos al login
    if (!req.session.usuario) {
        return res.redirect('/');
    }

    // Ruta para encontrar tu archivo inventario.html
    // (Ajusté la ruta basándome en la foto de tus carpetas que me enviaste antes)
    res.sendFile(path.join(__dirname, '..', 'fronend', 'screens_inventario', 'inventario.html'));
});
// 4. Cerrar Sesión (Logout)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.redirect('/');
    });
});

// 5. API opcional para que el front-end sepa quién entró
app.get('/api/user', (req, res) => {
    res.json({ usuario: req.session.usuario, id: req.session.usuarioId });
});

// --- ARRANCAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Servidor de Dulcería EMMI corriendo en:`);
    console.log(`http://localhost:${PORT}`);
    console.log(`===========================================`);
});
//INVENTARIO
// Configuraciones básicas (Middlewares)
app.use(cors()); // Esto permite que tu frontend (Live Server) se comunique con el backend sin errores de seguridad
app.use(express.json()); // Esto permite que el servidor entienda los datos en formato JSON que le manda tu fetch
//*const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//  password: '',
//  database: 'bd_dulceria'
//});

// Conectamos a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('¡Conectado a la base de datos MySQL exitosamente!');
});

// LA RUTA PARA AGREGAR PRODUCTOS (CREATE) ---
app.post('/productos', (req, res) => {
    // Recibimos los datos del frontend
    const { id_usuario, nombre, precio, cantidad } = req.body;

    // Hacemos la consulta a MySQL (asegúrate de que tu tabla se llame 'productos')
    const sql = 'INSERT INTO inventario (id_usuario,nombre, precio,cantidad) VALUES (?,?, ?, ?)';

    db.query(sql, [id_usuario, nombre, precio, cantidad], (err, results) => {
        if (err) {
            console.error('Error al insertar:', err);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        // Le respondemos al frontend que todo salió bien
        res.json({ mensaje: 'Producto guardado exitosamente' });
    });
});

//GET-mostrar

// RUTA PARA MOSTRAR LOS DATOS (SELECT)
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM inventario';

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al hacer el SELECT:', error);
            return res.status(500).json({ mensaje: 'Error al obtener los datos' });
        }
        // Eviamos los resultados al frontend en formato JSON
        res.json(resultados);
    });
});

// RUTA PARA ELIMINAR UN PRODUCTO
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM inventario WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Eliminado correctamente' });
    });
});


// RUTA PARA ACTUALIZAR (MODIFICAR) UN PRODUCTO
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;

    // La consulta SQL para actualizar los datos según el ID
    const sql = 'UPDATE inventario SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';

    db.query(sql, [nombre, precio, cantidad, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err);
            return res.status(500).json({ error: "Error al actualizar el producto" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: '¡Producto actualizado con éxito!' });
    });
});

//USUARIOS

//GET-MOSTRAR
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al hacer el SELECT:', error);
            return res.status(500).json({ mensaje: 'Error al obtener los datos' });
        }
        // Eviamos los resultados al frontend en formato JSON
        res.json(resultados);
    });
});

// AGREGAR USUARIO (POST)
app.post('/usuarios', (req, res) => {
    const { nombre, correo, telefono, contraseña } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, correo, telefono, contraseña) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, correo, telefono, contraseña], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario agregado' });
    });
});

// MODIFICAR USUARIO (PUT)
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, contraseña } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, contraseña = ? WHERE id = ?';
    db.query(sql, [nombre, correo, telefono, contraseña, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

// ELIMINAR USUARIO (DELETE)
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Usuario eliminado' });
    });
});



// Encendemos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('¡Servidor Backend corriendo en http://localhost:3000!');
});

