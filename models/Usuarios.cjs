const mongoose = require("mongoose");
const StringReq = require("../utils/Strings.cjs").StringReq;
const StringReqUnique = require("../utils/Strings.cjs").StringReqUnique;
const StringUrls = require("../utils/Strings.cjs").StringUrls;

const categoriasSchema = new mongoose.Schema({
  categoriaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categorias",
  },
});

const usuariosSchema = {
  email: StringReqUnique,
  nombre: StringReq,
  apellido: StringReq,
  ciudad: StringReq,
  username: StringReqUnique,
  password: StringReq,
  rol: StringReq,
  fotoDePerfil: mongoose.Schema.Types.String,
  ultimasCategorias: { type: [categoriasSchema], default: [], required: true },
};

const Usuarios = mongoose.model(
  "Usuarios",
  new mongoose.Schema(usuariosSchema),
  "Usuarios"
);

module.exports = Usuarios;
