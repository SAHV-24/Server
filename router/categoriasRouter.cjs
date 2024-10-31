const express = require("express");
const router = express.Router();
const validateJWT = require("../middlewares/validateJWT.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const categoriasController = require("../controllers/categoriasController.cjs");

router.get("/", [validateRole], categoriasController.getAll);
router.get("/getById/:_id", [validateRole], categoriasController.getById);
router.post("/insert", [validateJWT], [validateRole], categoriasController.insert);
router.put("/update/:id", [validateJWT], [validateRole], categoriasController.update);
router.delete("/delete/:id", [validateJWT], [validateRole], categoriasController.delete);

module.exports = router;
