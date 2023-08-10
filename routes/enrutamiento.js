const acciones = require('../controller/funciones');
const accionesAdmin = require('../controller/funcionaesAdmin');
const express = require('express');
const router =  express.Router();

router.get('/principal', acciones.mostrarPrincipal);
router.get('/catalogo', acciones.mostrarCatalogo);
router.get('/perfilAdmin', accionesAdmin.mostrarVistaAdmin);
router.get('/landingadmin', accionesAdmin.mostrarLandingAdmin);
router.get('/grafica', accionesAdmin.mostrarGrafica);

router.get('/administrarProductos', accionesAdmin.mostrarAdministracion);
router.post('/crearProductos', accionesAdmin.crearProducto);
router.post('/actualizarProductos', accionesAdmin.actualizarProducto)
router.get('/eliminarProductos/:_id', accionesAdmin.eliminarProducto);

router.get('/accionesVendedores', accionesAdmin.mostrarAdminVendedores);
router.post('/crearVendedores', accionesAdmin.crearVendedor);
router.post('/actualizarVendedores', accionesAdmin.actualizarVendedores);
router.get('/eliminarVendedores/:_id', accionesAdmin.eliminarVendedor); //arreglar

router.get('/accionesClientes', accionesAdmin.mostrarAdminClientes);
router.post('/actualizarClientes', accionesAdmin.actualizarAdminCliente);
router.get('/eliminarClientes/:_id', accionesAdmin.eliminarAdminCliente);

router.get('/formularioregistro', acciones.mostrarRegistro);
router.post('/registrar', acciones.crearUsuario);
router.get('/iniciosesion', acciones.mostrarInicioSesion);
router.post('/autenticarInicio', acciones.iniciarUsuario);
router.get('/mostrarperfil', acciones.verifacionToken, acciones.mostrarFormPerfil);
router.get('/cerrarsesion', acciones.cerrarSesion);
router.get('/recuperarContrasena', acciones.recuperarContrasena);
router.post('/enviarCorreo', acciones.comprobarRecuperacion);


router.get('/autenticar', accionesAdmin.enviarEmail);
router.get('/formularioCompra', acciones.mostrarCompra);

//router.post('/autenticarcorreo', acciones.enviarEmailcampo)
//router.get('/descargarexcel', acciones.descargarExcel)

module.exports = router