const jwt = require("jsonwebtoken");

function generateJWT(uid, username, role) {
  return new Promise((resolve, reject) => {
    // Agrega 'return' aquí
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
  });
}

module.exports = generateJWT;
