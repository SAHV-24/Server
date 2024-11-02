const express = require("express");
const router = express.Router();
const validateJWT = require("../middlewares/validateJWT.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const contratistasController = require("../controllers/contratistasController.cjs");

// validateRole es para que sepa si el tipo de ROl del usuario es "CLIENT", "ADMIN" o "USER"
// validateJWT es para validar si lo que se está enviando aún no está expirado, esto se utiliza cuando un usuario es el que está realizando la acción...
//              ...y no la está haciendo el cliente (cliente = APP)

router.post("/search", [validateRole], contratistasController.search);
router.get("/", [validateRole], contratistasController.getAll);
router.get("/username", [validateRole], contratistasController.getByUsername); //! este se ha cambiado
router.post("/insert", [validateJWT], contratistasController.insert);
router.put(
  "/update/:id",
  [validateJWT],
  [validateRole],
  contratistasController.update
);
router.delete(
  "/delete/:id",
  [validateJWT],
  [validateRole],
  contratistasController.delete
);

module.exports = router;
