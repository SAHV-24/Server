const mongoose = require("mongoose");
const StringReq = require("../utils/Strings.cjs").StringReq;
const StringReqUnique = require("../utils/Strings.cjs").StringReqUnique;
const StringUrls = require("../utils/Strings.cjs").StringUrls;

const trabajosSchema = new mongoose.Schema({
  fotoTrabajo: StringReq,
});

const categoriasOfrecidasSchema = new mongoose.Schema({
  idCategoria: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categorias",
  },
  precioCategoria: { type: Number, required: true },
});

const contratistaSchema = new mongoose.Schema({
  nombre: StringReq,
  apellido: StringReq,
  ciudad: StringReq,
  especialidad: StringReq,
  email: StringReqUnique,
  username: StringReqUnique,
  password: StringReq,
  fotoDePerfil: StringUrls,
  ultimosTrabajos: { type: [trabajosSchema], default: [] },
  categoriasOfrecidas: [categoriasOfrecidasSchema],
});

const Contratistas = mongoose.model(
  "Contratistas",
  contratistaSchema,
  "Contratistas"
);

module.exports = Contratistas;
