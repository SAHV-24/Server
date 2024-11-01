const express = require("express");
const router = express.Router();
const { response } = require("express");
const validateCredentials = require("../middlewares/validateCredentials.cjs");
const validateJWT = require("../middlewares/validateJWT.cjs");
const authController = require("../controllers/authController.cjs");
const usuariosController = require("../controllers/usuariosController.cjs");
const Usuarios = require("../models/Usuarios.cjs");

router.post("/", [validateCredentials], authController.generateToken);
router.post("/verifyToken", [validateJWT], async (req, res) => {
  try {
    const username = req.user.username;

    const answer = await Usuarios.findOne({ username }).lean();

    // Si no encuentras ningún usuario
    if (!answer || answer.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(answer);
  } catch (err) {
    console.error(err, " while trying to access the user");
    res.status(500).send(err);
  }
});

module.exports = router;
