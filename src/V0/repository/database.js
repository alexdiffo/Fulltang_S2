const Sequelize = require('sequelize')
require('dotenv').config()




const sequelize = new Sequelize(
    process.env.USERNAME,
    process.env.PASSWORD,
    process.env.DATABASE,
   {
    dialect:'sqlite',
    host: './dev.sqlite'
})

module.exports = sequelize;
