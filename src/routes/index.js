// express
const express = require('express');
const app = express();
// hbs
const hbs = require('hbs');
require('../hbs/helpers');
// path
const path = require('path');
// mongoose
const mongoose = require('mongoose');
// bodyParser
const bodyParser = require('body-parser');
// views - partials
const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');
// schema
const Usuario = require('../models/usuarios');
// bcrypt
const bcrypt = require('bcrypt');
// multer
const multer = require('multer');
// const upload = multer({});
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.set('view engine', 'hbs');
app.set('views', dirViews)
hbs.registerPartials(dirPartials);

// sign-in
app.get('/', (req, res) => {
    res.render('sign-in');
});

// home
app.get('/home', (req, res) => {
    res.render('home');
});

// sign-in-chat
app.get('/sign-in-chat', (req, res) => {
    res.render('sign-in-chat');
});

// sign-in-chat
app.get('/view-course', (req, res) => {
    res.render('view-course');
});

// sign-in post
app.post('/sign-in', (req, res) => {
    Usuario.findOne({ documento: req.body.documento }, (err, resp) => {
        if (err) {
            res.render('error');
        }

        if (!resp) {
            res.render('sign-in', {
                error: 'Usuario no encontrado, por favor inténtalo nuevamente o regístrate.'
            });
        }

        if (resp) {

            if (!bcrypt.compareSync(req.body.password, resp.password)) {
                res.render('sign-in', {
                    error: 'La contraseña es incorrecta, por favor inténtalo nuevamente.',
                });
            } else {
                req.session.usuario = resp._id;
                req.session.role = resp.role;
                imagen = resp.imagen.toString('base64');

                res.render('home', {
                    message: 'Inicio de sesión realizado exitosamente.',
                    role: req.session.role,
                    session: true,
                    imagen
                });
            }
        }
    });
});

// sign-up post
app.post('/sign-up', upload.single('imagen'), (req, res) => {
    const errors = [];
    let usuario = new Usuario({
        documento: req.body.documento,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        telefono: req.body.telefono,
        password: bcrypt.hashSync(req.body.password, 10),
        curso: req.body.curso,
        role: req.body.role,
        imagen: req.file.buffer
    });

    usuario.save((err, resp) => {
        if (err) {
            errors.push(err);
            res.render('sign-up', {
                errors
            });
        } else {
            res.render('sign-in', {
                message: 'Registro realizado exitosamente.',
            });
        }
    });
});

// view-profile get
app.get('/view-profile', async(req, res) => {
    Usuario.findById(req.session.usuario, (err, resp) => {
        if (err) {
            errors.push(err);
            res.render('view-profile', {
                errors
            });
        } else {
            res.render('view-profile', {
                nombre: resp.nombre,
                apellido: resp.apellido,
                documento: resp.documento,
                correo: resp.correo,
                telefono: resp.telefono,
                curso: resp.curso,
                imagen: resp.imagen.toString('base64')
            });
        }
    });
});

// sign-up get
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

// logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) { res.render('error'); }
    });
    res.render('sign-in', {
        message: 'Sesión cerrada exitosamente.',
    });
});

// error
app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app