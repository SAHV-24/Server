const Citas = require("../models/Citas.cjs");
const Usuarios = require("../models/Usuarios.cjs");
const mongoose = require("mongoose");

// GET ALL
module.exports.getAll = async (req, res) => {
  try {
    const answer = await Citas.find();

    res.status(200).json(answer);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.getByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const citas = await Citas.aggregate([
      // Filtrar citas de los últimos 30 días
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
        $match: {
          "usuarioData.username": username,
        },
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
          "usuarioData.username": 1,
          contratistaUsuario: 1,
          idContratista: 1,
          categoriaData: 1,
          estado: 1,
          fecha: 1,
          hora: 1,
          locacion: 1,
          ratingUsuario: 1,
        },
      },
    ]);

    res.status(200).send(citas);
  } catch (exc) {
    res.status(500).send({ message: exc.message });
  }
};

//GET BY ID

module.exports.getById = async (req, res) => {
  try {
    const _id = req.query._id;

    const answer = await Citas.find({ _id }).lean();

    if (answer.length == 0 || !answer) {
      res.status(404).send("La cita no fue encontrada");
    } else {
      res.status(200).json(answer);
    }
  } catch (err) {
    console.error(`${err} al intentar acceder a la cita con id: ${_id}`);
    res.status(500).send(err);
  }
};

// INSERT
module.exports.insert = async (req, res) => {
  const { idUsuario, idContratista, idCategoria, fecha, hora } = req.body;
  // WE NEED TO VERIFY THAT THE SAME ARRANGEMENT CAN'T BE ADDED TWICE
  const query = await Citas.find({
    idUsuario,
    idContratista,
    idCategoria,
    fecha,
    hora,
  });

  if (query.length > 0) {
    return res.status(406).json({
      message:
        "Can't add the same arrangement with the same hour, date, and info",
    });
  }

  // ACTUALIZA EL USUARIO
  await Usuarios.findByIdAndUpdate(
    idUsuario,
    {
      $push: {
        ultimasCategorias: { categoriaId: idCategoria },
      },
    },
    { new: true, useFindAndModify: false }
  );

  const cita = new Citas({ ...req.body });

  try {
    const answer = await cita.save();
    res.status(200).send(answer);
  } catch (err) {
    res.status(400).send(err);
  }
};

// UPDATE
module.exports.update = async (req, res) => {
  try {
    const cita = await Citas.findById(req.params.id);

    const body = req.body;

    // Iteramos sobre los datos del cuerpo y actualizamos los campos de la cita
    Object.keys(body).forEach((key) => {
      if (body[key]) {
        cita[key] = body[key];
      }
    });

    // Guardamos la cita
    const answer = await cita.save(); // Cambiado para guardar la cita correctamente
    res.status(200).send(answer);
  } catch (err) {
    res.status(400).send(err);
  }
};

// DELETE
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const answer = await Citas.deleteOne({ _id: id });
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
