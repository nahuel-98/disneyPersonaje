const { Router } = require("express");
const router = Router();
const { User } = require("../db.js");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { encrypt, compare } = require("../helpers/handleBcrypt.js");
const jwt = require("jsonwebtoken"); //me permite crear y validar tokens
const config = require("../config");

const registrarUsuario = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Falta ingresar el valor de una o más propiedades para crear el usuario nuevo");
  }
  const emailEnBD = await User.findOne({ where: { email: email } });
  const passwordHash = await encrypt(password);
  if (!emailEnBD) {
    const user = await User.create({ username, email, password: passwordHash });
    // user.password = user.encryptPassword(user.password)

    //si no funca, quizas sea que no toma bien el id
    //usamos config.secret para codificar el token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    }); //me permite crear un token que dure 24 hs

    const msg = {
      to: `${email}`,
      from: process.env.SENDGRID_EMAIL,
      subject: "Bienvenido al maravilloso mundo de Disney",
      text: "Gracias por registrarte. Puedes iniciar sesión en POST /auth/login y obtener tu token de acceso.",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json({ auth: true, token });
  } else {
    return res.status(400).send("Ya hay un usuario creado con ese email");
  }
};

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Falta ingresar el valor de una o más propiedades para iniciar sesión");}

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).send("El email no existe");
  }

  const comparePassword = await compare(password, user.password);

  if (comparePassword) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(201).json({ auth: true, token });
  } else {
    return res.status(401).send("Contraseña inválida");
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
};
