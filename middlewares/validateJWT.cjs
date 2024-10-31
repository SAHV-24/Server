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
    // Reemplaza "your-secret-key" con la clave secreta que usaste para firmar el JWT
    const decoded = jwt.verify(token, env.SECRET_JWT_SEED);

    // Si es válido, puedes almacenar el contenido del token en `req` para usarlo más adelante
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token no válido",
    });
  }
}

module.exports = validateJWT;
