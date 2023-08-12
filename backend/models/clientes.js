const mongoose = require('../backend/config/connection') //Importo mongoose
const bcrypt = require('bcrypt'); //Importar encriptador

const saltRounds = 10;

const SchemaCliente = new mongoose.Schema({ //Se crea el esquema con la información que va a tener cada colección
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
//Crear un procedimento para hacer un hash 
// SchemaCliente.pre('save', function (next) {
//   if (this.isNew || this.isModified('contrasena')) {
//     const document = this;

//     bcrypt.hash(document.contrasena, saltRounds, (err, hashedcontrasena) => {
//       if (err) {
//         next(err);
//       } else {
//         document.contrasena = hashedcontrasena;
//         next();
//       }
//     });
//   } else {
//     next();
//   }
// });

// // Método para comprobar si la contraseña es correcta
// SchemaCliente.methods.contrasenaCorrecta = function(contrasena, callback) {
//   console.log('contrasena:', contrasena);
//   console.log('this.contrasena:', this.contrasena);
//   bcrypt.compare(contrasena, this.contrasena, function (err, res) {
//     if (err) {
//       callback(err);
//     } else {
//       console.log('Comparación de contraseñas:', res);
//       callback(null, res);
//     }
//   });
// };
  
const cliente = mongoose.model('Cliente', SchemaCliente) //Crear un modelo a partir del esquema anteriormente creado

module.exports = cliente