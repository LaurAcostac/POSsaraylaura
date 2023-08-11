const usuariecitos = require('../models/usuarios')
const clientecitos = require('../models/clientes');
const productitos = require('../models/productos');
const vendedorcitos = require('../models/vendedores');
const ventitas = require('../models/ventas');
const funcionesAdmin = require('../controller/funcionaesAdmin');
const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// IMPORTANT: Importamos jwt, para crear, verificar y decodificar los tokens.
const jwt = require('jsonwebtoken');
// IMPORTANT: Esta constante, será la clave que usemos para crear y verificar nuestros tokens.
const jwtSecret = 'secretito';


exports.mostrarPrincipal = async (req, res) => {
  const listadoProductosP = await productitos.find();
    res.render('landingPage', {
      "productos" : listadoProductosP
    }); //En esta ruta renderiza lo que hay en el archivo plantilla.
};

exports.mostrarRegistro = (req, res)=>{
    res.render('registrarClientes');
};

exports.mostrarInicioSesion = (req, res) =>{
  res.render('inicioSesion');
};

exports.mostrarCatalogo = async (req, res) => {
    const listadoProductos = await productitos.find();
    res.render('catalogo', {
      "productos" : listadoProductos
});
};

exports.mostrarCompra = async (req, res) => {
  res.render('formularioCompra')
}

exports.finalizarCompra = async (req, res) => {
 console.log("desde funciones"+ req.body.carritocompra) //Funcion para ver los productos del carrito al apretar pagar
 }

exports.crearUsuario = async (req, res) => {
  let correo = req.body.correoregistrar;
  console.log(correo);
  let contrasenaEncriptada = await bcrypt.hash(req.body.contregistrar, 10);

  let clienteRegistrado = await clientecitos.findOne({correo: correo});
  if (clienteRegistrado) {
    res.send('El correo ya está registrado');
  } else {
    let nuevoCliente = new clientecitos({
      nombre: req.body.nomregistrar,
      apellido: req.body.aperegistrar,
      telefono: req.body.telregistrar,
      ubicacion: {
        centro: [23, 45]
      },
      correo: correo,
      contrasena: contrasenaEncriptada  
    });
    console.log(nuevoCliente);
    await nuevoCliente.save();

    let usuarioCliente = new usuariecitos({
      correo: req.body.correoregistrar,
      contrasena: contrasenaEncriptada,
      rol: 'Cliente',
      habilitado: true
    });
    await usuarioCliente.save();
    return res.render('ingresarPerfil', {'cliente': nuevoCliente});
  }
}

