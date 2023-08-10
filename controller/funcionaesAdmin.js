//importar modelos
const usuariecitos = require('../models/usuarios')
const clientecitos = require('../models/clientes'); 
const productitos = require('../models/productos');
const vendedorcitos = require('../models/vendedores');
const ventitas = require('../models/ventas') 

//Vistas ADMIN
exports.mostrarVistaAdmin =  (req, res) => {
  res.render('perfilAdmin')
}

exports.mostrarLandingAdmin = async (req,res) => {
  const listadoProductosP = await productitos.find();
  res.render('landingAdmin', {
    "productos" : listadoProductosP
  });
};

exports.mostrarAdministracion = async (req, res) => { //función para mostrar la inerfaz
    const listadoProductosAdmin = await productitos.find(); //se declara una constante donde busca en mongodb
    res.render('accionesProductos', {
      "productos" : listadoProductosAdmin // muestra el listado que se declaró en la constante.
    })
  }

//CRUD PRODUCTOS
exports.crearProducto =(req, res)=> {
    const productos = new productitos({ //Se declara una constante que extrae cada dato desde los nombres que tienen los campos del formulario respectivos.
        referencia: req.body.campoRef,
        nombre: req.body.campoNombre,
        descripcion: req.body.campoDescripcion,
        stock: req.body.campoStock,
        precio: req.body.campoPrecio,
        habilitado: req.body.campoEstado
    })
    productos.save() //guarda la constante que contiene el objeto
    res.redirect('administrarProductos') 
}

exports.eliminarProducto = async (req, res) => {
    let id = req.params._id //Se declara un id y de donde se extrae el parámetro.
    await productitos.findOneAndDelete({"_id":id}) //se se utiliza un método que busca el id que declaramos anteriormente
    res.redirect('/api/v1/administrarProductos')
}

exports.actualizarProducto = async (req, res) => {
  const editarid = {_id: req.body.campoId} //Se declara una constante con el dato que se utilizará para determinar el documento a actualizar
  const actualizar = {referencia: req.body.campoRefact, //Se declara la constante con los datos a editar.
                      nombre: req.body.campoNombreact,
                      descripcion: req.body.campoDescripcionact,
                      stock: req.body.campoStockact,
                      precio: req.body.campoPrecioact,
                      imagen: "https://ejemplo.com/imagen10.jpg",
                      habilitado: req.body.campoEstadoact,
                    }

  await productitos.findOneAndUpdate(editarid, actualizar) //Se utiliza un método que recibe los dos parámetros anteriormente declarados.
  res.redirect('/api/v1/administrarProductos')
  }

//
exports.autenticar = (req, res)=>{
  res.render('autenticacion')
}

exports.enviarEmail = (req, res) =>{
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lauraacostacd1@gmail.com',
        pass: 'ibuzxmyaljrnejff'
      }
    });
    
    var mailOptions = {
      from: 'lauraacostacd1@gmail.com',
      to: 'lacosta044@misena.edu.co',
      subject: 'Pruebita wi :3',
      text: 'FUNCIONA KKK'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
};

//VISTA VENDEDORES
exports.mostrarAdminVendedores = async (req, res) => {
  const listadoVendedores = await vendedorcitos.find();
  res.render('accionesVendedores', {
    "vendedores" : listadoVendedores
  })
};

//CRUD VENDEDORES
exports.crearVendedor = async(req, res)=> {
  const vendedor = new vendedorcitos({
      id: req.params._id,
      nombre: req.body.nombreVendedor,
      apellido: req.body.apellidoVendedor,
      correo: req.body.correoVendedor,
      documento: req.body.documentoVendedor,
      contrasena: req.body.contrasenaVendedor,
      ventasDespachadas: req.body.ventasdVendedor,

  })
  vendedor.save()
  const usuarioVendedor = new usuariecitos ({
    correo: vendedor.correo,
    contrasena: vendedor.contrasena,
    rol: 'Vendedor',
    habilitado: true
  })
  await usuarioVendedor.save()
  res.redirect('accionesVendedores')

};

exports.eliminarVendedor = async (req, res) => {
  let id = req.params._id
  await vendedorcitos.findOneAndDelete({"_id":id})
  res.redirect('accionesVendedores')
};

exports.actualizarVendedores = async (req, res) => {
  const editarid = {_id: req.body.idVendedor}
  const actualizar = {nombre: req.body.nombreactVendedor,
                      apellido: req.body.apellidoactVendedor,
                      correo: req.body.correoactVendedor,
                      documento: req.body.documentoactVendedor,
                      contrasena: req.body.contrasenaactVendedor,
                      ventasDespachadas: req.body.ventasactVendedor
                    }
  const actualizarUser = {correo: req.body.correoactVendedor,
                          contrasena: req.body.contrasenaactVendedor
  }
  console.log(actualizar)
  console.log(editarid)
  await vendedorcitos.findOneAndUpdate(editarid, actualizar)
  await usuariecitos.findOnedAndUpdate(actualizar.correo, actualizarUser)
  res.redirect('accionesVendedores')
  }

//CRUD USUARIOS ADMIN

exports.mostrarAdminClientes = async (req, res) => { //función para mostrar la inerfaz
  const listadoClientesAdmin = await clientecitos.find(); //se declara una constante donde busca en mongodb
  res.render('accionesClientes', {
    "clientes" : listadoClientesAdmin // muestra el listado que se declaró en la constante.
  })
}

exports.eliminarAdminCliente = async (req, res) => {
  let id = req.params._id
  await clientecitos.findOneAndDelete({"_id":id})
  res.redirect('accionesClientes')
};

exports.actualizarAdminCliente = async (req, res) => { //arreglar
  const editarid = {_id: req.body.idCliente}
  const actualizar = {nombre: req.body.nombreactCliente,
                      apellido: req.body.apellidoactCliente,
                      documento: req.body.documentoactCliente,
                      ventasDespachadas: req.body.ventasactCliente
                    }
  console.log(actualizar)
  console.log(editarid)
  await vendedorcitos.findOneAndUpdate(editarid, actualizar)
  res.redirect('accionesVendedores')
  };

exports.mostrarGrafica = async (req, res) => {
  const productosGrafica = await productitos.find();
  res.render('grafica', {
    "productosg" : productosGrafica
  })
}