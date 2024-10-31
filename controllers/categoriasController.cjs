const Categorias = require("../models/Categorias.cjs");

// GET ALL
module.exports.getAll = async (req, res) => {
  try {
    const r = await Categorias.findOne();
    res.status(200);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

// GET BY ID

module.exports.getById = async (req, res) => {
  const _id = req.params._id;

  try {
    const answer = await Categorias.findOne({ _id }).lean();

    if (answer == {} || !answer) {
      res.status(404).send("La categoría no fue encontrada");
    } else {
      res.status(200).json(answer);
    }
  } catch (err) {
    console.error(`${err} al intentar acceder a la categoría con id: ${_id}`);
    res.status(500).send(err);
  }
};

// INSERT
module.exports.insert = async (req, res) => {
  const categoria = new Categorias({ ...req.body });

  try {
    const answer = await categoria.save();
    res.status(201).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// UPDATE
module.exports.update = async (req, res) => {
  try {
    const categoria = await Categorias.findById(req.params.id);

    const body = req.body;
    // This flag is added because "__v" attribute isn't working idkw
    const hasBeenUpdated = false;

    Object.keys(body).forEach((key) => {
      if (body[key]) {
        categoria[key] = body[key];
        this.hasBeenUpdated = true;
      }
    });

    if (hasBeenUpdated) {
      categoria["__v"] = categoria["__v"] + 1;
    }
    const answer = await categoria.save();
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// DELETE
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const answer = await Categorias.deleteOne({ _id: id });
    res.status(200).send(answer);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};