//Inicio de sesión, validación, almacenamiento de la cookie e ingreso al perfil
exports.iniciarUsuario = async (req, res) => {
  const Correo = req.body.correoiniciar;
  const Contrasena = req.body.contrasenainiciar;

  try {
    const usuario = await usuariecitos.findOne({ correo: Correo });

    if (!usuario) {
      return res.status(500).send('EL USUARIO NO EXISTE');
    }

    //Comparación de contraseñas utilizando bcrypt.compare
    const esContrasenaCorrecta = await bcrypt.compare(Contrasena, usuario.contrasena);

    if (esContrasenaCorrecta) { 

      // Ahora verificamos el rol del usuario para renderizar la vista correspondiente
      if (usuario.rol === 'Cliente') {
        //Se asinga un token al usuario para crear la cookie y dejar la sesiòn iniciada
        // let token = jwt.sign({id: usuario._id}, jwtSecret, {expiresIn: 180000});
       
        const token = await jwt.sign({id: usuario._id}, jwtSecret, {expiresIn: 180000});
        console.log(token);
        let infoCliente = await clientecitos.findOne({ correo: Correo });
        res.cookie('token', token).render('ingresarPerfil', { "cliente": infoCliente });
      } else if (usuario.rol === 'vendedor') {
        let infoVendedor = await vendedorcitos.findOne({correo: Correo})
        res.cookie('token', token).render('perfilAdmin', { 'vendedor': infoVendedor });
      } else {
        return res.status(500).send('ROL NO RECONOCIDO');
      }
    } else {
      return res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('ERROR AL PROCESAR LA SOLICITUD: ' + error.message);
  }
};


//Verificación de existencia de un token, en caso de no ser así crearlo

exports.eliminarUsuario = async (req, res) =>{
  let id= req.params._id;
  let cliente= await clientecitos.findOneAndDelete ({"_id":id});
  let usuario = await usuariecitos.findOne ({"correo":cliente.correo});
  await usuariecitos.findOneAndDelete ({"_id":usuario.id});
  res.redirect('/api/v1/principal');
} 

exports.verifacionToken = async (req, res, next) =>{
  try {
    if(!req.headers.cookie){
      return res.render('inicioSesion');
    }
    const token =(req.headers.cookie).slice(6);
    jwt.verify(token, jwtSecret, (err, user)=>{
      if(err){
        return res.status(401).json({
          message: 'Token invàlido'
        })
      }
      req.id = user.id
      next();
      return;
    })
  } catch (error) {
    console.log(error)
  }
}

//Mostrar formulario que contiene los datos del usuario
exports.mostrarFormPerfil = async (req, res) => {
  const idUsuario = req.id
  const usuario = await usuariecitos.findById({"_id": idUsuario})
  const infoCliente = await clientecitos.findOne({"correo": usuario.correo})
  try {
    if(!usuario){
      return res.status(400).json({message: 'No se encontrò'})
    }
    res.render('ingresarPerfil', {
      "cliente": infoCliente
    });
  } catch (error) {
    console.log(error)
  }

}
//Update
exports.actualizarPerfil = async (req, res) =>{
    const editarid = {_id: req.body.idcliente}
    const actualizar = {nombre: req.body.nombrepCliente,
                        apellido: req.body.apellidopCliente,
                        telefono: req.body.telefonopCliente,
                        correo: req.body.correopCliente,
                      };
    const actualizarUser = {correo: req.body.correopCliente,
}
    console.log(actualizar)
    console.log(editarid)
    await clientecitos.findOneAndUpdate(editarid, actualizar)
    await usuariecitos.findOnedAndUpdate(actualizar.correo, actualizarUser)
    res.redirect('autenticarInicio')
    };

exports.cerrarSesion = async (req, res) => {
  res.clearCookie("token").redirect('principal')
}

exports.recuperarContrasena = async(req, res) => {
  res.render('recuperarContrasena')
}

exports.comprobarRecuperacion = async(req, res) =>{
  const nuevaContrasena = "recuperacion"
  const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, 10);
  const correo = req.body.emailrecuperar
  const cliente = await clientecitos.findOneAndUpdate({"Correo": correo}, {"Contrasena": contrasenaEncriptada});
  console.log(cliente)
  if(!cliente){
    return res.status(500).send('NN');  
  }else{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lauraacostacd1@gmail.com',
        pass: 'ibuzxmyaljrnejff'
      }
    });
    
    var mailOptions = {
      from: 'lauraacostacd1@gmail.com',
      to: correo,
      subject: 'Recuperación de contraseña',
      text: "su nueva contrasena es: "+nuevaContrasena
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.send('tu contraseña ha sido enviada')
};
}


//
// exports.enviarEmailcampo = (req, res) =>{
//     const nodemailer = require('nodemailer');

//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'sara.palacio79@misena.edu.co',
//         pass: 'zbvqrzmmnhjpekbl'
//       }
//     });
    
//     var mailOptions = {
//       from: 'sara.palacio79@misena.edu.co',
//       to: req.body.correito,
//       subject: 'Pruebita wi :3',
//       text: 'FUNCIONA KKK'
//     };
    
//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
    
// }

// exports.enviarSms = (req, res)=>{
//     const smpp = require('smpp');
//     const session = new smpp.Session({host: '0.0.0.0', port: 9500});

//     let isConnected = false
// session.on('connect', () => {
//   isConnected = true;

//   session.bind_transceiver({
//       system_id: 'USER_NAME',
//       password: 'USER_PASSWORD',
//       interface_version: 1,
//       system_type: '380666000600',
//       address_range: '+380666000600',
//       addr_ton: 1,
//       addr_npi: 1,
//   }, (pdu) => {
//     if (pdu.command_status == 0) {
//         console.log('Successfully bound')
//     }

