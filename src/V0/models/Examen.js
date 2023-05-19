const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Result = require('./Resultat')

class Examen extends Model {}

Examen.init({
    nom:{
        type: DataTypes.TEXT        
    },
    libelle:{
        type: DataTypes.TEXT        
    },
}, {
    sequelize,
    modelName: 'examen'
}
)



module.exports = Examen
