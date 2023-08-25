const Usuariecitos = require('../models/usuarios');
const Clientecitos = require('../models/clientes');
const Productitos = require('../models/productos');
const Vendedorcitos = require('../models/vendedores');
const Ventitas = require('../models/ventas');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// IMPORTANT: Importamos jwt, para crear, verificar y decodificar los tokens.
const jwt = require('jsonwebtoken');
// IMPORTANT: Esta constante, será la clave que usemos para crear y verificar nuestros tokens.
const jwtSecret = 'secretito';

exports.mostrarPrincipal = async (req, res) => {
  const listadoProductosP = await Productitos.find();
  res.render('landingPage', {
    productos: listadoProductosP
  }); // En esta ruta renderiza lo que hay en el archivo plantilla.
};

exports.mostrarRegistro = (req, res) => {
  res.render('registrarClientes');
};

exports.mostrarInicioSesion = (req, res) => {
  res.render('inicioSesion');
};

exports.mostrarCatalogo = async (req, res) => {
  const listadoProductos = await Productitos.find();
  res.render('catalogo', {
    productos: listadoProductos
  });
};

exports.mostrarCompra = async (req, res) => {
  const elId = req.id;
  const usuarioLogueado = await Usuariecitos.findById(elId);
  const clienteCompra = await Clientecitos.findOne({ correo: usuarioLogueado.correo });
  console.log(clienteCompra);
  res.render('formularioCompra', {
    clientecompra: clienteCompra
  });
};

exports.finalizarCompra = async (req, res) => {
  try {
    const usuario = await Usuariecitos.findById(req.id);
    const clienteCompra = await Clientecitos.findOne({ correo: usuario.correo });
    const carrito = JSON.parse(req.body.carritocompra); // Hacemos el parse porque carritocompra llega como string (necesitamos un array de objetos para pasarcelo a Ventitas)
    console.log('este es el ' + req.id);
    let subtotalVenta = 0;
    carrito.forEach(producto => {
      subtotalVenta += producto.precio * producto.cantidad;
    }); // calculamos el subtotal usando un lindo forEach

    const impuesto = subtotalVenta * 0.19;

    const nuevaVenta = new Ventitas({
      ProductosVenta: carrito,
      SubtotalVenta: subtotalVenta,
      FechaVenta: Date.now(),
      Impuesto: impuesto,
      TotalVenta: subtotalVenta + impuesto,
      ClienteVenta: req.body.nomcompra + ' ' + req.body.apecompra,
      VendedorVenta: 'A través de la página'
    });

    await nuevaVenta.save();
    clienteCompra.totalComprado += nuevaVenta.TotalVenta;
    clienteCompra.historicoCompras.push(carrito);
    await clienteCompra.save();
    // IMPORTANT: Quizá lo mejor sería eliminar dichos productos a partir de aquí... pero asumamos que no se acaba el stock...

    // Y... luego redirigimos
    const ventasHechas = JSON.stringify(await Ventitas.find());
    res.send(`<h3>Ventas hechas?</h3>
    <p>${ventasHechas}</p>`);
  } catch {
    res.send('Hubo un problema al realizar el pago');
  }
};

exports.mostrarCompraExitosa = (req, res) => {
  res.render('compraExitosa');
};

// CRUD VISTA CLIENTE
exports.crearUsuario = async (req, res) => {
  const correo = req.body.correoregistrar;
  console.log(correo);
  const contrasenaEncriptada = await bcrypt.hash(req.body.contregistrar, 10);

  const clienteRegistrado = await Clientecitos.findOne({ correo });
  if (clienteRegistrado) {
    res.send('El correo ya está registrado');
  } else {
    const nuevoCliente = new Clientecitos({
      nombre: req.body.nomregistrar,
      apellido: req.body.aperegistrar,
      telefono: req.body.telregistrar,
      ubicacion: {
        centro: [23, 45]
      },
      correo,
      contrasena: contrasenaEncriptada
    });
    console.log(nuevoCliente);
    await nuevoCliente.save();

    const usuarioCliente = new Usuariecitos({
      correo: req.body.correoregistrar,
      contrasena: contrasenaEncriptada,
      rol: 'Cliente',
      habilitado: true
    });
    await usuarioCliente.save();
    return res.render('ingresarPerfil', { cliente: nuevoCliente });
  }
};

