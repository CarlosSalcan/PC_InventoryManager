const express=require('express')
const router=express.Router();

//const id='';
const equipo=require('../controllers/equipo.controller.js');

router.get('/equipos',equipo.getEquipos)

module.exports = router;