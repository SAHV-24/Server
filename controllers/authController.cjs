const generateJWT = require("../auth/JWT/generateJWT.cjs");
const { response } = require("express");

module.exports.generateToken = async (req, res = response) => {
  const { uid, username, role, secretKey } = req.body;

  try {
    const token = await generateJWT(uid, username, role, secretKey);

    if (token) {
      // Establecer el token en el cuerpo de la respuesta
      res.status(200).json({ message: "OK", token });
    } else {
      res.status(500).json({ message: "No se pudo autenticar" });
    }
  } catch (err) {
    // Manejo de errores
    console.error(err); // Log para depuración
    res.status(500).json({ message: err });
  }
};


module.exports.validateTokenAndRetrieveUser = async(req, res=response)=>{

}