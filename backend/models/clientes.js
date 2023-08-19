const mongoose = require('../config/connection'); // Importo mongoose

const SchemaCliente = new mongoose.Schema({ // Se crea el esquema con la información que va a tener cada colección
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  ubicacion: {
    centro: {
      type: Array,
      required: true
    },
    zoom: {
      type: Number,
      default: 10
    }
  },
  totalComprado: {
    type: Number,
    default: 0
  },
  historicoCompras: {
    type: Array,
    default: []
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  }

});

const cliente = mongoose.model('Cliente', SchemaCliente); // Crear un modelo a partir del esquema anteriormente creado

module.exports = cliente;
