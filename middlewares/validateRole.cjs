const { response } = require("express");
const jwt = require("jsonwebtoken")

function validateRole(req, res = response, next) {
  // valida si el rol es el correcto
  const token = req.header("jwt-token");
  try {
    const { role } = jwt.read(token);

    if (role !== "ADMIN" || role != "CLIENT") {
      res
        .status(500)
        .json(
          "No tiene los permisos suficientes como para acceder a esta funcionalidad"
        );
    } else {
      next();
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Hubo un error tratando de leer el token" });
  }
}

module.exports = validateRole;
