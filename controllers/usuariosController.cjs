const Usuarios = require("../models/Usuarios.cjs");
const Citas = require("../models/Citas.cjs");
const mongoose = require("mongoose");

// GET ALL
module.exports.getAll = async (req, res) => {
  try {
    const answer = await Usuarios.find();

    res.status(200).json(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

module.exports.getByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const answer = await Usuarios.findOne({ email: email }).lean();

    if (!answer) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el usuario " + email });
  }
};

module.exports.getByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    // Asegúrate de esperar la resolución de la promesa
    const answer = await Usuarios.findOne({ username }).lean();

    // Si no encuentras ningún usuario
    if (!answer || answer.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(answer);
  } catch (err) {
    console.error(err, " while trying to access the user");
    res.status(500).send(err);
  }
};

// GET LAST CITAS

module.exports.getLastCitas = async (req, res) => {
  const { _id } = req.params;

  const currentDate = new Date();
  const thirtyDaysAgo = currentDate.setDate(currentDate.getDate() - 30);

  try {
    const citas = await Citas.aggregate([
      // Filtrar citas de los últimos 30 días
      {
        $match: {
          idUsuario: new mongoose.Types.ObjectId(_id),
          fecha: { $gte: new Date(thirtyDaysAgo) },
        },
      },
      {
        $lookup: {
          from: "Usuarios",
          localField: "idUsuario",
          foreignField: "_id",
          as: "usuarioData",
        },
      },
      {
        $unwind: "$usuarioData",
      },
      {
        $lookup: {
          from: "Contratistas",
          localField: "idContratista",
          foreignField: "_id",
          as: "contratistaData",
        },
      },
      {
        $unwind: "$contratistaData",
      },
      {
        $lookup: {
          from: "Usuarios",
          localField: "contratistaData.usuarioId",
          foreignField: "_id",
          as: "contratistaUsuario",
        },
      },
      { $unwind: "$contratistaUsuario" },
      // Lookup para la colección de categorías
      {
        $lookup: {
          from: "Categorias",
          localField: "idCategoria",
          foreignField: "_id",
          as: "categoriaData",
        },
      },
      {
        $unwind: "$categoriaData",
      },
      {
        $project: {
          contratistaUsuario: 1,
          estado:1,
          fecha: 1,
          hora: 1,
          locacion: 1,
          ratingUsuario: 1,
        },
      },
    ]);

    res.status(200).send(citas);
  } catch (exc) {
    res.status(400).send({ message: `Hubo un error: ${exc.message}` });
  }
};

// INSERT
module.exports.insert = async (req, res) => {
  try {
    const { email, username } = req.body;

    const existingEmail = await Usuarios.findOne({ email });
    if (existingEmail) {
      return res.status(409).send({ message: "Email already registered." });
    }

    const existingUsername = await Usuarios.findOne({ username });
    if (existingUsername) {
      return res.status(409).send({ message: "Username already exists." });
    }

    const usuario = new Usuarios({ ...req.body });
    const answer = await usuario.save();
    res.status(201).send(usuario);
  } catch (err) {
    console.error("There was an error:", err.message);
    res.status(400).send({ message: err.message });
  }
};

// UPDATE
module.exports.update = async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id);

    const body = req.body;
    // This flag is added because "__v" attribute isn't working idkw
    const hasBeenUpdated = false;

    Object.keys(body).forEach((key) => {
      if (body[key]) {
        usuario[key] = body[key];
        this.hasBeenUpdated = true;
      }
    });

    if (hasBeenUpdated) {
      usuario["__v"] = usuario["__v"] + 1;
    }
    const answer = await usuario.save();
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

//DELETE
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const answer = await Usuarios.deleteOne({ _id: id });
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
