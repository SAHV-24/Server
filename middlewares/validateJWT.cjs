const { response } = require("express");
const jwt = require("jwt-client");

function validateJWT(req, res = response, next) {
  // está en este encabezado??
  const token = req.header("jwt-token");

  if (!token) {
    return res.status(401).json({
      message: "No se ha enviado/generado ningún token",
    });
  }

  try {
    const isValid = jwt.validate(token);

    if (!isValid) {
      return res.status(401).json({
        message: "Token no válido",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token no válido",
    });
  }
}

module.exports = validateJWT;
