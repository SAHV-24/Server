const jwt = require("jsonwebtoken");

function generateJWT(uid, username, role) {
  return new Promise((resolve, reject) => {
    if (uid && username && role) {
      const payload = { uid, username, role };

      const expiresIn = role === "USER" ? "2h" : "72000h";

      jwt.sign(
        payload,
        process.env.SECRET_JWT_SEED,
        {
          expiresIn,
        },
        (error, token) => {
          if (error) {
            console.log("there was an error: " + error);
            reject("No se pudo generar el token");
          }
          resolve(token);
        }
      );
    } else {
      reject("No se enviaron todos los campos");
    }
  });
}

module.exports = generateJWT;