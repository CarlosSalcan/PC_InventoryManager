const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');
const parametro=require('../controllers/parametro.controller.js');

router.get('/equipos',equipo.getEquipos)
router.get('/parametros/:tabla',parametro.getParametros)

router.put('/modificarNombre/:tabla/:campo/:valor/:nuevoNombre', parametro.editarNombreParametro);

router.delete('/borrar/:tabla/:campo/:valor', parametro.borrarParametro);

module.exports = router;