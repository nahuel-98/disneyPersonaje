const app = require("./app");
require("./db");
const verifyToken = require("./controllers/verifyToken");
const express = require("express");
var morgan = require("morgan");
const { db, Film, Character } = require("./db.js");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //permite entender lo que llegue de formularios convirtiendolo en un objeto JS.

//3. Listado de personajes - ESTADO: HECHO
//6. Busqueda de personajes - Estado: HECHO - Busqueda por nombre, edad y IdMovie.
app.get("/characters", verifyToken, async (req, res) => {
  let { name, age, movies } = req.query;
  if (name || age || movies) {
    if (name) {
      try {
        res.json(
          await Character.findAll({
            where: {
              name,
            },
          })
        );
      } catch (e) {
        res.send(e);
      }
    } else if (age) {
      try {
        res.json(
          await Character.findAll({
            where: {
              age,
            },
          })
        );
      } catch (e) {
        res.send(e);
      }
    } else {
      try {
        res.json(
          await Film.findOne({
            where: {
              id: movies,
            },
          })
        );
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
});

//5. Detalle de Personaje. ESTADO: HECHO
app.get("/character/:id", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;

    const character = await Character.findOne({
      where: {
        id,
      },
    });
    if (!character) {
      return res.status(404).send("El personaje con el ID provisto no existe");
    }
    return res.send(character);
  } catch (e) {
    res.send(e);
  }
});

//4. CRUD. - listo

//CREATE. ESTADO: LISTO
app.post("/character", verifyToken, async (req, res) => {
  let { image, name, age, weight, history } = req.body;
  try {
    if (image && name && age && weight && history) {
      const newCharacter = await Character.create({
        image,
        name,
        age,
        weight,
        history,
      });
      return res.status(201).json(newCharacter);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para crear el personaje"
      );
  } catch (e) {
    res.send(e);
  }
});

//UPDATE. ESTADO: LISTO
app.put("/character", verifyToken, async (req, res) => {
  const { id, name, age, weight, history } = req.body;
  try {
    if (id && name && age && weight && history) {
      const response = await Character.update(
        { name, age, weight, history },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).send(`${response} personajes modificados`);
    }
    return res
      .status(400)
      .send(
        "Falta ingresar el valor de una o más propiedades para modificar el personaje"
      );
  } catch (e) {
    res.send(e);
  }
});

//DELETE. ESTADO: LISTA
app.delete("/character/:id", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;
    const response = await Character.destroy({
      where: {
        id,
      },
    });

    if (response == 0) {
      return res
        .status(400)
        .send("El ID ingresado no corresponde a un personaje válido");
    }
    return res.status(200).send(` ${response} personaje modificado`);
  } catch (e) {
    res.send(e);
  }
});

//MOVIES

//7. Listado de peliculas. Estado: Listo
app.get("/movies", verifyToken, async (req, res) => {
  try {
    let movies = await Film.findAll({
      attributes: ["image", "title", "Creation date"],
    });
    res.json(movies);
  } catch (e) {
    res.send(e);
  }
});

//8. Detalle de películas con sus personajes. Estado: Listo
app.get("/films/:id", verifyToken, async (req, res) => {
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
});

//9. CRUD. Estado: Listo
//Create- Estado: Listo -
app.post("/film", verifyToken, async (req, res) => {
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
});

//Update- Estado: Listo
app.put("/films", async (req, res) => {
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
});

//Delete - Estado: Lista
app.delete("/movies/:id", async (req, res) => {
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
});

var server = app.listen(4001, () => {
  console.log("Listening on port 4001 :)");
  db.sync({ force: false });
});

module.exports = server;
