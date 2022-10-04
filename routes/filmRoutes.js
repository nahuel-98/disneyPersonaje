const express = require("express");
const {
  mostrarPelicula,
  detallePelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
} = require("../controllers/filmController.js");
// const verifyToken = require("../controllers/verifyToken.js");
const router = express.Router();

router.get("/movies", mostrarPelicula);

//8. Detalle de películas con sus personajes. Estado: Listo
router.get("/movies/:id", detallePelicula);

//9. CRUD. Estado: Listo
//Create- Estado: Listo -
router.post("/film", crearPelicula);

//Update- Estado: Listo
router.put("/movies/:id",  actualizarPelicula);

//Delete - Estado: Lista
router.delete("/movies/:id", eliminarPelicula);

module.exports = router;
