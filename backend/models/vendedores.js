const mongoose = require('../config/connection');

const SchemaVendedor = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required:true
    },
    documento: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type:String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    ventasDespachadas: {
        type: String,
        default: 0 // Sujeto a cambios
    }

});

const vendedor = mongoose.model('Vendedor', SchemaVendedor);

module.exports = vendedor;