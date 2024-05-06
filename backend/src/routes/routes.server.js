const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');
const parametro=require('../controllers/parametro.controller.js');

//--------------------------> Obtener datos de BDD
router.get('/equipos', equipo.getEquipos);
router.get('/parametros/:tabla', parametro.getParametros);
router.get('/options/:tabla/:campo', equipo.obtenerOpciones);

//--------------------------> Enviar a Bodega
router.get('/equipo/:id',equipo.getEquipoById)
router.put('/enviarBodega/:id',equipo.enviarBodegaEquipo)

//--------------------------> Modificar Nombre 
router.put('/modificarNombre/:tabla/:campo/:valor/:nuevoNombre', parametro.editarNombreParametro);

//--------------------------> Borrar Parametro
router.delete('/borrar/:tabla/:campo/:valor', parametro.borrarParametro);

module.exports = router;