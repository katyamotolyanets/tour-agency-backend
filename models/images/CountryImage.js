const { DataTypes } = require('sequelize');
const db = require('../../db-connection')
const Country = require("../locations/Country");

const CountryImage = db.define('countryImage', {
        image_ptr_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        country_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Country,
                key: "id"
            }
        }
    },
    {
        timestamps: false,
        tableName: 'images_countryimage',
        freezeTableName: true
    })

module.exports = CountryImage;