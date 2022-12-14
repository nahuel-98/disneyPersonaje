const express = require("express");
const {
  mostrarPelicula,
  detallePelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
} = require("../controllers/filmController.js");
const verifyToken = require("../controllers/verifyToken.js");
const router = express.Router();

router.get("/movies", verifyToken, mostrarPelicula);

//8. Detalle de películas con sus personajes. Estado: Listo
router.get("/movies/:id", verifyToken, detallePelicula);

//9. CRUD. Estado: Listo
//Create- Estado: Listo -
router.post("/film", verifyToken, crearPelicula);

//Update- Estado: Listo
router.put("/movies/:id", verifyToken, actualizarPelicula);

//Delete - Estado: Lista
router.delete("/movies/:id", verifyToken, eliminarPelicula);

module.exports = router;
