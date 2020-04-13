const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Fabric extends Model {
    }

    Fabric.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {sequelize, modelName: 'Fabric', paranoid: true});

    Fabric.associate = (models) => {
    }

    return Fabric;
};
