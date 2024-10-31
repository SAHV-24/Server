const { response } = require("express");
const jwt = require("jsonwebtoken");

// Función para saber si la persona que está ejecutando una acción
// tiene los permisos suficientes para hacerlo.
// Si no tiene ni ADMIN ni CLIENT, no se puede hacer nada.
function validateRole(req, res = response, next) {
  // valida si el rol es el correcto
  const token = req.header("jwt-token");
  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    // Verifica y decodifica el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED); // Asegúrate de tener la clave secreta en tu archivo .env

    const { role } = decoded;

    // Cambié la condición para validar el rol
    if (role !== "ADMIN" && role !== "CLIENT") {
      return res
        .status(403)
        .json(
          "No tiene los permisos suficientes como para acceder a esta funcionalidad"
        );
    }

    next();
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Hubo un error tratando de leer el token",
        error: err.message,
      });
  }
}

module.exports = validateRole;
