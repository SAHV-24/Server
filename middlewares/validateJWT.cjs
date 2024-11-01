const { response } = require("express");
const jwt = require("jsonwebtoken");
const env = process.env;

function validateJWT(req, res = response, next) {
  const token = req.header("jwt-token");

  if (!token) {
    return res.status(401).json({
      message: "No se ha enviado/generado ningún token",
    });
  }

  try {
    // Verifica el token y extrae el payload
    const decoded = jwt.verify(token, env.SECRET_JWT_SEED);

    // Agrega los datos del payload (por ejemplo, username) a req
    req.user = {
      uid: decoded.uid,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token no válido",
    });
  }
}

module.exports = validateJWT;
