const express = require('express');
const cors = require('cors'); // <-- Necesario para que el HTML se comunique sin bloqueos
const session = require('express-session');
const bcrypt = require('bcrypt')
const app = express();
const db = require('./bd/bd');

app.use(cors()); // Habilitamos CORS
app.use(express.json());

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true
}));

//USUARIOS
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const sql = 'INSERT INTO usuarios (nombre, email,password) VALUES (?,?,?)';
        const hashPassword = await bcrypt.hash(password, 10);
        db.query(sql, [nombre, email, hashPassword], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json('El usuario ha sido creado');

        });

    } catch {
        res.status(500).send(err);
    }



});
//AUTENTICACION USUARIOS
//LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email=?';

    db.query(sql, { email }, async () => {
        if (results.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }
        const usuario = results[0];

        const match = await bcrypt.compare(password, usuario.password);

        if (match) {
            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre
            }
            res.send('Login correcto: ');
        } else {
            res.status(401).send('Contraseña incorrecta');
        }
    });
})

//PERFIL(protegido)
app.get('/perfil', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).send('No autorizado')
    }
    res.json(req.session.usuario);
})

//LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Sesion cerrada');

});

//---------ALUMNOS----------
// --- PETICIONES GET ---

app.get('/alumnos', (req, res) => {
    db.query('SELECT * FROM alumnos', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);

    });

});


// --- PETICIÓN POST ---
app.post('/alumnos', (req, res) => {
    const { nombre, grupo } = req.body;

    const sql = 'INSERT INTO alumnos (nombre, grupo) VALUES (?,?)';
    db.query(sql, [nombre, grupo], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);

    });

});


//UPDATE ALUMNOS
app.post('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, grupo } = req.body;

    const sql = 'UPDATE alumnos SET nombre=?,grupo=? WHERE id=?';


    db.query(sql, [nombre, grupo, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json('Actualizacion exitosa');


    });



});

app.post('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, grupo } = req.body;



    db.query('DELETE FROM alumnos WHERE id=?', { id }, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json('Eliminado exitosamente');


    });



});

//EXTRA
app.get('alumnos/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM alumnos WHERE id=?', { id }, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);


    });

});

app.listen(3000, () => {
    console.log('Servidor jalando machin en http://localhost:3000');
});

// --- PETICIÓN DELETE (NUEVA) ---
