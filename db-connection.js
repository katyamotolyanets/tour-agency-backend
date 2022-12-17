const  { Sequelize } = require('sequelize')

const {POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, DB_HOST} = process.env;

module.exports = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
    host: DB_HOST,
    dialect:  'postgres'
});
