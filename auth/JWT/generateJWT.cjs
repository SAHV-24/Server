const jwt = require("jsonwebtoken");

function generateJWT(uid, username, role, secretKey) {

  const backendSecretKey = process.env.SECRET_JWT_SEED;

  // Si la llave ENTRANTE, es la misma que tiene el backend entonces
  // que intente generar el token
  if (secretKey === backendSecretKey)
    return new Promise((resolve, reject) => {

      console.log("PROMESA")

      if (uid && username && role) {

        console.log("!")

        const payload = { uid, username, role };

        const isClient = role === "CLIENT";

        const expiresIn = role === "USER" ? "2h" : "72000h";

        jwt.sign(
          payload,
          process.env.SECRET_JWT_SEED,
          !isClient
            ? {
                expiresIn,
              }
            : {},
          (error, token) => {
            if (error) {
              console.log("there was an error: " + error);
              reject("No se pudo generar el token");
            }
            resolve(token);
          }
        );
      } else {
        console.log("REJECTEADO")

        reject("No se enviaron todos los campos");
      }
    });
}

module.exports = generateJWT;
