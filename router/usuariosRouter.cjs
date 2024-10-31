const express = require("express");
const router = express.Router();
const validateJWT = require("../auth/JWT/generateJWT.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const usuariosController = require("../controllers/usuariosController.cjs");

router.get("/", [validateRole], usuariosController.getAll);
router.get("/getByEmail/:email", [validateRole], usuariosController.getByEmail);
router.get("/getByUsername/:username", [validateRole], usuariosController.getByUsername);
router.post("/insert", [validateJWT], [validateRole], usuariosController.insert);
router.put("/update/:id", [validateJWT], [validateRole], usuariosController.update);
router.delete("/delete/:id", [validateJWT], [validateRole], usuariosController.delete);

module.exports = router;
