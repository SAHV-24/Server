const express = require("express");
const router = express.Router();
const validateJWT = require("../middlewares/validateJWT.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const citasController = require("../controllers/citasController.cjs");

router.get("/", [validateRole], citasController.getAll);
router.get("/getById", [validateRole], citasController.getById);
router.get("/getByUsername/:username", [validateRole], citasController.getByUsername);
router.post("/insert", [validateJWT], [validateRole], citasController.insert);
router.put("/update/:id", [validateJWT], [validateRole], citasController.update);
router.delete("/delete/:id", [validateJWT], [validateRole], citasController.delete);

module.exports = router;
