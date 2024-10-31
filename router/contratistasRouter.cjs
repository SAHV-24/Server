const express = require("express");
const router = express.Router();
const validateJWT = require("../middlewares/validateJWT.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const contratistasController = require("../controllers/contratistasController.cjs");

router.post("/search", [validateRole], contratistasController.search);
router.get("/", [validateRole], contratistasController.getAll);
router.get("/username", [validateRole], contratistasController.getByUsername);
router.post("/insert", [validateJWT], contratistasController.insert);
router.put("/update/:id", [validateJWT], [validateRole], contratistasController.update);
router.delete("/delete/:id", [validateJWT], [validateRole], contratistasController.delete);

module.exports = router;
