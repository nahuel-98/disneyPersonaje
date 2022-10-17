const { Sequelize, Op } = require("sequelize");
const modelCharacter = require("./models/Character.js");
const modelFilm = require("./models/Film.js");
const modelUser = require("./models/User.js");
const modelGenero = require("./models/Genero.js");
require("dotenv").config();
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    logging: false,
  }
);

modelCharacter(sequelize);
modelFilm(sequelize);
modelUser(sequelize);
modelGenero(sequelize);

let { Character, Film, Genero } = sequelize.models;

Character.belongsToMany(Film, { through: "CharacterXFilm" });
Film.belongsToMany(Character, { through: "CharacterXFilm" });
Film.belongsToMany(Genero, { through: "CharacterxGeneros" });
Genero.belongsToMany(Film, { through: "FilmxGeneros" });

module.exports = {
  ...sequelize.models,
  db: sequelize,
  Op,
};
