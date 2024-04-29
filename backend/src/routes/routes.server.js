const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');
const parametro=require('../controllers/parametro.controller.js');

router.get('/equipos',equipo.getEquipos)
router.get('/equipo/:id',equipo.getEquipoById)
router.get('/parametros/:tabla',parametro.getParametros)

router.put('/enviar/:id',equipo.enviarEquipo)

module.exports = router;