const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');

router.get('/equipos',equipo.getEquipos)

router.put('/editar/:id',equipo.editarEquipo)

module.exports = router;