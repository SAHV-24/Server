const Contratistas = require("../models/Contratistas.cjs");

// SEARCH}}

module.exports.search = async (req, res) => {
  const category = req?.body?.category;

  try {
    const contratistas = await Contratistas.aggregate([
      {
        $lookup: {
          from: "Categorias", // Nombre de la colección de categorías
          localField: "categoriasOfrecidas.idCategoria",
          foreignField: "_id",
          as: "categoriasInfo",
        },
      },
      {
        $unwind: { path: "$categoriasInfo" },
      },
      {
        $match: {
          "categoriasInfo.nombre": category, // Filtra por la categoría deseada
        },
      },
      {
        $lookup: {
          from: "Citas",
          localField: "_id",
          foreignField: "idContratista",
          as: "citasContratista",
        },
      },
      {
        $unwind: {
          path: "$citasContratista",
          preserveNullAndEmptyArrays: true, // Opcional: si quieres mantener contratistas sin citas
        },
      },
      {
        $group: {
          _id: "$_id", // Agrupar por el _id del contratista
          rating: { $avg: "$citasContratista.ratingUsuario" }, // Calcular el promedio del rating
          nombre: { $first: "$nombre" }, // Mantener otros campos
          apellido: { $first: "$apellido" },
          ciudad: { $first: "$ciudad" },
          especialidad: { $first: "$especialidad" },
          username: { $first: "$username" },
          fotoDePerfil: { $first: "$fotoDePerfil" },
          categoriasOfrecidas: {
            $push: { // Cambia a $push para mantener solo la categoría que coincida
              $filter: {
                input: "$categoriasOfrecidas",
                as: "cat",
                cond: { $eq: ["$$cat.idCategoria", "$categoriasInfo._id"] }, // Filtrar las categorías ofrecidas que coinciden
              },
            },
          },
          categoriasInfo: { $first: "$categoriasInfo" }, // Mantener solo la categoría que coincide
        },
      },
    ]);
    

    res.status(200).json(contratistas);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

// GET ALL
module.exports.getAll = async (req, res) => {
  try {
    const answer = await Contratistas.find();

    res.status(200).json(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

module.exports.getByUsername = async (req, res) => {
  try {
    const username = req.query.username;

    const answer = await Contratistas.find({ username }).lean();

    // Si no encuentras ningún usuario
    if (!answer || answer.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(answer);
  } catch (err) {
    console.error(err, " mientras se intentaba acceder al contratista");
    res.status(500).send(err);
  }
};

//INSERT
module.exports.insert = async (req, res) => {
  const contratista = new Contratistas({ ...req.body });

  try {
    const answer = await contratista.save();
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// UPDATE
module.exports.update = async (req, res) => {
  try {
    const contratista = await Contratistas.findById(req.params.id);

    const body = req.body;
    // This flag is added because "__v" attribute isn't working idkw
    const hasBeenUpdated = false;

    Object.keys(body).forEach((key) => {
      if (body[key]) {
        contratista[key] = body[key];
        this.hasBeenUpdated = true;
      }
    });

    if (hasBeenUpdated) {
      contratista["__v"] = contratista["__v"] + 1;
    }
    const answer = await contratista.save();
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
    const answer = await Contratistas.deleteOne({ _id: id });
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
