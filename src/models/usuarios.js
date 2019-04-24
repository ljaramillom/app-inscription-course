// mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schema
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    documento: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'estudiante'
    },
    curso: {
        type: String,
        required: true,
        default: 'NodeJS'
    },
    imagen: {
        type: Buffer
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con el mismo documento ingresado.' });
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario