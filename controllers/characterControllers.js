const { Film, Character, Genero } = require("../db.js");

const obtenerPersonajes = async (req, res) => {
  let { name, age, movies } = req.query;

  if (name || age || movies) {
    if (name) {
      try {
        const character = await Character.findAll({ where: { name } });
        if(character.length===0){
          return res.status(404).json('No hay personajes con ese nombre');
        }
        res.status(200).json(character);
      } catch (e) {
        res.send(e);
      }
    } else if (age) {
      try {
        const character = await Character.findAll({ where: { age } });
        if(character.length===0){
          return res.status(404).json('No hay personajes con esa edad');
        }
        res.status(200).json(character);
      } catch (e) {
        res.send(e);
      }
    } else {
      try {
        const character = await Film.findOne({
          where: { id: movies },
          include: [
            {
              model: Character,
              attributes: ["name", "id", "image", "weight", "age", "history"],
              through: {
                attributes: [],
              },
            },
          ],
        });
        res.status(200).json(character);
      } catch (e) {
        res.send(e);
      }
    }
  } else {
    try {
      let characts = await Character.findAll({ attributes: ["image", "name"] });
      return res.json(characts);
    } catch (e) {
      return res.send(e);
    }
  }
};

//Funciona!
//MODIFICADO, ADD SWAGGER
const crearPersonaje = async (req, res) => {
  try {
    const { image, name, age, weight, history, film } = req.body;
    if (image && name && age && weight && history && film) {
      const newCharacter = await Character.findOrCreate({
        where: {
          image,
          name,
          age,
          weight,
          history,
        },
      });
      //Si no se encuentra la peli en la BBDD, crearla, caso contrario, encontrar su ID y vincularla con este personaje
      // Todo personaje tiene que estar en una película SI o SI, entonces. Si el personaje no está en la BBDD, no significa que la Peli no exista, puede que sí.
      //Si se creó el personaje porque no estaba en la BBDD (boolean true), entonces crea la pelicula y la vincula.
      const newGenre = await Genero.findOrCreate({where: {name: film.genre.name,image: film.genre.image}});

      // if(newCharacter[1] && film){
      const newFilm = await Film.findOrCreate({
        where: {
          image: film.image,
          title: film.title,
          calification: film.calification,
        },
      });

      await newCharacter[0].addFilm(newFilm[0]);
      await newFilm[0].addGenero(newGenre[0]);
      await newGenre[0].addFilm(newFilm[0]);

      return res.status(201).json(newCharacter[0]);
    }
    return res.status(400).send("Falta ingresar el valor de una o más propiedades para crear el personaje");
  } catch (e) {
    res.send(e);
  }
};

//MODIFICADO, ADD SWAGGER
const detallePersonaje = async (req, res) => {
  try {
    let { id } = req.params;

    const character = await Character.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Film,
          attributes: ["title", "id", "calification", "image"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!character) {
      return res.status(404).send("El personaje con el ID provisto no existe");
    }
    return res.send(character);
  } catch (e) {
    res.send(e);
  }
};

const eliminarPersonaje = async (req, res) => {
  try {
    let { id } = req.params;
    const response = await Character.destroy({ where: { id } });

    if (response == 0) {
      return res.status(400).send("El ID ingresado no corresponde a un personaje válido");
    }
    return res.status(200).send(` ${response} personaje eliminado`);
  } catch (e) {
    res.send(e);
  }
};

const actualizarPersonaje = async (req, res) => {
  const { id } = req.params
  const { name, age, weight, history } = req.body;

  try {
    if (id && name && age && weight && history) {
      const response = await Character.update({ name, age, weight, history },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).send(`${response} personajes modificados`);
    }
    return res.status(400).send("Falta ingresar el valor de una o más propiedades para modificar el personaje");
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  obtenerPersonajes,
  crearPersonaje,
  detallePersonaje,
  eliminarPersonaje,
  actualizarPersonaje,
};
