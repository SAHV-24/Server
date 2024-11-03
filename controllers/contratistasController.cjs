const Contratistas = require("../models/Contratistas.cjs");
const mongoose = require("mongoose");
// GET AGGREGATION WITH USER

// SEARCH

module.exports.search = async (req, res) => {
  const category = req?.body?.category;

  try {
    const contratistas = await Contratistas.aggregate([
      {
        $lookup: {
          from: "Usuarios",
          localField: "usuarioId",
          foreignField: "_id",
          as: "usuarioData",
        },
      },
      {
        $unwind: { path: "$usuarioData" },
      },
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
          nombre: { $first: "$usuarioData.nombre" }, // Mantener otros campos
          apellido: { $first: "$usuarioData.apellido" },
          ciudad: { $first: "$usuarioData.ciudad" },
          especialidad: { $first: "$usuarioData.especialidad" },
          username: { $first: "$usuarioData.username" },
          fotoDePerfil: { $first: "$usuarioData.fotoDePerfil" },
          categoriasOfrecidas: {
            $push: {
              // Cambia a $push para mantener solo la categoría que coincida
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
    const response = await Contratistas.aggregate([
      {
        $lookup: {
          from: "Usuarios",
          localField: "usuarioId",
          foreignField: "_id",
          as: "usuarioDatos",
        },
      },
      {
        $unwind: { path: "$usuarioDatos" },
      },
    ]);

    res.status(200).json(response);
  } catch (exc) {
    res.status(500).json({ exception: exc.message });
    console.log(exc);
  }
};

module.exports.getByUsername = async (req, res) => {
  try {
    const usernameSent = req.params.username;

    const answer = await Contratistas.aggregate([
      {
        $lookup: {
          from: "Usuarios",
          localField: "usuarioId",
          foreignField: "_id",
          as: "usuarioInfo",
        },
      },
      {
        $match: {
          "usuarioInfo.username": usernameSent,
        },
      },
      { $unwind: "$categoriasOfrecidas" },
      {
        $lookup: {
          from: "Categorias",
          localField: "categoriasOfrecidas.categoriaId",
          foreignField: "_id",
          as: "categoriasDetails",
        },
      },
    ]);

    // Filtramos los contratistas que efectivamente tengan un usuario con ese username
    const contratistaConUsuario = answer.filter((c) => c.usuarioId);

    if (contratistaConUsuario.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(contratistaConUsuario);
  } catch (err) {
    console.error(err, " mientras se intentaba acceder al contratista");
    res.status(500).send(err);
  }
};

//INSERT
module.exports.insert = async (req, res) => {
  const contratista = new Contratistas(req.body);

  try {
    const answer = await contratista.save();
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedContratista = await Contratistas.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedContratista) {
      return res.status(404).json({ message: "Contratista no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Correctamente Actualizado", updatedContratista });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

//DELETE
module.exports.delete = async (req, res) => {
  const id = req.params.id; // se envía ../delete/${id}

  try {
    const answer = await Contratistas.deleteOne({ _id: id });
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

module.exports.getCategoriasOfrecidas = async (req, res) => {
  const _id = req.params._id;

  try {
    const contratistas = await Contratistas.aggregate([
      { $unwind: "$categoriasOfrecidas" },
      {
        $lookup: {
          from: "Categorias",
          localField: "categoriasOfrecidas.categoriaId",
          foreignField: "_id",
          as: "categoriasDetails",
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
        },
      },
    ]);
    res.status(200).json(contratistas);
  } catch (error) {
    console.error("Error en la agregación:", error);
  }
};
