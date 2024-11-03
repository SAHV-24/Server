const mongoose = require("mongoose");

const Contratistas = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  especialidad: {
    type: String,
    required: true,
  },
  ultimosTrabajos: [
    {
      fotoTrabajo: {
        type: String,
        required: true,
      },
    },
  ],
  categoriasOfrecidas: [
    {
      categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Categoria",
      },
      precio: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Contratistas", Contratistas, "Contratistas");
