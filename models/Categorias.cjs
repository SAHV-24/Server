const mongoose = require("mongoose");
const StringReq = require("../utils/Strings.cjs").StringReq;
const StringReqUnique = require("../utils/Strings.cjs").StringReqUnique;
const StringUrls = require("../utils/Strings.cjs").StringUrls;


const categoriasSchema = {
  nombre: StringReqUnique,
  imagen: StringUrls
};

const Categorias = mongoose.model(
  "Categorias",
  new mongoose.Schema(categoriasSchema),
  "Categorias"
);

module.exports = Categorias;
