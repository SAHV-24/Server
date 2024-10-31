const mongoose = require("mongoose");
const StringReq = require("../utils/Strings.cjs").StringReq;

const citasSchema = {
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
  idContratista: { type: mongoose.Schema.Types.ObjectId, ref: "Contratistas" },
  idCategoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categorias" },
  fecha: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  hora: {
    type: String,
    required: true,
  },
  locacion: {
    type: String,
    required: true,
  },
  estado: {
    type: [String],
    enum: ["Confirmada","Pendiente","Cancelada"],
    required: true,
  },
  ratingUsuario: {
    type: Number,
    required: true,
  },
};

const Citas = mongoose.model("Citas", citasSchema, "Citas");

module.exports = Citas;
