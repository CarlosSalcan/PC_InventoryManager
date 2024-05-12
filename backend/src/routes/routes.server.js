const express=require('express')
const router=express.Router();

const equipo=require('../controllers/equipo.controller.js');
const parametro=require('../controllers/parametro.controller.js');

//--------------------------> Obtener equipos de BDD
//--------------------------> Obtener datos de BDD (Select)
//--------------------------> Tomar IDpara Enviar a Bodega (1)
//--------------------------> Obtener datos de CPU del equipo
router.get('/equipos', equipo.getEquipos);
router.get('/options/:tabla/:campo', equipo.obtenerOpcSelect);
router.get('/equipoB/:id',equipo.getEquipoById)
router.get('/cpu/:codEquipo', equipo.obtenerDatosCPU);

//--------------------------> Modificar Datos Equipo
//--------------------------> Enviar a Bodega (2)
router.put('/editEquipos/:codEquipo', equipo.modificarEquipo);
router.put('/enviarBodega/:id',equipo.enviarBodegaEquipo)

module.exports = router;