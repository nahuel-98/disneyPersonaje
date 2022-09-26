const express = require('express');
const {
    registrarUsuario,
    iniciarSesion
    } = require('../controllers/authController.js');
const router = express.Router()
// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // const User = require('../models/User')
// const jwt = require("jsonwebtoken"); //me permite crear y validar tokens
// const config = require("../config");

router.post("/auth/register", registrarUsuario)

router.post("/auth/login", iniciarSesion);


module.exports = router
