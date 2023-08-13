const mongoose = require('../config/connection') //Importo mongoose
const bcrypt = require('bcrypt'); //Importar encriptador

const saltRounds = 10;

const SchemaUsuario = new mongoose.Schema({ //Se crea el esquema con la información que va a tener cada colección
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
    habilitado:{
        type: Boolean,
        required: true
    }
});
//Crear un procedimento para hacer un hash 
// SchemaUsuario.pre('save', function (next) {
//     if (this.isNew || this.isModified('contrasena')) {
//       const document = this;
  
//       bcrypt.hash(document.contrasena, saltRounds, (err, hashedcontrasena) => {
//         if (err) {
//           next(err);
//         } else {
//           document.contrasena = hashedcontrasena;
//           next();
//         }
//       });
//     } else {
//       next();
//     }
//   });
  
//   // Método para comprobar si la contraseña es correcta
//   SchemaUsuario.methods.contrasenaCorrecta = function(contrasena, callback) {
//     console.log('contrasena:', contrasena);
//     console.log('this.contrasena:', this.contrasena);
//     bcrypt.compare(contrasena, this.contrasena, function (err, res) {
//       if (err) {
//         callback(err);
//       } else {
//         console.log('Comparación de contraseñas:', res);
//         callback(null, res);
//       }
//     });
//   };
  
const usuario = mongoose.model('Usuario', SchemaUsuario) //Crear un modelo a partir del esquema anteriormente creado

module.exports = usuario