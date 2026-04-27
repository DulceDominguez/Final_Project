const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db'); // Asegúrate que db.js esté en esta misma carpeta
const app = express();

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
app.use('/CSS', express.static(path.join(__dirname, '..', 'CSS')));
app.use('/iconos', express.static(path.join(__dirname, '..', 'iconos')));
app.use('/screens_inventario', express.static(path.join(__dirname, '..', 'screens_inventario')));
app.use('/screens_usuarios', express.static(path.join(__dirname)));

// --- RUTAS DE NAVEGACIÓN ---

// 1. Mostrar Login (inicio.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'inicio.html'));
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

        if (results.length > 0) {
            // Guardamos datos en la sesión
            req.session.usuario = results[0].nombre;
            res.redirect('/menu');
        } else {
            res.send("Correo o contraseña incorrectos <a href='/'>Volver a intentar</a>");
        }
    });
});

// 3. Mostrar el Menú Principal (Home)
app.get('/menu', (req, res) => {
    // Si no hay sesión iniciada, lo mandamos al login
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    // '..' sube un nivel para encontrar home.html en la carpeta 'fronend'
    res.sendFile(path.join(__dirname, '..', 'home.html'));
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
    res.json({ usuario: req.session.usuario || null });
});

// --- ARRANCAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Servidor de Dulcería EMMI corriendo en:`);
    console.log(`http://localhost:${PORT}`);
    console.log(`===========================================`);
});