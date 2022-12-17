const { DataTypes } = require('sequelize');
const db = require('../db-connection')

const Tour = db.define('tour', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    modified: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    tour_type: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    max_passengers: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    }
},
{
    timestamps: false,
    tableName: 'tours_tour',
    freezeTableName: true
})

module.exports = Tour;