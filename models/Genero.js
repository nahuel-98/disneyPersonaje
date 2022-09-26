const {DataTypes} = require('sequelize')

module.exports= sequelize => {
    sequelize.define('Genero' , {
        name: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {timestamps: false
});
}
