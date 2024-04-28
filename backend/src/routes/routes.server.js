const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');

router.get('/equipos',equipo.getEquipos)
router.get('/equipo/:id',equipo.getEquipoById)

router.put('/enviar/:id',equipo.enviarEquipo)

module.exports = router;