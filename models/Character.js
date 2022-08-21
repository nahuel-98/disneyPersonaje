const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      image: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 150,
        },
      },
      weight: {
        type: DataTypes.INTEGER,
      },
      history: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false, createdAt: false, updatedAt: false }
  );
};
