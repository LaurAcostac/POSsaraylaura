const mongoose = require('../backend/config/connection')

const SchemaProducto = new mongoose.Schema({ //Se crea el esquema con la información que va a tener cada colección
    referencia: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        default: 0
    },
    imagen: {
        type: String
    },
    habilitado: {
        type: Boolean
    }
});

const producto = mongoose.model('Producto', SchemaProducto);

module.exports = producto