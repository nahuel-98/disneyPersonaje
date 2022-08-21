const {DataTypes} = require('sequelize')

module.exports= sequelize => {
    sequelize.define('Film' , {
        image: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        calification: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    },
    {timestamps: true, 
    createdAt: 'Creation date',
    updatedAt: false
});
}
