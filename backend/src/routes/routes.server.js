const express = require('express')
const router = express.Router();

const equipo = require('../controllers/equipo.controller.js');
const parametro = require('../controllers/parametro.controller.js');
const login = require('../controllers/user.controller.js');

//--------------------------> Obtener equipos de BDD
//--------------------------> Obtener datos de BDD (Select)
//--------------------------> Tomar IDpara Enviar a Bodega (P1)
//--------------------------> Obtener parametros
//--------------------------> Obtener datos de Componentes del equipo (CPU, MONITOR, TECLADO, MOUSE)     
//--------------------------> Obtener equipos de Reporte
//--------------------------> Buscar por Tipo BDD
//--------------------------> Obtener nuevo codigo para nuevo Equipo
//--------------------------> Obtener ultimos codigos ingresados
//--------------------------> Obtener Datos para Reportes
router.get('/equipos', equipo.getEquipos);
router.get('/options/:tabla/:campo', equipo.obtenerOpcSelect);
router.get('/equipoB/:id', equipo.getEquipoById)
router.get('/parametros/:tabla', parametro.getParametros);
router.get('/datosTabla/:tabla/:codEquipo', equipo.obtenerDatosComponentes);
router.get('/equiposR', equipo.getEquiposReporte);
router.get('/buscarEquipos/:tipoEquipo/:query', equipo.buscarEquipos);
router.get('/getNextCod/:tableName/:campo', equipo.getNextCodEquipo);
router.get('/obtenerUltimosCodAlmacen', equipo.obtenerUltimosCodAlmacen);
router.get('/reporte/:tabla', equipo.getRegistrosTables);

//--------------------------> Modificar Datos Equipo
//--------------------------> Enviar a Bodega (P2)
//--------------------------> Modificar Nombre Parametro
//--------------------------> Modificar CPU
//--------------------------> Modificar Monitor
//--------------------------> Modificar Teclado
//--------------------------> Modificar Mouse
//--------------------------> Modificar Laptop
//--------------------------> Modificar Impresora
//--------------------------> Modificar Telfono
router.put('/editEquipos/:codEquipo', equipo.modificarEquipo);
router.put('/enviarBodega/:id', equipo.enviarBodegaEquipo)
router.put('/modificarNombre/:tabla/:campo/:valor/:nuevoNombre', parametro.editarNombreParametro);
router.put('/cpuModificado/:codEquipo', equipo.guardarCambiosCPU);
router.put('/mtrModificado/:codEquipo', equipo.guardarCambiosMTR);
router.put('/tcdModificado/:codEquipo', equipo.guardarCambiosTCD);
router.put('/msModificado/:codEquipo', equipo.guardarCambiosMS);
router.put('/laptopModificada/:codEquipo', equipo.guardarCambiosLaptop);
router.put('/impresoraModificada/:codEquipo', equipo.guardarCambiosImpresora);
router.put('/telefonoModificado/:codEquipo', equipo.guardarCambiosTelefono);

//--------------------------> Agregar nuevo Parametro
//--------------------------> Agregar nuevo Equipo
//--------------------------> Agregar nuevo CPU
//--------------------------> Agregar nuevo MTR
//--------------------------> Agregar nuevo TCL
//--------------------------> Agregar nuevo MS
//--------------------------> Agregar nuevo LAPTOP
//--------------------------> Agregar nuevo IMP
//--------------------------> Agregar nuevo TLF
//--------------------------> Verificar LOGIN
router.post('/nuevoParametro/:tabla', parametro.nuevoParametro);
router.post('/ingresarEquipo', equipo.nuevoEquipo);
router.post('/guardarCPU', equipo.guardarCPU);
router.post('/guardarMTR', equipo.guardarMTR);
router.post('/guardarTCL', equipo.guardarTCL);
router.post('/guardarMS', equipo.guardarMS);
router.post('/guardarLaptop', equipo.guardarLaptop);
router.post('/guardarIMP', equipo.guardarIMP);
router.post('/guardarTLF', equipo.guardarTLF);
router.post('/login', login.loginUser);

module.exports = router;