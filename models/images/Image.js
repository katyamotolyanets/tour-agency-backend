const { DataTypes } = require('sequelize');
const db = require('../../db-connection')

const Image = db.define('image', {
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
        image: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        original_file_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        file_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        uploaded_by_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        }
    },
    {
        timestamps: false,
        tableName: 'images_image',
        freezeTableName: true
    })

module.exports = Image;