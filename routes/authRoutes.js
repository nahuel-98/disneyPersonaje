const express = require("express");
const {
  registrarUsuario,
  iniciarSesion,
} = require("../controllers/authController.js");
const router = express.Router();

router.post("/auth/register", registrarUsuario);

router.post("/auth/login", iniciarSesion);

module.exports = router;
