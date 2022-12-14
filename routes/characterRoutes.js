const express = require("express");
const {
  obtenerPersonajes,
  crearPersonaje,
  detallePersonaje,
  eliminarPersonaje,
  actualizarPersonaje,
} = require("../controllers/characterControllers.js");
const verifyToken = require("../controllers/verifyToken.js");
// const isAdmin = require('../middlewares/isAdmin.js')
const router = express.Router();

//3. Listado de personajes - ESTADO: HECHO
//6. Busqueda de personajes - Estado: HECHO - Busqueda por nombre, edad y IdMovie.
router.get("/characters", verifyToken, obtenerPersonajes);

//5. Detalle de Personaje. ESTADO: HECHO
router.get("/character/:id", verifyToken, detallePersonaje);

//4. CRUD. - listo

//CREATE. ESTADO: LISTO
router.post("/character", verifyToken, crearPersonaje);

//UPDATE. ESTADO: LISTO
router.put("/character/:id", verifyToken, actualizarPersonaje);

//DELETE. ESTADO: LISTA
router.delete("/character/:id", verifyToken, eliminarPersonaje);

module.exports = router;
