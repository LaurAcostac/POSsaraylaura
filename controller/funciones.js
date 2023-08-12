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

//CRUD VISTA CLIENTE
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
        console.log(Correo)
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

exports.verificacionToken = async (req, res, next) =>{
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
  } else {
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
  }
}
