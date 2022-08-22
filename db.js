const { Sequelize, Op } = require("sequelize");
const modelCharacter = require("./models/Character.js");
const modelFilm = require("./models/Film.js");
const modelUser = require('./models/User.js')
require('dotenv').config()
const sequelize = new Sequelize(`
  postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/disneydb`,
  {
    logging: false,
  }
);

modelCharacter(sequelize);
modelFilm(sequelize);
modelUser(sequelize)

let { Character, Film } = sequelize.models;

Character.belongsToMany(Film, { through: "CharacterXFilm" });
Film.belongsToMany(Character, { through: "CharacterXFilm" });

module.exports = {
  ...sequelize.models,
  db: sequelize,
  Op,
};
