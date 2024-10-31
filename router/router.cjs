const express = require("express");
const router = express.Router();
const validateJWT = require("../JWT/generateJWT.cjs");

const categoriasController = require("../controllers/categoriasController.cjs");
const citasController = require("../controllers/citasController.cjs");
const usuariosController = require("../controllers/usuariosController.cjs");
const contratistasController = require("../controllers/contratistasController.cjs");
const validateRole = require("../middlewares/validateRole.cjs");
const { default: generateJWT } = require("../JWT/generateJWT.cjs");

router.post("/search", [validateRole], contratistasController.search);

router.get("/Usuarios", [validateRole], usuariosController.getAll);
router.get("/Contratistas", [validateRole], contratistasController.getAll);
router.get("/Categorias", [validateRole], categoriasController.getAll);
router.get("/Citas", [validateRole], citasController.getAll);

// Get by certain parameter, by username, etc..
router.get(
  "/Usuarios/getByEmail/:email",
  [validateRole],
  usuariosController.getByEmail
);

// Get by certain parameter, by username, etc..
router.get(
  "/Usuarios/getByUsername/:username",
  [validateRole],
  usuariosController.getByUsername
);
// this works with query params, such as : ../Usuarios/username?username='username'
router.get(
  "/Contratistas/username",
  [validateRole],
  contratistasController.getByUsername
);
// this works with query params, such as : ../Contratistas/username?username='username'
router.get(
  "/Categorias/getById/:_id",
  [validateRole],
  categoriasController.getById
);
// this works with query params, such as : ../Categorias/getById?_id='id'
router.get("/Citas/getById", [validateRole], citasController.getById);
// this works with query params, such as : ../Categorias/getById?_id='id'

router.post(
  "/Usuarios/insert",
  [validateJWT],
  [validateRole],
  usuariosController.insert
);
router.post(
  "/Contratistas/insert",
  [validateJWT],
  contratistasController.insert
);
router.post(
  "/Categorias/insert",
  [validateJWT],
  [validateRole],
  categoriasController.insert
);
router.post(
  "/Citas/insert",
  [validateJWT],
  [validateRole],
  citasController.insert
);

router.post("/login",async (req,res)=>{

  const{username,password}  = req.body

  if(username == "sergio" && password ){

    const response = await generateJWT(1234, username, password)

  }

  // TODO
  res.header("router-")


})


router.put(
  "/Usuarios/update/:id",
  [validateJWT],
  [validateRole],
  usuariosController.update
);
router.put(
  "/Contratistas/update/:id",
  [validateJWT],
  [validateRole],
  contratistasController.update
);
router.put(
  "/Categorias/update/:id",
  [validateJWT],
  [validateRole],
  categoriasController.update
);
router.put(
  "/Citas/update/:id",
  [validateJWT],
  [validateRole],
  citasController.update
);

router.delete(
  "/Usuarios/delete/:id",
  [validateJWT],
  [validateRole],
  usuariosController.delete
);
router.delete(
  "/Contratistas/delete/:id",
  [validateJWT],
  [validateRole],
  contratistasController.delete
);
router.delete(
  "/Categorias/delete/:id",
  [validateJWT],
  [validateRole],
  categoriasController.delete
);
router.delete(
  "/Citas/delete/:id",
  [validateJWT],
  [validateRole],
  citasController.delete
);

module.exports = router;
