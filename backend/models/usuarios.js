const mongoose = require('../config/connection');// Importo mongoose

const SchemaUsuario = new mongoose.Schema({ // Se crea el esquema con la información que va a tener cada colección
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  habilitado: {
    type: Boolean,
    required: true
  }
});

const usuario = mongoose.model('Usuario', SchemaUsuario); // Crear un modelo a partir del esquema anteriormente creado

module.exports = usuario;
