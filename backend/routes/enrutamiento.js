const acciones = require('../controller/funciones');
const accionesAdmin = require('../controller/funcionaesAdmin');
const express = require('express');
const router =  express.Router();

//Interfaces generales
router.get('/principal', acciones.mostrarPrincipal);
router.get('/catalogo', acciones.mostrarCatalogo);
router.get('/perfilAdmin', accionesAdmin.mostrarVistaAdmin);
//router.get('/landingadmin', accionesAdmin.mostrarLandingAdmin);
router.get('/grafica', accionesAdmin.mostrarGrafica);

//CRUD productos
router.get('/administrarProductos', accionesAdmin.mostrarAdministracion);
router.post('/crearProductos', accionesAdmin.crearProducto);
router.post('/actualizarProductos', accionesAdmin.actualizarProducto)
router.get('/eliminarProductos/:_id', accionesAdmin.eliminarProducto);

//CRUD vendedores
router.get('/accionesVendedores', accionesAdmin.mostrarAdminVendedores);
router.post('/crearVendedores', accionesAdmin.crearVendedor);
router.post('/actualizarVendedores', accionesAdmin.actualizarVendedores);
router.get('/eliminarVendedor/:id', accionesAdmin.eliminarVendedor); //arreglar

//CRUD ADMIN clientes 
router.get('/accionesClientes', accionesAdmin.mostrarAdminClientes);
router.post('/actualizarCliente', accionesAdmin.actualizarAdminCliente);
router.get('/eliminarClientes/:_id', accionesAdmin.eliminarAdminCliente);


router.get('/formularioregistro', acciones.mostrarRegistro); //Mostrar el formulario
router.get('/iniciosesion', acciones.mostrarInicioSesion); //Mostrar formulario inicio sesion
router.get('/mostrarperfil', acciones.verificacionToken, acciones.mostrarFormPerfil); //Mostrar datos del perfil y verficiación del token
router.get('/recuperarContrasena', acciones.recuperarContrasena);//formulario de envío de recuperación

router.get('/formularioregistro', acciones.mostrarRegistro);
router.post('/registrar', acciones.crearUsuario);
router.get('/iniciosesion', acciones.mostrarInicioSesion);
// router.post('/autenticarInicio', acciones.iniciarUsuario);
router.get('/mostrarperfil', acciones.verificacionToken, acciones.mostrarFormPerfil);
router.get('/cerrarsesion', acciones.cerrarSesion);
router.get('/recuperarContrasena', acciones.recuperarContrasena);
router.post('/enviarCorreo', acciones.comprobarRecuperacion);
router.get('/eliminarusuario/:_id', acciones.eliminarUsuario);


router.post('/registrar', acciones.crearUsuario); //Post registro CRUD cliente
router.post('/autenticarInicio', acciones.iniciarUsuario); //Validación para inicio de sesion
router.get('/cerrarsesion', acciones.cerrarSesion); //Opción para borrar la cookie y cerrar la sesión
router.post('/enviarCorreo', acciones.comprobarRecuperacion);//Envío de recuperación


//router.get('/autenticar', accionesAdmin.enviarEmail);
router.get('/formularioCompra', acciones.mostrarCompra);

//router.post('/autenticarcorreo', acciones.enviarEmailcampo)
//router.get('/descargarexcel', acciones.descargarExcel)

module.exports = router