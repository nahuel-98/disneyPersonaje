const {Film, Character} = require('../db.js')


const mostrarPelicula = async (req,res) => {
  try {
    let movies = await Film.findAll({
      attributes: ["image", "title", "Creation date"],
    });
    res.json(movies);
  } catch (e) {
    res.send(e);
  }
}

const detallePelicula = async (req,res) => {
  try {
    let { id } = req.params;
    const allData = await Film.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Character,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!allData) {
      return res
        .status(404)
        .send("La película/serie con el ID provisto no existe");
    }
    res.json(allData);
  } catch (e) {
    res.send(e);
  }
}

const crearPelicula = async (req,res) => {
  let { image, title, calification } = req.body;
  try {
    if (image && title && calification) {
      const newFilm = await Film.create({
        image,
        title,
        calification,
      });

      return res.status(201).json(newFilm);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para crear la película/serie"
      );
  } catch (e) {
    res.send(e);
  }
}

const actualizarPelicula = async (req,res) => {
  const { id, image, title, calification } = req.body;
  try {
    if (id && image && title && calification) {
      const response = await Film.update(
        { image, title, calification },
        {
          where: {
            id,
          },
        }
      );
      return res.send(`${response} films modificados`);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para modificar la película/serie"
      );
  } catch (e) {
    res.send(e);
  }
}

const eliminarPelicula = async (req,res) => {
  try {
    let { id } = req.params;
    const response = await Film.destroy({
      where: {
        id,
      },
    });
    if (response == 0) {
      return res
        .status(400)
        .send("El ID ingresado no corresponde a una película/serie válida");
    }
    return res.status(200).send(`${response} película/serie eliminada`);
  } catch (e) {
    res.send(e);
  }
}



module.exports = {
  mostrarPelicula,
  detallePelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
}