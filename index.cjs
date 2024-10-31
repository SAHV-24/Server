const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const router = require("./router/router.cjs"); // Cambié la extensión a .cjs
const db = require("./db/db.cjs");
const generateJWT = require("./JWT/generateJWT.cjs");
const dotenv = require("dotenv");

dotenv.config(); // Cargar variables de entorno

const app = express();

app.use(cors());
app.use(express.json());

const env = process.env;
const PORT = env.PORT || 3000;

app.use("/api", router);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:" + PORT);
});

module.exports = app; // Exportar usando CommonJS
