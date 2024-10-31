const Citas = require("../models/Citas.cjs");

// GET ALL
module.exports.getAll = async (req, res) => {
  try {
    const answer = await Citas.find();

    res.status(200).json(answer);
  } catch (err) {
    res.status(400).send(err);
  }
};

//GET BY ID

module.exports.getById = async (req,res)=>{  

  try{
    const _id = req.query._id

    const answer = await Citas.find({_id}).lean()

    if(answer.length == 0 || !answer){
      res.status(404).send("La cita no fue encontrada")
    }else{
      
      res.status(200).json(answer)
    }   
    
  }catch(err){
    
    console.error(`${err} al intentar acceder a la cita con id: ${_id}`)
    res.status(500).send(err)
  }
}





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
    // This flag is added because "__v" attribute isn't working idkw
    const hasBeenUpdated = false;

    Object.keys(body).forEach((key) => {
      if (body[key]) {
        cita[key] = body[key];
        this.hasBeenUpdated = true;
      }
    });

    if (hasBeenUpdated) {
      cita["__v"] = cita["__v"] + 1;
    }
    const answer = await cita.save();
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
