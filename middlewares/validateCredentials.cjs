const Usuarios = require("../models/Usuarios.cjs");

// Es un middleware para validar que el uid, username y role
// que se envía a través del cuerpo de la petición, sea VÁLIDA

async function validateCredentials(req, res = response, next) {
  const { uid, username, role } = req.body;

  if (uid == "1" && role === "CLIENT") return next(); // si es el cliente y el uid es 1, entonces que siga.
  
  try {

    const foundUser = await Usuarios.findOne({ _id: uid }); // Encontrar un contratista que tenga ese id

    // si no es un objeto vacío
    if (foundUser) {
      const foundId = foundUser["_id"];
      const foundUsername = foundUser["username"];
      const foundRole = foundUser["rol"];

      // Si lo que se recibe no es lo mismo que está en la base de datos, entonces
      // no genera token ó recibe token
      if (uid != foundId || username != foundUsername || role != foundRole) {
        return res.status(400).json({
          message:
            "Los datos de esta persona no concuerdan con lo que hay en la base de datos.",
        });
      } else {
        // si todo está correcto, que siga con el siguiente middleware o controlador
        return next();
      }
    } else {
      return res.status(400).json({
        message:
          "No se encontró a alguien con este id, el id debe de corresponder al _id de la base de datos",
      });
    }
  } catch (exc) {
    return res.status(500).json({
      message:
        "El uid no cumple con los requisitos de 24 carácteres que se solicita",
    });
  }
}

module.exports = validateCredentials;