// Inicio de sesión, validación, almacenamiento de la cookie e ingreso al perfil
exports.iniciarUsuario = async (req, res) => {
  const Correo = req.body.correoiniciar;
  const Contrasena = req.body.contrasenainiciar;

  try {
    const usuario = await Usuariecitos.findOne({ correo: Correo });

    if (!usuario) {
      return res.status(500).send('EL USUARIO NO EXISTE');
    }

    // Comparación de contraseñas utilizando bcrypt.compare
    const esContrasenaCorrecta = await bcrypt.compare(Contrasena, usuario.contrasena);
    const token = await jwt.sign({ id: usuario._id }, jwtSecret, { expiresIn: 180000 });
    if (esContrasenaCorrecta) {
      // Ahora verificamos el rol del usuario para renderizar la vista correspondiente
      if (usuario.rol === 'Cliente') {
        console.log(token);
        console.log(Correo);
        const infoCliente = await Clientecitos.findOne({ correo: Correo });
        console.log(infoCliente);
        res.cookie('token', token).redirect('mostrarperfil');
      } else if (usuario.rol === 'Vendedor') {
        const infoVendedor = await Vendedorcitos.findOne({ correo: Correo });
        console.log(infoVendedor);
        res.cookie('token', token).render('perfilAdmin', {
          vendedor: infoVendedor
        });
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

// Verificación de existencia de un token, en caso de no ser así crearlo

exports.eliminarUsuario = async (req, res) => {
  const id = req.params._id;
  const cliente = await Clientecitos.findOneAndDelete({ _id: id });
  const usuario = await Usuariecitos.findOne({ correo: cliente.correo });
  await Usuariecitos.findOneAndDelete({ _id: usuario.id });
  res.redirect('/api/v1/principal');
};

exports.verificacionToken = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.render('inicioSesion');
    }
    const token = (req.headers.cookie).slice(6);
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(401).json({
          message: 'Token invàlido'
        });
      }
      req.id = user.id;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

// Mostrar formulario que contiene los datos del usuario
exports.mostrarFormPerfil = async (req, res) => {
  const idUsuario = req.id;
  const usuario = await Usuariecitos.findById({ _id: idUsuario });
  const infoCliente = await Clientecitos.findOne({ correo: usuario.correo });
  try {
    if (!usuario) {
      return res.status(400).json({ message: 'No se encontrò' });
    }
    res.render('ingresarPerfil', {
      cliente: infoCliente
    });
  } catch (error) {
    console.log(error);
  }
};
// Update
exports.actualizarPerfil = async (req, res) => {
  const idCliente = req.body.idcliente;
  // guardo la informacion del cliente en una variable cliente
  const cliente = await Clientecitos.findById({ _id: idCliente });
  // Se verifica si el correo que se quiere actualizar ya existe en la base de datos
  if (cliente.correo !== req.body.correopCliente) {
    const emailRegistrado = await Clientecitos.findOne({ correo: req.body.correopCliente });
    if (emailRegistrado) {
      return res.json({ error: 'El correo ya está registrado' });
    }
  }
  const actualizar = {
    nombre: req.body.nombrepCliente,
    apellido: req.body.apellidopCliente,
    telefono: req.body.telefonopCliente,
    correo: req.body.correopCliente
  };

  const actualizarUser = {
    correo: req.body.correopCliente
  };
  await Clientecitos.findByIdAndUpdate({ _id: idCliente }, actualizar);
  // Se le pasan los datos para guardarlos
  await Usuariecitos.findOneAndUpdate({ correo: cliente.correo }, actualizarUser);
  // se envian los datos del cliente para que no salga error
  res.render('ingresarPerfil', {
    cliente: actualizar
  });
};
exports.cerrarSesion = async (req, res) => {
  res.clearCookie('token').redirect('principal');
};

exports.recuperarContrasena = async (req, res) => {
  res.render('recuperarContrasena');
};

exports.comprobarRecuperacion = async (req, res) => {
  const nuevaContrasena = 'recuperacion';
  const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, 10);
  const correo = req.body.emailrecuperar;
  const cliente = await Clientecitos.findOneAndUpdate({ Correo: correo }, { Contrasena: contrasenaEncriptada });
  console.log(cliente);
  if (!cliente) {
    return res.status(500).send('NN');
  } else {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lauraacostacd1@gmail.com',
        pass: process.env.PASSWORDVERIFICACION
      }
    });
    const mailOptions = {
      from: 'lauraacostacd1@gmail.com',
      to: correo,
      subject: 'Recuperación de contraseña',
      text: 'su nueva contrasena es: ' + nuevaContrasena
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.send('tu contraseña ha sido enviada');
  }
};
