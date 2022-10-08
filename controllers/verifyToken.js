const jwt = require("jsonwebtoken");
const config = require("../config");

// BOOOOOOOOORRRRRRRRRRRRRRRAAAAAAAAAAAR TODO ESTE ARCHIVOOOOOOOOOOOOOOOOOOOOO

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided",
    });
  }
  const decoded = jwt.verify(token, config.secret);
  req.userId = decoded.id;
  next();
}

module.exports = verifyToken;
