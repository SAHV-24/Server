const express = require("express");
const router = express.Router();

const usuariosRouter = require("./usuariosRouter.cjs");
const contratistasRouter = require("./contratistasRouter.cjs");
const categoriasRouter = require("./categoriasRouter.cjs");
const citasRouter = require("./citasRouter.cjs");
const authRouter = require("./authRouter.cjs");

router.use("/Usuarios", usuariosRouter);
router.use("/Contratistas", contratistasRouter);
router.use("/Categorias", categoriasRouter);
router.use("/Citas", citasRouter);
router.use("/Auth", authRouter);

module.exports = router;
