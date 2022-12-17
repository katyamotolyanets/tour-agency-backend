const {DataTypes} = require('sequelize');
const db = require('../../db-connection')

const City = db.define('city', {
        destination_ptr_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        timestamps: false,
        tableName: 'locations_city',
        freezeTableName: true
    })

module.exports = City;