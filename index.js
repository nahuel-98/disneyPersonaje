const app = require('./app')
require('./db') 
const verifyToken = require('./controllers/verifyToken')
const express = require('express');
var morgan = require("morgan");
const { db, Film, Character } = require("./db.js");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //permite entender lo que llegue de formularios convirtiendolo en un objeto JS.



//ESTADO: FUNCIONA
app.put("/transfer/:id", async (req, res) => {
  const { id } = req.params;
  let character = await Character.findByPk(id);
  res.json(await character.addFilms([4, 5]));
});

//ESTADO: FUNCIONA
app.get("/loadall", verifyToken,async (req, res) => {
  const allData = await Character.findAll({
    include: Film,
  });
  res.send(allData);
});



//3. Listado de personajes - ESTADO: HECHO
//6. Busqueda de personajes - Estado: HECHO - Busqueda por nombre, edad y IdMovie.
app.get("/characters", verifyToken,async (req, res) => {
  let { name, age, Movies } = req.query;
  if (name || age || Movies) {
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
          await Film.findAll({
            where: {
              id: Movies,
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
      res.json(characts);
    } catch (e) {
      res.send(e);
    }
  }
});

//5. Detalle de Personaje. ESTADO: HECHO
app.get("/character/:id", verifyToken,async (req, res) => {
  try {
    let { id } = req.params;
    res.json(
      await Character.findAll({
        where: {
          id,
        },
      })
    );
  } catch (e) {
    res.send(e);
  }
});

//4. CRUD. - listo

//CREATE. ESTADO: LISTO
app.post("/character", verifyToken,async (req, res) => {
  let { image, name, age, weight, history } = req.body;
  try {
    const newCharacter = await Character.create({
      image,
      name,
      age,
      weight,
      history,
    });
    res.json(newCharacter);
  } catch (e) {
    res.send(e);
  }
});

//UPDATE. ESTADO: LISTO
app.put("/character", verifyToken,async (req, res) => {
  const { id, name, age, weight, history } = req.body;
  try {
    const response = await Character.update(
      { name, age, weight, history },
      {
        where: {
          id,
        },
      }
    );
    res.send(`${response} personajes modificados`);
  } catch (e) {
    res.send(e);
  }
});

//DELETE. ESTADO: LISTA
app.delete("/character/:id", verifyToken,async (req, res) => {
  try {
    let { id } = req.params;
    res.json(
      await Character.destroy({
        where: {
          id,
        },
      })
    );
  } catch (e) {
    res.send(e);
  }
});

//MOVIES

//7. Listado de peliculas. Estado: Listo
app.get("/movies", verifyToken,async (req, res) => {
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
app.get("/films/:id", verifyToken,async (req, res) => {
  try {
    let { id } = req.params;
    const allData = await Film.findAll({
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
    res.json(allData);
  } catch (e) {
    res.send(e);
  }
});

//9. CRUD. Estado: Listo
//Create- Estado: Listo -
app.post("/film", verifyToken,async (req, res) => {
  let { image, title, calification } = req.body;
  try {
    const newFilm = await Film.create({
      image,
      title,
      calification,
    });

    console.log(newFilm.toJSON());
    res.json(newFilm);
  } catch (e) {
    res.send(e);
  }
});

//Update- Estado: Listo
app.put("/films", verifyToken,async (req, res) => {
  const { id, image, title, calification } = req.body;
  try {
    const response = await Film.update(
      { image, title, calification },
      {
        where: {
          id,
        },
      }
    );
    res.send(`${response} personajes modificados`);
  } catch (e) {
    res.send(e);
  }
});

//Delete - Estado: Lista
app.delete("/movies/:id", verifyToken,async (req, res) => {
  try {
    let { id } = req.params;
    res.json(
      await Film.destroy({
        where: {
          id,
        },
      })
    );
  } catch (e) {
    res.send(e);
  }
});


app.listen(4001, () => {
    console.log("Listening on port 4001 :)");
    db.sync({ force: false });
  });