// importar modelos
const Usuariecitos = require('../models/usuarios');
const Clientecitos = require('../models/clientes');
const Productitos = require('../models/productos');
const Vendedorcitos = require('../models/vendedores');
const bcrypt = require('bcrypt');
// const ventitas = require('../models/ventas');
// const funcionesAdmin = require('../controller/funciones');
// Vistas ADMIN
exports.mostrarVistaAdmin = (req, res) => {
  res.render('perfilAdmin');
};

// exports.mostrarLandingAdmin = async (req,res) => {
//   const listadoProductosP = await Productitos.find();
//   res.render('landingAdmin', {
//     "productos" : listadoProductosP
//   });
// };

// CRUD PRODUCTOS
exports.mostrarAdministracion = async (req, res) => { // función para mostrar la inerfaz
  const listadoProductosAdmin = await Productitos.find(); // se declara una constante donde busca en mongodb
  res.render('accionesProductos', {
    productos: listadoProductosAdmin // muestra el listado que se declaró en la constante.
  });
};
exports.crearProducto = async (req, res) => {
  const productoRegistrado = await Productitos.findOne({ referencia: req.body.campoRef });
  if (productoRegistrado) {
    return res.json({ error: 'este producto ya está registrado' });
  }
  const productos = new Productitos({ // Se declara una constante que extrae cada dato desde los nombres que tienen los campos del formulario respectivos.
    referencia: req.body.campoRef,
    nombre: req.body.campoNombre,
    descripcion: req.body.campoDescripcion,
    stock: req.body.campoStock,
    precio: req.body.campoPrecio,
    habilitado: req.body.campoEstado
  });
  productos.save();// guarda la constante que contiene el objeto
  res.redirect('administrarProductos');
};

exports.eliminarProducto = async (req, res) => {
  const id = req.params._id; // Se declara un id y de donde se extrae el parámetro.
  await Productitos.findOneAndDelete({ _id: id }); // se se utiliza un método que busca el id que declaramos anteriormente
  res.redirect('/api/v1/administrarProductos');
};

exports.actualizarProducto = async (req, res) => {
  const editarid = { _id: req.body.campoId };// Se declara una constante con el dato que se utilizará para determinar el documento a actualizar
  const actualizar = {
    referencia: req.body.campoRefact, // Se declara la constante con los datos a editar.
    nombre: req.body.campoNombreact,
    descripcion: req.body.campoDescripcionact,
    stock: req.body.campoStockact,
    precio: req.body.campoPrecioact,
    imagen: 'https://ejemplo.com/imagen10.jpg',
    habilitado: req.body.campoEstadoact
  };

  await Productitos.findOneAndUpdate(editarid, actualizar);// Se utiliza un método que recibe los dos parámetros anteriormente declarados.
  res.redirect('/api/v1/administrarProductos');
};

// VISTA VENDEDORES
exports.mostrarAdminVendedores = async (req, res) => {
  const listadoVendedores = await Vendedorcitos.find();
  res.render('accionesVendedores', {
    vendedores: listadoVendedores
  });
};

// CRUD VENDEDORES
exports.crearVendedor = async (req, res) => {
  const vendedorRegistrado = await Vendedorcitos.findOne({ correo: req.body.correoVendedor });
  const usuarioRegistrado = await Usuariecitos.findOne({ correo: req.body.correoVendedor });
  const contrasenaEncriptada = await bcrypt.hash(req.body.contrasenaVendedor, 10);
  if (vendedorRegistrado || usuarioRegistrado) {
    return res.json({ error: 'Este vendedor ya está registrado' });
  }
  const vendedor = new Vendedorcitos({
    id: req.params._id,
    nombre: req.body.nombreVendedor,
    apellido: req.body.apellidoVendedor,
    correo: req.body.correoVendedor,
    documento: req.body.documentoVendedor,
    contrasena: contrasenaEncriptada,
    ventasDespachadas: req.body.ventasdVendedor

  });
  console.log(vendedor);
  await vendedor.save();

  const usuarioVendedor = new Usuariecitos({
    correo: req.body.correoVendedor,
    contrasena: contrasenaEncriptada,
    rol: 'Vendedor',
    habilitado: true
  });
  await usuarioVendedor.save();
  res.redirect('accionesVendedores');
};

exports.eliminarVendedor = async (req, res) => { // arreglar
  const id = req.params.id;
  const vendedor = await Vendedorcitos.findOneAndDelete({ _id: id });
  const usuario = await Usuariecitos.findOne({ correo: vendedor.correo });
  await Usuariecitos.findOneAndDelete({ _id: usuario.id });
  res.redirect('/api/v1/accionesVendedores');
};

exports.actualizarVendedores = async (req, res) => {
  const editarid = { _id: req.body.idVendedor };
  const infoVendedor = await Vendedorcitos.findById(editarid);
  const correoUsuario = infoVendedor.correo;
  const actualizar = {
    nombre: req.body.nombreactVendedor,
    apellido: req.body.apellidoactVendedor,
    correo: req.body.correoactVendedor,
    documento: req.body.documentoactVendedor,
    contrasena: req.body.contrasenaactVendedor,
    ventasDespachadas: req.body.ventasactVendedor
  };
  const actualizarUser = {
    correo: actualizar.correo,
    contrasena: actualizar.contrasena
  };
  await Vendedorcitos.findByIdAndUpdate(editarid, actualizar);
  await Usuariecitos.findOneAndUpdate({ correo: correoUsuario }, actualizarUser);
  res.redirect('accionesVendedores');
};

// CRUD USUARIOS ADMIN

exports.mostrarAdminClientes = async (req, res) => { // función para mostrar la inerfaz
  const listadoClientesAdmin = await Clientecitos.find(); // se declara una constante donde busca en mongodb
  res.render('accionesClientes', {
    clientes: listadoClientesAdmin // muestra el listado que se declaró en la constante.
  });
};

exports.eliminarAdminCliente = async (req, res) => {
  const id = req.params._id;
  const objetoCliente = await Clientecitos.findOneAndDelete({ _id: id });
  console.log(objetoCliente);
  await Usuariecitos.findOneAndDelete({ correo: objetoCliente.correo });
  res.redirect('/api/v1/accionesClientes');
};

exports.actualizarAdminCliente = async (req, res) => {
  const editarid = req.body.idcliente;
  const correoFormulario = req.body.correoactCliente;
  // guardo la informacion del cliente en una variable cliente
  const cliente = await Clientecitos.findById({ _id: editarid });
  // Se verifica si el correo que se quiere actualizar ya existe en la base de datos
  if (cliente.correo !== correoFormulario) {
    const emailRegistrado = await Clientecitos.findOne({ correo: correoFormulario });
    if (emailRegistrado) {
      return res.send('El correo ya está registrado');
    }
  }
  const actualizar = {
    nombre: req.body.nombreactCliente,
    apellido: req.body.apellidoactCliente,
    telefono: req.body.documentoactCliente,
    correo: req.body.correoactCliente
  };

  const actualizarUser = {
    correo: req.body.correoactCliente
  };
  await Clientecitos.findByIdAndUpdate({ _id: editarid }, actualizar);
  // Se le pasan los datos para guardarlos
  await Usuariecitos.findOneAndUpdate({ correo: cliente.correo }, actualizarUser);
  // se envian los datos del cliente para que no salga error
  res.redirect('accionesClientes');
};

exports.mostrarGrafica = async (req, res) => {
  const productosGrafica = await Productitos.find();
  res.render('grafica', {
    productosg: productosGrafica
  });
};