//   })
// })

// session.on('close', () => {
//   console.log('smpp is now disconnected') 
   
//   if (isConnected) {        
//     session.connect();    //reconnect again
//   }
// })

// session.on('error', error => { 
//   console.log('smpp error', error)   
//   isConnected = false;
// });

// function enviarSms(from, to, text) {
//     from = `+${from}`  
    
//  // this is very important so make sure you have included + sign before ISD code to send sms
    
//     to = `+${to}`
   
//    session.submit_sm({
//        source_addr:      from,
//        destination_addr: to,
//        short_message:    text
//    }, function(pdu) {
//        if (pdu.command_status == 0) {
//            // Message successfully sent
//            console.log(pdu.message_id);
//        }
//    });
//  }
// }

// const xl = require('excel4node');
// const path = require('path')
// const fs = require('fs');


// exports.descargarExcel = async(req, res) => {
//     //configuramos el excel4node

//     //creamos un nuevo documento
//     const wb = new xl.Workbook();
//     //definimos el nombre con el cual se descargara el archivo 
//     const nombreArchivo = 'TablaProductos';
//     //se define el nombre 
//     var ws = wb.addWorksheet(nombreArchivo);

//     //definimos estilos
//     const columnaEstilo = wb.createStyle({
//         font: {
//             name: 'Arial',
//             color: '#000000',
//             size: 12,
//             bold: true,
//         }
//     });

//     const contenidoEstilo = wb.createStyle({
//         font: {
//             name: 'Arial',
//             color: '#565656',
//             size: 11,
//         }
//     });

//     //definimos el nombre de las columenas
//     ws.cell(1, 1).string('Categoria').style(columnaEstilo);
//     ws.cell(1, 2).string('Nombre').style(columnaEstilo);
//     ws.cell(1, 3).string('Descripcion').style(columnaEstilo);
//     ws.cell(1, 4).string('Precio').style(columnaEstilo);

//     //llamamos a la base de datos
//     const listaProductos = await productitos.find()

//     // definimos un contador que empiece en 2 
//     let fila = 2;

//     //agregamos el contenido de la base de datos con un for o un forEach para llamar todos los datos 
    
//     listaProductos.forEach(datoProducto => {
//     ws.cell(fila, 1).string(datoProducto.categoriaProducto).style(contenidoEstilo);
//     ws.cell(fila, 2).string(datoProducto.nombreProducto).style(contenidoEstilo);
//     ws.cell(fila, 3).string(datoProducto.descripcionProducto).style(contenidoEstilo);
//     ws.cell(fila, 4).number(datoProducto.precioProducto).style(contenidoEstilo);
    
//     fila = fila +1;
//     });

//     const rutaExcel = path.join(__dirname,'excel'+ nombreArchivo +'.xlsx');

//     //escribir y guardar en el documento 
//     //se le inclulle la ruta y una funcion 
//     wb.write(rutaExcel, function(err,stars){

//         //capturamos y mostramos en caso de un error
//         if(err)console.log(err);
//         //creamos una funcion que descargue el archibo y lo elimine 
//         else{

//             //guardamos el documento en la carpeta para excel para poder descargarla en el pc
//                 res.download(rutaExcel);
                
//                 console.log('documento descargado correctamente');

//                 //Eliminamos el documento de la carpeta excel
//                 fs.rm(rutaExcel, function(err){
//                     if(err)console.log(err);
//                     else console.log('Archivo descargado y borrado del servidor correctamente');
//                 });
                
//         }
//     });

// }


// IMPORTANT: La idea de este método era obtener del localStorage el token y verificarlo gracias al metodo verify del jwt.
// en caso de ser valido, lo decodifica (Obteniendo el payload que mencionaba antes).
// exports.validarToken = async () => {
//   let token = localStorage.getItem("token");
  
//   if(token) {
//     const valido = jwt.verify(token, jwtSecret);
//     if (valido) return jwt.decode(token);
//   } 
//   return null;
// };